// ============================================================================
// STYLO PROTOCOL — Shared Type Definitions
// Institutional-grade types for the Agentic Execution Layer
// ============================================================================
import { z } from "zod";
// ---------------------------------------------------------------------------
// Agent Types
// ---------------------------------------------------------------------------
export var AgentStatus;
(function (AgentStatus) {
    AgentStatus["Idle"] = "idle";
    AgentStatus["Analyzing"] = "analyzing";
    AgentStatus["Racing"] = "racing";
    AgentStatus["Synthesizing"] = "synthesizing";
    AgentStatus["Executing"] = "executing";
    AgentStatus["Paused"] = "paused";
    AgentStatus["Error"] = "error";
})(AgentStatus || (AgentStatus = {}));
export var AgentSpecialization;
(function (AgentSpecialization) {
    AgentSpecialization["YieldOptimizer"] = "yield_optimizer";
    AgentSpecialization["ArbitrageHunter"] = "arbitrage_hunter";
    AgentSpecialization["RWAAnalyst"] = "rwa_analyst";
    AgentSpecialization["RiskManager"] = "risk_manager";
    AgentSpecialization["LiquidityProvider"] = "liquidity_provider";
    AgentSpecialization["CrossChainBridge"] = "cross_chain_bridge";
    AgentSpecialization["MEVProtector"] = "mev_protector";
    AgentSpecialization["SentimentAnalyzer"] = "sentiment_analyzer";
})(AgentSpecialization || (AgentSpecialization = {}));
// ---------------------------------------------------------------------------
// Vault Types (ERC-4626 Stylus)
// ---------------------------------------------------------------------------
export var VaultStrategy;
(function (VaultStrategy) {
    VaultStrategy["GMX_V2"] = "gmx_v2";
    VaultStrategy["Pendle_Boros"] = "pendle_boros";
    VaultStrategy["CETES_Yield"] = "cetes_yield";
    VaultStrategy["Multi_Protocol"] = "multi_protocol";
})(VaultStrategy || (VaultStrategy = {}));
// ---------------------------------------------------------------------------
// RWA / CETES Types (LayerZero OFT)
// ---------------------------------------------------------------------------
export var RWAAssetType;
(function (RWAAssetType) {
    RWAAssetType["CETES_28"] = "cetes_28";
    RWAAssetType["CETES_91"] = "cetes_91";
    RWAAssetType["CETES_182"] = "cetes_182";
    RWAAssetType["CETES_364"] = "cetes_364";
})(RWAAssetType || (RWAAssetType = {}));
export const PYTH_FEED_IDS = {
    ARB_USD: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
    ETH_USD: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    USDC_USD: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
    MXN_USD: "0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66d16d03571de81b71baf",
};
// ---------------------------------------------------------------------------
// Zod Validation Schemas
// ---------------------------------------------------------------------------
export const AgentTelemetrySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(64),
    status: z.nativeEnum(AgentStatus),
    specialization: z.nativeEnum(AgentSpecialization),
    sharpeRatio: z.number(),
    totalPnL: z.number(),
    totalVolume: z.number().nonnegative(),
    eloRating: z.number().int().nonnegative(),
    lastAction: z.string(),
    lastActionTimestamp: z.number().int().positive(),
    x402Earnings: z.number().nonnegative(),
    successRate: z.number().min(0).max(100),
    activeVaults: z.array(z.string()),
    metadata: z.record(z.unknown()),
});
export const X402ReceiptSchema = z.object({
    id: z.string().uuid(),
    paymentHash: z.string(),
    payer: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    payee: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    amount: z.number().positive(),
    timestamp: z.number().int().positive(),
    txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
    chainId: z.number().int().positive(),
    serviceEndpoint: z.string().url(),
    agentId: z.string().uuid(),
    status: z.enum(["pending", "confirmed", "failed", "refunded"]),
});
export const VaultDepositSchema = z.object({
    vaultAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    assets: z.bigint().positive(),
    receiver: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    minShares: z.bigint().nonnegative(),
});
//# sourceMappingURL=index.js.map