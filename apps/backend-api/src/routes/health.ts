// ============================================================================
// Routes: Health Check
// ============================================================================

import { Router } from "express";
import { getDeadManSwitchState } from "../services/dead-man-switch.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const deadManSwitch = getDeadManSwitchState();

  res.json({
    success: true,
    data: {
      service: "Stylo Protocol API",
      version: "1.0.0",
      status: "operational",
      timestamp: Date.now(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      components: {
        api: "healthy",
        deadManSwitch: deadManSwitch.active ? "active" : "inactive",
        lastOracleCheck: deadManSwitch.lastCheck,
        activeAnomalies: deadManSwitch.anomalies.length,
      },
    },
  });
});

healthRouter.get("/deep", async (_req, res) => {
  const checks: Record<string, string> = {};

  // Check Supabase
  try {
    const { getSupabase } = await import("../services/supabase.js");
    getSupabase();
    checks.supabase = "connected";
  } catch {
    checks.supabase = "disconnected";
  }

  // Check Arbitrum RPC
  try {
    const response = await fetch(process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
    });
    checks.arbitrumRpc = response.ok ? "connected" : "error";
  } catch {
    checks.arbitrumRpc = "unreachable";
  }

  const allHealthy = Object.values(checks).every((v) => v === "connected" || v === "healthy");

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    data: {
      status: allHealthy ? "healthy" : "degraded",
      checks,
      timestamp: Date.now(),
    },
  });
});
