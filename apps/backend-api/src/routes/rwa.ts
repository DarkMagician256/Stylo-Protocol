// ============================================================================
// Routes: RWA / CETES Portal
// ============================================================================

import { Router } from "express";

export const rwaRouter = Router();

const MOCK_RWA_ASSETS = [
  {
    id: "cetes-28d-2026-q2",
    assetType: "cetes_28",
    isin: "MX0MGO0000H0",
    cusip: "000000028",
    maturityDate: Date.now() + 28 * 86400000,
    couponRate: 11.25,
    faceValue: 10,
    issuer: "Banco de México",
    tokenAddress: "0x5e6f7890abcdef1234567890abcdef1234567890",
    sourceChainId: 30110,
    destChainId: 30101,
    iso20022Compliant: true,
    kycRequired: true,
    accreditedOnly: false,
    totalTokenized: 5_000_000,
    available: 2_500_000,
  },
  {
    id: "cetes-91d-2026-q2",
    assetType: "cetes_91",
    isin: "MX0MGO0000I8",
    cusip: "000000091",
    maturityDate: Date.now() + 91 * 86400000,
    couponRate: 11.50,
    faceValue: 10,
    issuer: "Banco de México",
    tokenAddress: "0x6f7890abcdef1234567890abcdef123456789012",
    sourceChainId: 30110,
    destChainId: 30101,
    iso20022Compliant: true,
    kycRequired: true,
    accreditedOnly: false,
    totalTokenized: 12_000_000,
    available: 8_000_000,
  },
  {
    id: "cetes-182d-2026-q2",
    assetType: "cetes_182",
    isin: "MX0MGO0000J6",
    cusip: "000000182",
    maturityDate: Date.now() + 182 * 86400000,
    couponRate: 11.75,
    faceValue: 10,
    issuer: "Banco de México",
    tokenAddress: "0x7890abcdef1234567890abcdef12345678901234",
    sourceChainId: 30110,
    destChainId: 30101,
    iso20022Compliant: true,
    kycRequired: true,
    accreditedOnly: true,
    totalTokenized: 25_000_000,
    available: 15_000_000,
  },
  {
    id: "cetes-364d-2026-q2",
    assetType: "cetes_364",
    isin: "MX0MGO0000K4",
    cusip: "000000364",
    maturityDate: Date.now() + 364 * 86400000,
    couponRate: 12.00,
    faceValue: 10,
    issuer: "Banco de México",
    tokenAddress: "0x890abcdef1234567890abcdef1234567890123456",
    sourceChainId: 30110,
    destChainId: 30101,
    iso20022Compliant: true,
    kycRequired: true,
    accreditedOnly: true,
    totalTokenized: 50_000_000,
    available: 30_000_000,
  },
];

rwaRouter.get("/assets", (_req, res) => {
  res.json({
    success: true,
    data: {
      assets: MOCK_RWA_ASSETS,
      totalTokenized: MOCK_RWA_ASSETS.reduce((sum, a) => sum + a.totalTokenized, 0),
      legalDisclaimer: "These tokenized securities are offered in compliance with Mexican securities law. KYC/AML verification required. Not available in restricted jurisdictions.",
    },
    timestamp: Date.now(),
  });
});

rwaRouter.get("/assets/:id", (req, res) => {
  const asset = MOCK_RWA_ASSETS.find((a) => a.id === req.params.id);
  if (!asset) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "RWA asset not found" } });
    return;
  }
  res.json({ success: true, data: asset, timestamp: Date.now() });
});

rwaRouter.post("/tokenize", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "pending_kyc",
      message: "Tokenization request received. KYC verification required before processing.",
      requestId: `tok-${Date.now()}`,
      requiredDocuments: ["Government ID", "Proof of Address", "Accredited Investor Certification"],
    },
    timestamp: Date.now(),
  });
});
