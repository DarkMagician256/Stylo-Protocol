import { z } from "zod";
export declare enum AgentStatus {
    Idle = "idle",
    Analyzing = "analyzing",
    Racing = "racing",
    Synthesizing = "synthesizing",
    Executing = "executing",
    Paused = "paused",
    Error = "error"
}
export declare enum AgentSpecialization {
    YieldOptimizer = "yield_optimizer",
    ArbitrageHunter = "arbitrage_hunter",
    RWAAnalyst = "rwa_analyst",
    RiskManager = "risk_manager",
    LiquidityProvider = "liquidity_provider",
    CrossChainBridge = "cross_chain_bridge",
    MEVProtector = "mev_protector",
    SentimentAnalyzer = "sentiment_analyzer"
}
export interface AgentTelemetry {
    id: string;
    name: string;
    status: AgentStatus;
    specialization: AgentSpecialization;
    sharpeRatio: number;
    totalPnL: number;
    totalVolume: number;
    eloRating: number;
    lastAction: string;
    lastActionTimestamp: number;
    x402Earnings: number;
    successRate: number;
    activeVaults: string[];
    metadata: Record<string, unknown>;
}
export interface SwarmMetrics {
    totalAgents: number;
    activeAgents: number;
    swarmPnL: number;
    totalVolume: number;
    activeX402Settlements: number;
    averageSharpe: number;
    topAgent: AgentTelemetry | null;
    lastUpdated: number;
}
export declare enum VaultStrategy {
    GMX_V2 = "gmx_v2",
    Pendle_Boros = "pendle_boros",
    CETES_Yield = "cetes_yield",
    Multi_Protocol = "multi_protocol"
}
export interface VaultPosition {
    vaultAddress: string;
    vaultName: string;
    strategy: VaultStrategy;
    totalAssets: bigint;
    totalShares: bigint;
    userShares: bigint;
    userAssets: bigint;
    apy: VaultAPY;
    tvl: number;
    depositCap: bigint;
    isPaused: boolean;
    lastHarvest: number;
}
export interface VaultAPY {
    base: number;
    gmxFees: number;
    pendleYield: number;
    rwaBase: number;
    total: number;
    sevenDayAvg: number;
    thirtyDayAvg: number;
}
export interface VaultDepositParams {
    vaultAddress: string;
    assets: bigint;
    receiver: string;
    minShares: bigint;
}
export interface VaultWithdrawParams {
    vaultAddress: string;
    shares: bigint;
    receiver: string;
    owner: string;
    maxLoss: number;
}
export declare enum RWAAssetType {
    CETES_28 = "cetes_28",
    CETES_91 = "cetes_91",
    CETES_182 = "cetes_182",
    CETES_364 = "cetes_364"
}
export interface RWAMetadata {
    id: string;
    assetType: RWAAssetType;
    isin: string;
    cusip: string;
    maturityDate: number;
    couponRate: number;
    faceValue: number;
    issuer: string;
    tokenAddress: string;
    sourceChainId: number;
    destChainId: number;
    iso20022Compliant: boolean;
    legalDisclaimer: string;
    kycRequired: boolean;
    accreditedOnly: boolean;
}
export interface OFTBridgeParams {
    tokenAddress: string;
    amount: bigint;
    srcChainId: number;
    dstChainId: number;
    receiver: string;
    minAmountOut: bigint;
    adapterParams: string;
}
export interface X402Receipt {
    id: string;
    paymentHash: string;
    payer: string;
    payee: string;
    amount: number;
    amountRaw: bigint;
    timestamp: number;
    txHash: string;
    chainId: number;
    serviceEndpoint: string;
    agentId: string;
    status: "pending" | "confirmed" | "failed" | "refunded";
    metadata: Record<string, unknown>;
}
export interface X402PriceConfig {
    endpoint: string;
    priceUSDC: number;
    minBalance: number;
    maxCallsPerMinute: number;
}
export interface MCPToolDefinition {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    outputSchema: Record<string, unknown>;
    x402Price: number;
    rateLimit: number;
}
export interface MCPToolCall {
    id: string;
    toolName: string;
    arguments: Record<string, unknown>;
    callerAgent: string;
    x402Receipt?: X402Receipt;
    timestamp: number;
}
export interface MCPToolResult {
    callId: string;
    toolName: string;
    result: unknown;
    executionTimeMs: number;
    cost: number;
    timestamp: number;
}
export interface PythPriceFeed {
    feedId: string;
    symbol: string;
    price: number;
    confidence: number;
    publishTime: number;
    emaPrice: number;
    emaConfidence: number;
}
export declare const PYTH_FEED_IDS: {
    readonly ARB_USD: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5";
    readonly ETH_USD: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
    readonly USDC_USD: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a";
    readonly MXN_USD: "0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66d16d03571de81b71baf";
};
export interface OracleAnomaly {
    feedId: string;
    symbol: string;
    expectedPrice: number;
    actualPrice: number;
    deviationPercent: number;
    detectedAt: number;
    severity: "warning" | "critical" | "emergency";
}
export interface DeadManSwitchConfig {
    maxPriceDeviation: number;
    checkIntervalMs: number;
    emergencyPauseThreshold: number;
    alertWebhookUrl: string;
    vaultAddresses: string[];
}
export declare const AgentTelemetrySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    status: z.ZodNativeEnum<typeof AgentStatus>;
    specialization: z.ZodNativeEnum<typeof AgentSpecialization>;
    sharpeRatio: z.ZodNumber;
    totalPnL: z.ZodNumber;
    totalVolume: z.ZodNumber;
    eloRating: z.ZodNumber;
    lastAction: z.ZodString;
    lastActionTimestamp: z.ZodNumber;
    x402Earnings: z.ZodNumber;
    successRate: z.ZodNumber;
    activeVaults: z.ZodArray<z.ZodString, "many">;
    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    status: AgentStatus;
    specialization: AgentSpecialization;
    sharpeRatio: number;
    totalPnL: number;
    totalVolume: number;
    eloRating: number;
    lastAction: string;
    lastActionTimestamp: number;
    x402Earnings: number;
    successRate: number;
    activeVaults: string[];
    metadata: Record<string, unknown>;
}, {
    id: string;
    name: string;
    status: AgentStatus;
    specialization: AgentSpecialization;
    sharpeRatio: number;
    totalPnL: number;
    totalVolume: number;
    eloRating: number;
    lastAction: string;
    lastActionTimestamp: number;
    x402Earnings: number;
    successRate: number;
    activeVaults: string[];
    metadata: Record<string, unknown>;
}>;
export declare const X402ReceiptSchema: z.ZodObject<{
    id: z.ZodString;
    paymentHash: z.ZodString;
    payer: z.ZodString;
    payee: z.ZodString;
    amount: z.ZodNumber;
    timestamp: z.ZodNumber;
    txHash: z.ZodString;
    chainId: z.ZodNumber;
    serviceEndpoint: z.ZodString;
    agentId: z.ZodString;
    status: z.ZodEnum<["pending", "confirmed", "failed", "refunded"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "confirmed" | "pending" | "failed" | "refunded";
    paymentHash: string;
    payer: string;
    payee: string;
    amount: number;
    timestamp: number;
    txHash: string;
    chainId: number;
    serviceEndpoint: string;
    agentId: string;
}, {
    id: string;
    status: "confirmed" | "pending" | "failed" | "refunded";
    paymentHash: string;
    payer: string;
    payee: string;
    amount: number;
    timestamp: number;
    txHash: string;
    chainId: number;
    serviceEndpoint: string;
    agentId: string;
}>;
export declare const VaultDepositSchema: z.ZodObject<{
    vaultAddress: z.ZodString;
    assets: z.ZodBigInt;
    receiver: z.ZodString;
    minShares: z.ZodBigInt;
}, "strip", z.ZodTypeAny, {
    vaultAddress: string;
    assets: bigint;
    receiver: string;
    minShares: bigint;
}, {
    vaultAddress: string;
    assets: bigint;
    receiver: string;
    minShares: bigint;
}>;
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: number;
    requestId: string;
}
export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
    timestamp: number;
    requestId: string;
}
export type ApiResult<T> = ApiResponse<T> | ApiError;
export interface Database {
    public: {
        Tables: {
            agent_telemetry: {
                Row: AgentTelemetry;
                Insert: Omit<AgentTelemetry, "id">;
                Update: Partial<AgentTelemetry>;
            };
            x402_receipts: {
                Row: X402Receipt;
                Insert: Omit<X402Receipt, "id">;
                Update: Partial<X402Receipt>;
            };
            user_vault_positions: {
                Row: VaultPosition & {
                    userId: string;
                };
                Insert: Omit<VaultPosition & {
                    userId: string;
                }, "vaultAddress">;
                Update: Partial<VaultPosition>;
            };
            rwa_metadata: {
                Row: RWAMetadata;
                Insert: Omit<RWAMetadata, "id">;
                Update: Partial<RWAMetadata>;
            };
        };
    };
}
//# sourceMappingURL=index.d.ts.map