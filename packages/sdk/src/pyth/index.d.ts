import { PYTH_FEED_IDS, type PythPriceFeed, type OracleAnomaly } from "../types/index.js";
/**
 * Fetch latest price updates from Pyth Hermes API
 */
export declare function fetchPythPrices(feedIds: string[]): Promise<PythPriceFeed[]>;
/**
 * Get VAA (Verified Action Approval) bytes for on-chain Pyth updates
 */
export declare function fetchPythVAA(feedIds: string[]): Promise<string[]>;
/**
 * Detect oracle price anomalies for dead-man switch
 */
export declare function detectAnomaly(currentPrice: PythPriceFeed, referencePrice: number, maxDeviationPercent: number): OracleAnomaly | null;
/**
 * Monitor multiple feeds for de-peg / anomaly events
 */
export declare function monitorPriceFeeds(feedIds: string[], referencePrices: Map<string, number>, maxDeviation: number): Promise<OracleAnomaly[]>;
export { PYTH_FEED_IDS };
//# sourceMappingURL=index.d.ts.map