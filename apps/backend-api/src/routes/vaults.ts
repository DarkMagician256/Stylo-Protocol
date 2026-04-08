// ============================================================================
// Routes: Vault Management (x402-protected)
// ============================================================================

import { Router } from "express";

export const vaultsRouter = Router();

const MOCK_VAULTS = [
  {
    address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    name: "GMX Delta-Neutral Vault",
    strategy: "gmx_v2",
    tvl: 8_450_000,
    apy: { base: 4.2, gmxFees: 8.3, pendleYield: 0, rwaBase: 0, total: 12.5, sevenDayAvg: 11.8, thirtyDayAvg: 12.1 },
    depositCap: 25_000_000,
    isPaused: false,
    allocation: { gmx: 100, pendle: 0, rwa: 0 },
  },
  {
    address: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    name: "Pendle Yield Maximizer",
    strategy: "pendle_boros",
    tvl: 5_200_000,
    apy: { base: 3.1, gmxFees: 0, pendleYield: 9.8, rwaBase: 0, total: 12.9, sevenDayAvg: 13.2, thirtyDayAvg: 12.5 },
    depositCap: 15_000_000,
    isPaused: false,
    allocation: { gmx: 0, pendle: 100, rwa: 0 },
  },
  {
    address: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    name: "CETES Institutional RWA",
    strategy: "cetes_yield",
    tvl: 12_800_000,
    apy: { base: 11.2, gmxFees: 0, pendleYield: 0, rwaBase: 11.2, total: 11.2, sevenDayAvg: 11.1, thirtyDayAvg: 11.3 },
    depositCap: 50_000_000,
    isPaused: false,
    allocation: { gmx: 0, pendle: 0, rwa: 100 },
  },
  {
    address: "0x4d5e6f7890abcdef1234567890abcdef12345678",
    name: "Multi-Protocol Alpha",
    strategy: "multi_protocol",
    tvl: 18_900_000,
    apy: { base: 3.5, gmxFees: 5.2, pendleYield: 3.8, rwaBase: 4.1, total: 16.6, sevenDayAvg: 15.9, thirtyDayAvg: 16.2 },
    depositCap: 100_000_000,
    isPaused: false,
    allocation: { gmx: 40, pendle: 35, rwa: 25 },
  },
];

vaultsRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      vaults: MOCK_VAULTS,
      totalTVL: MOCK_VAULTS.reduce((sum, v) => sum + v.tvl, 0),
      averageAPY: +(MOCK_VAULTS.reduce((sum, v) => sum + v.apy.total, 0) / MOCK_VAULTS.length).toFixed(2),
    },
    timestamp: Date.now(),
  });
});

vaultsRouter.get("/:address", (req, res) => {
  const vault = MOCK_VAULTS.find((v) => v.address === req.params.address);
  if (!vault) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Vault not found" } });
    return;
  }
  res.json({ success: true, data: vault, timestamp: Date.now() });
});
