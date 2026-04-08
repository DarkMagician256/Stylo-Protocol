// ============================================================================
// x402 Payment Verifier
// Verifies on-chain USDC transfers to the escrow contract
// ============================================================================

import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

interface VerifyPaymentParams {
  txHash: string;
  payer: string;
  expectedAmount: number;
  escrowAddress: string;
  usdcAddress: string;
}

interface VerificationResult {
  valid: boolean;
  reason?: string;
  blockNumber?: bigint;
  timestamp?: number;
}

const USDC_DECIMALS = 6;

const client = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc"),
});

export async function verifyX402Payment(
  params: VerifyPaymentParams
): Promise<VerificationResult> {
  try {
    // Fetch transaction receipt
    const receipt = await client.getTransactionReceipt({
      hash: params.txHash as `0x${string}`,
    });

    if (!receipt) {
      return { valid: false, reason: "Transaction not found" };
    }

    if (receipt.status !== "success") {
      return { valid: false, reason: "Transaction reverted" };
    }

    // Parse USDC Transfer events from receipt
    const transferLogs = receipt.logs.filter(
      (log) =>
        log.address.toLowerCase() === params.usdcAddress.toLowerCase() &&
        log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" // Transfer event signature
    );

    if (transferLogs.length === 0) {
      return { valid: false, reason: "No USDC transfer found in transaction" };
    }

    // Verify transfer details
    const expectedAmountRaw = BigInt(
      Math.round(params.expectedAmount * 10 ** USDC_DECIMALS)
    );

    for (const log of transferLogs) {
      const from = `0x${log.topics[1]?.slice(26)}`.toLowerCase();
      const to = `0x${log.topics[2]?.slice(26)}`.toLowerCase();
      const value = BigInt(log.data);

      if (
        from === params.payer.toLowerCase() &&
        to === params.escrowAddress.toLowerCase() &&
        value >= expectedAmountRaw
      ) {
        return {
          valid: true,
          blockNumber: receipt.blockNumber,
          timestamp: Date.now(),
        };
      }
    }

    return {
      valid: false,
      reason: "USDC transfer does not match expected parameters",
    };
  } catch (error) {
    console.error("Payment verification error:", error);
    return {
      valid: false,
      reason: `Verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Estimate required gas for x402 escrow deposit
 */
export async function estimateEscrowDeposit(
  amount: number
): Promise<{ gasEstimate: bigint; gasCostUSD: number }> {
  console.log(`Estimating for amount: ${amount}`);
  const gasEstimate = BigInt(65_000); // Typical ERC20 approval + deposit
  const gasPrice = await client.getGasPrice();
  const gasCostWei = gasEstimate * gasPrice;
  const gasCostETH = Number(gasCostWei) / 1e18;
  // Rough ETH price estimate
  const gasCostUSD = gasCostETH * 3500;

  return { gasEstimate, gasCostUSD };
}
