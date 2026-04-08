// ============================================================================
// STYLO PROTOCOL — Pyth Network Integration
// Pull-based oracle for real-time CETES/USD and ARB/USD price verification
// ============================================================================

import { PYTH_FEED_IDS, type PythPriceFeed, type OracleAnomaly } from "../types/index.js";

const PYTH_HERMES_ENDPOINT = "https://hermes.pyth.network";

/**
 * Fetch latest price updates from Pyth Hermes API
 */
export async function fetchPythPrices(
  feedIds: string[]
): Promise<PythPriceFeed[]> {
  const params = feedIds.map((id) => `ids[]=${id}`).join("&");
  const url = `${PYTH_HERMES_ENDPOINT}/v2/updates/price/latest?${params}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pyth API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.parsed.map((item: any) => ({
    feedId: item.id,
    symbol: getFeedSymbol(item.id),
    price: Number(item.price.price) * Math.pow(10, item.price.expo),
    confidence: Number(item.price.conf) * Math.pow(10, item.price.expo),
    publishTime: item.price.publish_time,
    emaPrice: Number(item.ema_price.price) * Math.pow(10, item.ema_price.expo),
    emaConfidence: Number(item.ema_price.conf) * Math.pow(10, item.ema_price.expo),
  }));
}

/**
 * Get VAA (Verified Action Approval) bytes for on-chain Pyth updates
 */
export async function fetchPythVAA(feedIds: string[]): Promise<string[]> {
  const params = feedIds.map((id) => `ids[]=${id}`).join("&");
  const url = `${PYTH_HERMES_ENDPOINT}/v2/updates/price/latest?${params}&encoding=hex`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pyth VAA error: ${response.status}`);
  }

  const data = await response.json();
  return data.binary.data;
}

/**
 * Detect oracle price anomalies for dead-man switch
 */
export function detectAnomaly(
  currentPrice: PythPriceFeed,
  referencePrice: number,
  maxDeviationPercent: number
): OracleAnomaly | null {
  const deviation = Math.abs(
    ((currentPrice.price - referencePrice) / referencePrice) * 100
  );

  if (deviation > maxDeviationPercent) {
    let severity: OracleAnomaly["severity"] = "warning";
    if (deviation > maxDeviationPercent * 2) severity = "critical";
    if (deviation > maxDeviationPercent * 5) severity = "emergency";

    return {
      feedId: currentPrice.feedId,
      symbol: currentPrice.symbol,
      expectedPrice: referencePrice,
      actualPrice: currentPrice.price,
      deviationPercent: deviation,
      detectedAt: Date.now(),
      severity,
    };
  }

  return null;
}

/**
 * Monitor multiple feeds for de-peg / anomaly events
 */
export async function monitorPriceFeeds(
  feedIds: string[],
  referencePrices: Map<string, number>,
  maxDeviation: number
): Promise<OracleAnomaly[]> {
  const prices = await fetchPythPrices(feedIds);
  const anomalies: OracleAnomaly[] = [];

  for (const price of prices) {
    const ref = referencePrices.get(price.feedId);
    if (ref) {
      const anomaly = detectAnomaly(price, ref, maxDeviation);
      if (anomaly) anomalies.push(anomaly);
    }
  }

  return anomalies;
}

function getFeedSymbol(feedId: string): string {
  const entries = Object.entries(PYTH_FEED_IDS);
  const match = entries.find(([, id]) => id === feedId);
  return match ? match[0].replace("_", "/") : "UNKNOWN";
}

export { PYTH_FEED_IDS };
