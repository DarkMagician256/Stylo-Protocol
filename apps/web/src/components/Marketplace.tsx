"use client";

import { useState } from "react";
import { Terminal, Server, Star, Activity, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const agents = [
  {
    name: "DeltaNeutral_V4",
    elo: 1842,
    strategy: "GMX/USDY Hedging",
    perf: "+14.2%",
    cost: "$0.01 USDC",
    status: "active"
  },
  {
    name: "GammaScanner_X",
    elo: 1792,
    strategy: "OpenEden Arbitrage",
    perf: "+9.8%",
    cost: "$0.01 USDC",
    status: "active"
  },
  {
    name: "YieldGhost",
    elo: 1620,
    strategy: "Pendle Yield Strip",
    perf: "+11.5%",
    cost: "$0.01 USDC",
    status: "maintenance"
  }
];

export function Marketplace() {
  return (
    <div className="page-wrapper animate-fade-in-up" style={{ color: "#fff" }}>
      <header style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 className="page-title" style={{ fontSize: "clamp(2rem, 6vw, 3rem)", color: "#CCFF00", textShadow: "0 0 30px rgba(204, 255, 0, 0.2)", wordBreak: "break-word" }}>AGENT_MARKETPLACE</h1>
        <p className="page-subtitle" style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)" }}>Monetize AI signals or delegate capital via x402 Micropayments.</p>
      </header>

      <div className="marketplace-grid">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ 
              padding: "2rem",
              background: "rgba(10, 10, 10, 0.9)",
              border: "1px solid rgba(204, 255, 0, 0.1)",
              position: "relative"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#CCFF00", fontSize: "0.8rem", fontWeight: "800" }}>
                <Star size={14} fill="#CCFF00" />
                ELO_RANK: {agent.elo}
              </div>
              <div style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "4px", background: agent.status === 'active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)', color: agent.status === 'active' ? '#4ade80' : '#fbbf24' }}>
                {agent.status.toUpperCase()}
              </div>
            </div>

            <h3 style={{ fontSize: "clamp(1.1rem, 4vw, 1.25rem)", fontWeight: "900", marginBottom: "0.5rem", wordBreak: "break-word" }}>{agent.name}</h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", marginBottom: "1.5rem", wordBreak: "break-word" }}>{agent.strategy}</p>

            <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>7D Performance</div>
                <div style={{ fontSize: "clamp(1rem, 3vw, 1.1rem)", color: "#CCFF00", fontWeight: "800", wordBreak: "break-word" }}>{agent.perf}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Signal Cost</div>
                <div style={{ fontSize: "clamp(1rem, 3vw, 1.1rem)", color: "#fff", fontWeight: "800", wordBreak: "break-word" }}>{agent.cost}</div>
              </div>
            </div>

            <div className="marketplace-cta">
              <button className="btn-primary" style={{ flex: 1, fontSize: "0.8rem", justifyContent: "center" }}>DELEGATE</button>
              <button className="btn-glass" style={{ flex: 1, fontSize: "0.8rem", justifyContent: "center" }}>BUY SIGNAL</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
