"use client";

import { motion } from "framer-motion";
import { Shield, Zap, TrendingUp, Lock, Globe, ArrowUpRight } from "lucide-react";

const vaults = [
  {
    id: "usdy-gmx",
    name: "Ondo USDY / GMX Booster",
    asset: "USDY",
    provider: "Ondo Finance",
    tvl: "$24.5M",
    apy: "12.82%",
    breakdown: "4.5% Treasury + 8.32% GMX fees",
    privacy: "FHE_ENCRYPTED",
    status: "racing"
  },
  {
    id: "tbill-pendle",
    name: "OpenEden TBILL Maximizer",
    asset: "TBILL",
    provider: "OpenEden",
    tvl: "$12.8M",
    apy: "14.20%",
    breakdown: "5.1% Treasury + 9.1% Pendle",
    privacy: "MEV_SHIELDED",
    status: "analyzing"
  },
  {
    id: "multi-agent-alpha",
    name: "Neural Alpha Swarm",
    asset: "USDY/TBILL",
    provider: "Recursive Stylus",
    tvl: "$8.05M",
    apy: "18.92%",
    breakdown: "AI-Managed Arbitrage",
    privacy: "FHE_ENCRYPTED",
    status: "synthesizing"
  }
];

export function Vaults() {
  return (
    <div className="page-wrapper" style={{ color: "#fff" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 className="page-title" style={{ color: "#CCFF00" }}>INSTITUTIONAL_VAULTS</h1>
        <p className="page-subtitle">Native Arbitrum Stylus orchestration for yelding US Treasuries.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        {vaults.map((vault) => (
          <motion.div
            key={vault.id}
            whileHover={{ y: -5 }}
            className="glass-card"
            style={{ 
              padding: "2rem",
              border: "1px solid rgba(204, 255, 0, 0.1)",
              background: "rgba(10, 10, 10, 0.8)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, padding: "0.5rem 1rem", background: "rgba(204, 255, 0, 0.1)", color: "#CCFF00", fontSize: "0.6rem", fontWeight: "800", letterSpacing: "0.1em" }}>
              {vault.privacy}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div className="vault-tag" style={{ background: "rgba(204, 255, 0, 0.05)", border: "1px solid rgba(204, 255, 0, 0.1)", color: "rgba(204, 255, 0, 0.8)" }}>{vault.provider}</div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>{vault.name}</h2>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                <span>Asset: {vault.asset}</span>
                <span>TVL: {vault.tvl}</span>
              </div>
            </div>

            <div style={{ background: "rgba(204, 255, 0, 0.03)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(204, 255, 0, 0.05)", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(204, 255, 0, 0.6)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Projected Swarm APY</div>
              <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "#CCFF00", letterSpacing: "-0.04em" }}>{vault.apy}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>{vault.breakdown}</div>
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button className="btn-primary" style={{ flex: 2 }}>DEPOSIT_LIQUIDITY</button>
              <button className="btn-glass" style={{ flex: 1, padding: "0.5rem" }}><ArrowUpRight width={18} height={18} /></button>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
              <Activity width={12} height={12} style={{ color: vault.status === 'racing' ? '#CCFF00' : '#22d3ee' }} />
              Agent Swarm: {vault.status.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Activity({ width, height, style }: { width: number; height: number; style?: any }) {
  return <TrendingUp width={width} height={height} style={style} />;
}
