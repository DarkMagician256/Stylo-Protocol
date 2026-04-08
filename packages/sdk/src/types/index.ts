// ============================================================================
// STYLO PROTOCOL — Shared Type Definitions
// Institutional-grade types for the Agentic Execution Layer
// ============================================================================

import { z } from "zod";

// ---------------------------------------------------------------------------
// Agent Types
// ---------------------------------------------------------------------------

export enum AgentStatus {
  Idle = "idle",
  Analyzing = "analyzing",
  Racing = "racing",
  Synthesizing = "synthesizing",
  Executing = "executing",
  Paused = "paused",
  Error = "error",
}

export enum AgentSpecialization {
  YieldOptimizer = "yield_optimizer",
  ArbitrageHunter = "arbitrage_hunter",
  RWAAnalyst = "rwa_analyst",
  RiskManager = "risk_manager",
  LiquidityProvider = "liquidity_provider",
  CrossChainBridge = "cross_chain_bridge",
  MEVProtector = "mev_protector",
  SentimentAnalyzer = "sentiment_analyzer",
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

// ---------------------------------------------------------------------------
// Vault Types (ERC-4626 Stylus)
// ---------------------------------------------------------------------------

export enum VaultStrategy {
  GMX_V2 = "gmx_v2",
  Pendle_Boros = "pendle_boros",
  CETES_Yield = "cetes_yield",
  Multi_Protocol = "multi_protocol",
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
  maxLoss: number; // basis points
}

// ---------------------------------------------------------------------------
// RWA / CETES Types (LayerZero OFT)
// ---------------------------------------------------------------------------

export enum RWAAssetType {
  CETES_28 = "cetes_28",
  CETES_91 = "cetes_91",
  CETES_182 = "cetes_182",
  CETES_364 = "cetes_364",
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

// ---------------------------------------------------------------------------
// x402 Payment Protocol Types
// ---------------------------------------------------------------------------

export interface X402Receipt {
  id: string;
  paymentHash: string;
  payer: string;
  payee: string;
  amount: number; // USDC in human-readable
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

// ---------------------------------------------------------------------------
// MCP (Model Context Protocol) Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Pyth Oracle Types
// ---------------------------------------------------------------------------

export interface PythPriceFeed {
  feedId: string;
  symbol: string;
  price: number;
  confidence: number;
  publishTime: number;
  emaPrice: number;
  emaConfidence: number;
}

export const PYTH_FEED_IDS = {
  ARB_USD: "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
  ETH_USD: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  USDC_USD: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  MXN_USD: "0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66d16d03571de81b71baf",
} as const;

// ---------------------------------------------------------------------------
// Dead-Man Switch Types
// ---------------------------------------------------------------------------

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
  maxPriceDeviation: number; // percentage
  checkIntervalMs: number;
  emergencyPauseThreshold: number; // percentage
  alertWebhookUrl: string;
  vaultAddresses: string[];
}

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

// ---------------------------------------------------------------------------
// API Response Wrappers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Supabase Database Types
// ---------------------------------------------------------------------------

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
        Row: VaultPosition & { userId: string };
        Insert: Omit<VaultPosition & { userId: string }, "vaultAddress">;
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
