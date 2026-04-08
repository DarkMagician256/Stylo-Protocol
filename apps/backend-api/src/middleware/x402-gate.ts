// ============================================================================
// x402 MIDDLEWARE — Payment Gate for Agentic API Calls
// Intercepts requests to premium endpoints, verifies on-chain USDC payment
// before resolving the API call ($0.01 - $0.05 per request)
// ============================================================================

import type { Request, Response, NextFunction } from "express";
import { verifyX402Payment } from "../services/x402-verifier.js";

export interface X402Request extends Request {
  x402?: {
    payer: string;
    amount: number;
    txHash: string;
    verified: boolean;
  };
}

/**
 * x402 Payment Verification Middleware
 *
 * Expected headers:
 *   X-402-Payment: <tx-hash>
 *   X-402-Payer: <ethereum-address>
 *   X-402-Amount: <usdc-amount>
 *
 * Flow:
 * 1. Extract payment proof from headers
 * 2. Verify on-chain USDC transfer to escrow contract
 * 3. If valid, attach payment data to request and proceed
 * 4. If invalid, return 402 Payment Required
 */
export async function x402Middleware(
  req: X402Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const txHash = req.headers["x-402-payment"] as string;
  const payer = req.headers["x-402-payer"] as string;
  const amount = parseFloat(req.headers["x-402-amount"] as string);

  // Check required headers
  if (!txHash || !payer) {
    res.status(402).json({
      success: false,
      error: {
        code: "PAYMENT_REQUIRED",
        message: "x402 payment required. Include X-402-Payment and X-402-Payer headers.",
        pricing: {
          currency: "USDC",
          network: "Arbitrum One",
          minPayment: 0.01,
          maxPayment: 0.05,
          escrowContract: process.env.X402_ESCROW_ADDRESS,
        },
      },
      timestamp: Date.now(),
    });
    return;
  }

  // Validate payment amount
  const minPayment = parseFloat(process.env.X402_MIN_PAYMENT || "0.01");
  const maxPayment = parseFloat(process.env.X402_MAX_PAYMENT || "0.05");

  if (isNaN(amount) || amount < minPayment || amount > maxPayment) {
    res.status(402).json({
      success: false,
      error: {
        code: "INVALID_PAYMENT_AMOUNT",
        message: `Payment must be between $${minPayment} and $${maxPayment} USDC`,
      },
      timestamp: Date.now(),
    });
    return;
  }

  try {
    // Verify on-chain payment
    const verification = await verifyX402Payment({
      txHash,
      payer,
      expectedAmount: amount,
      escrowAddress: process.env.X402_ESCROW_ADDRESS || "",
      usdcAddress: process.env.USDC_ADDRESS || "",
    });

    if (!verification.valid) {
      res.status(402).json({
        success: false,
        error: {
          code: "PAYMENT_VERIFICATION_FAILED",
          message: verification.reason || "Payment could not be verified on-chain",
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Attach verified payment data to request
    req.x402 = {
      payer,
      amount,
      txHash,
      verified: true,
    };

    next();
  } catch (error) {
    console.error("x402 verification error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "VERIFICATION_ERROR",
        message: "Internal error during payment verification",
      },
      timestamp: Date.now(),
    });
  }
}
