// ============================================================================
// Routes: Agent Telemetry & Marketplace
// ============================================================================

import { Router } from "express";

export const agentsRouter = Router();

// Mock agent data for development
const MOCK_AGENTS = Array.from({ length: 30 }, (_, i) => ({
  id: `agent-${String(i + 1).padStart(3, "0")}`,
  name: [
    "AlphaHunter","YieldMaxi","RWA-Sentinel","CrossChainX","DeltaNeutral",
    "GammaScanner","PendleWhale","GMX-Sniper","SharpeEdge","MomentumBot",
    "VolSurfer","CETESArb","LiquidityPrime","BridgeGuard","OracleWatcher",
    "FeeHarvester","FlashLoanX","MEV-Shield","RiskAnalyzer","RebalanceBot",
    "YieldFarmer","ArbScanner","TrendFollower","MeanRevert","VaultKeeper",
    "DefiSage","TokenBridge","SwapOptimizer","GasTracker","ProfitSeeker",
  ][i],
  status: ["racing","analyzing","synthesizing","idle","executing"][Math.floor(Math.random() * 5)],
  specialization: ["yield_optimizer","arbitrage_hunter","rwa_analyst","risk_manager","liquidity_provider","cross_chain_bridge","mev_protector","sentiment_analyzer"][Math.floor(Math.random() * 8)],
  sharpeRatio: +(2.5 - i * 0.06 + Math.random() * 0.5).toFixed(2),
  totalPnL: Math.round(500000 - i * 12000 + Math.random() * 20000),
  totalVolume: Math.round(5000000 - i * 100000 + Math.random() * 200000),
  eloRating: Math.round(1900 - i * 20 + Math.random() * 30),
  x402Earnings: +(800 - i * 20 + Math.random() * 50).toFixed(2),
  successRate: +(85 - i * 1.2 + Math.random() * 5).toFixed(1),
  lastAction: "Rebalanced GMX/Pendle position",
  lastActionTimestamp: Date.now() - Math.floor(Math.random() * 3600000),
}));

agentsRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      agents: MOCK_AGENTS,
      swarmMetrics: {
        totalAgents: 30,
        activeAgents: MOCK_AGENTS.filter((a) => a.status !== "idle").length,
        swarmPnL: MOCK_AGENTS.reduce((sum, a) => sum + a.totalPnL, 0),
        totalVolume: MOCK_AGENTS.reduce((sum, a) => sum + a.totalVolume, 0),
        activeX402Settlements: Math.floor(Math.random() * 50) + 10,
        averageSharpe: +(MOCK_AGENTS.reduce((sum, a) => sum + a.sharpeRatio, 0) / MOCK_AGENTS.length).toFixed(2),
      },
    },
    timestamp: Date.now(),
  });
});

agentsRouter.get("/:id", (req, res) => {
  const agent = MOCK_AGENTS.find((a) => a.id === req.params.id);
  if (!agent) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Agent not found" } });
    return;
  }
  res.json({ success: true, data: agent, timestamp: Date.now() });
});

agentsRouter.get("/:id/telemetry", (req, res) => {
  const points = Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    pnl: Math.sin(i * 0.5) * 5000 + Math.random() * 2000,
    volume: Math.random() * 100000 + 50000,
    trades: Math.floor(Math.random() * 20) + 5,
  }));
  res.json({ success: true, data: { agentId: req.params.id, telemetry: points }, timestamp: Date.now() });
});
