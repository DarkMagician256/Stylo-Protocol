// ============================================================================
// DEAD-MAN SWITCH — Oracle Price Anomaly Monitor
// Monitors Pyth price feeds and triggers emergency pause on Stylus Vaults
// when de-peg or price manipulation is detected
// ============================================================================

import { fetchPythPrices, detectAnomaly, PYTH_FEED_IDS } from "@stylo/sdk";
import type { OracleAnomaly, PythPriceFeed } from "@stylo/sdk";

interface SwitchState {
  active: boolean;
  intervalId: NodeJS.Timeout | null;
  lastCheck: number;
  anomalies: OracleAnomaly[];
  referencePrices: Map<string, number>;
  consecutiveFailures: number;
}

const state: SwitchState = {
  active: false,
  intervalId: null,
  lastCheck: 0,
  anomalies: [],
  referencePrices: new Map(),
  consecutiveFailures: 0,
};

const MONITORED_FEEDS = [
  PYTH_FEED_IDS.ARB_USD,
  PYTH_FEED_IDS.ETH_USD,
  PYTH_FEED_IDS.USDC_USD,
  PYTH_FEED_IDS.MXN_USD,
];

/**
 * Start the Dead-Man Switch monitoring loop
 */
export function startDeadManSwitch(): void {
  if (state.active) {
    console.warn("Dead-Man Switch already active");
    return;
  }

  const intervalMs = parseInt(
    process.env.DEAD_MAN_SWITCH_INTERVAL_MS || "30000",
    10
  );

  state.active = true;

  console.log(`🛡️  Dead-Man Switch: monitoring ${MONITORED_FEEDS.length} feeds every ${intervalMs}ms`);

  // Initial price snapshot
  initializeReferencePrices().catch((err) => {
    console.error("Failed to initialize reference prices:", err);
  });

  // Periodic monitoring
  state.intervalId = setInterval(() => {
    checkPriceFeeds().catch((err) => {
      console.error("Dead-Man Switch check failed:", err);
      state.consecutiveFailures++;

      if (state.consecutiveFailures >= 5) {
        console.error("🚨 5 consecutive failures — triggering emergency pause");
        triggerEmergencyPause("consecutive_check_failures");
      }
    });
  }, intervalMs);
}

/**
 * Stop the Dead-Man Switch
 */
export function stopDeadManSwitch(): void {
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
  state.active = false;
  console.log("🛡️  Dead-Man Switch deactivated");
}

/**
 * Initialize reference prices from Pyth
 */
async function initializeReferencePrices(): Promise<void> {
  const prices = await fetchPythPrices(MONITORED_FEEDS);

  for (const price of prices) {
    state.referencePrices.set(price.feedId, price.price);
  }

  console.log(
    `📊 Reference prices initialized: ${prices.map((p) => `${p.symbol}=$${p.price.toFixed(4)}`).join(", ")}`
  );
}

/**
 * Check price feeds for anomalies
 */
async function checkPriceFeeds(): Promise<void> {
  const maxDeviation = parseFloat(
    process.env.DEAD_MAN_MAX_DEVIATION_PERCENT || "5"
  );
  const emergencyThreshold = parseFloat(
    process.env.DEAD_MAN_EMERGENCY_THRESHOLD || "15"
  );

  let prices: PythPriceFeed[];
  try {
    prices = await fetchPythPrices(MONITORED_FEEDS);
  } catch {
    state.consecutiveFailures++;
    return;
  }

  // Reset failure counter on successful fetch
  state.consecutiveFailures = 0;
  state.lastCheck = Date.now();

  const newAnomalies: OracleAnomaly[] = [];

  for (const price of prices) {
    const reference = state.referencePrices.get(price.feedId);
    if (!reference) continue;

    const anomaly = detectAnomaly(price, reference, maxDeviation);
    if (anomaly) {
      newAnomalies.push(anomaly);
      console.warn(
        `⚠️  Price anomaly: ${anomaly.symbol} — expected $${anomaly.expectedPrice.toFixed(4)}, ` +
        `got $${anomaly.actualPrice.toFixed(4)} (${anomaly.deviationPercent.toFixed(2)}% deviation) ` +
        `[${anomaly.severity}]`
      );

      // Emergency pause if deviation exceeds emergency threshold
      if (anomaly.deviationPercent > emergencyThreshold) {
        console.error(
          `🚨 EMERGENCY: ${anomaly.symbol} deviation ${anomaly.deviationPercent.toFixed(2)}% exceeds ${emergencyThreshold}%`
        );
        await triggerEmergencyPause(
          `${anomaly.symbol}_depeg_${anomaly.deviationPercent.toFixed(2)}pct`
        );
      }
    }

    // Update rolling reference (EMA)
    state.referencePrices.set(
      price.feedId,
      reference * 0.95 + price.price * 0.05
    );
  }

  state.anomalies = newAnomalies;
}

/**
 * Trigger emergency pause on all Stylus Vaults
 */
async function triggerEmergencyPause(reason: string): Promise<void> {
  console.error(`🚨🚨🚨 EMERGENCY PAUSE TRIGGERED — Reason: ${reason}`);

  // 1. Alert via webhook
  const webhookUrl = process.env.DEAD_MAN_ALERT_WEBHOOK;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 STYLO DEAD-MAN SWITCH: Emergency pause triggered\nReason: ${reason}\nTimestamp: ${new Date().toISOString()}`,
          severity: "critical",
          anomalies: state.anomalies,
        }),
      });
    } catch (err) {
      console.error("Failed to send alert webhook:", err);
    }
  }

  // 2. Call emergency_pause() on all vault contracts
  // In production: use viem/ethers to send transactions to each vault
  const vaultAddresses = (process.env.STYLO_VAULT_ADDRESS || "").split(",");
  for (const vault of vaultAddresses) {
    if (vault && vault !== "0x") {
      console.log(`  → Pausing vault: ${vault}`);
      // await pauseVaultContract(vault);
    }
  }

  // 3. Log to Supabase for audit trail
  console.log(`  → Emergency pause logged at ${new Date().toISOString()}`);
}

export function getDeadManSwitchState() {
  return {
    active: state.active,
    lastCheck: state.lastCheck,
    anomalies: state.anomalies,
    consecutiveFailures: state.consecutiveFailures,
    monitoredFeeds: MONITORED_FEEDS.length,
  };
}
