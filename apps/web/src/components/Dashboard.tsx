"use client";

import { motion } from "framer-motion";
import { Activity, Globe, Zap, Shield, Cpu, ArrowUpRight, BarChart3, Wallet } from "lucide-react";

export function Dashboard() {
  return (
    <div className="page-wrapper" style={{ color: "#fff" }}>
      {/* Neural Dashboard Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1 className="page-title" style={{ color: "#CCFF00", fontSize: "clamp(2rem, 5vw, 2.5rem)", wordBreak: "break-word" }}>SWARM_TELEMETRY</h1>
        <p className="page-subtitle" style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)" }}>Real-time synchronization with 32 autonomous agents across Arbitrum.</p>
      </div>

      {/* Hero Stats Grid */}
      <div className="dashboard-stats-grid">
        <DashboardCard
          title="Total TVL Managed"
          value="$45,352,801"
          sub="32% Ondo / 28% OpenEden / 40% GMX"
          icon={<Globe color="#CCFF00" />}
        />
        <DashboardCard
          title="Aggregated Swarm APY"
          value="18.92%"
          sub="+1.2% in last 24h"
          icon={<Zap color="#CCFF00" />}
        />
        <DashboardCard
          title="x402 Flow Rate"
          value="4.2 signals/s"
          sub="Institutional Micropayments"
          icon={<Cpu color="#CCFF00" />}
        />
        <DashboardCard
          title="Security Threshold"
          value="FHENIX_FHE"
          sub="MEV-Shield: Active"
          icon={<Shield color="#CCFF00" />}
        />
      </div>

      <div className="dashboard-main-grid">
        {/* Agent Activity Feed */}
        <div className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(204, 255, 0, 0.1)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Activity color="#CCFF00" size={20} />
            LIVE_AGENT_FEED
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
             {[
               { agent: "AGENT_01", action: "Rebalancing USDY pool", result: "0.05% profit", time: "2s ago" },
               { agent: "SWARM_LEAD", action: "Executing Pendle strategy", result: "Locked 4.2% yield", time: "15s ago" },
               { agent: "AGENT_09", action: "FHE intent published", result: "Shielded from MEV", time: "1m ago" },
               { agent: "PYTH_RELAY", action: "Oracle update received", result: "Deviation synced", time: "3m ago" },
             ].map((log, i) => (
               <div key={i} className="dashboard-feed-item">
                  <div className="dashboard-feed-item-left">
                    <span style={{ color: "#CCFF00", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{log.agent}</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{log.action}</span>
                  </div>
                  <div className="dashboard-feed-item-right" style={{ textAlign: "right" }}>
                    <div style={{ color: "#CCFF00", fontSize: "0.75rem", fontWeight: "700" }}>{log.result}</div>
                    <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>{log.time}</div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Swarm Health */}
        <div className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(204, 255, 0, 0.1)" }}>
           <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <BarChart3 color="#CCFF00" size={20} />
            SWARM_DISTRIBUTION
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <ProgressBar label="Ondo USDY (Treasury)" percent={45} />
            <ProgressBar label="OpenEden TBILL" percent={28} />
            <ProgressBar label="GMX v2 (Liquidity)" percent={27} />
          </div>
          <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(204, 255, 0, 0.05)", borderRadius: "8px", border: "1px solid rgba(204, 255, 0, 0.1)" }}>
             <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", display: "flex", alignItems: "center", gap: "0.25rem" }}>
               Institutional configuration detected. Safe multi-sig signatures required for strategy alteration.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, sub, icon }: { title: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", wordBreak: "break-word" }}>{title}</span>
        {icon}
      </div>
      <div style={{ fontSize: "clamp(1.4rem, 3vw, 1.75rem)", fontWeight: "900", color: "#fff", wordBreak: "break-word" }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.25rem", wordBreak: "break-word" }}>{sub}</div>
    </div>
  );
}

function ProgressBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{label}</span>
          <span style={{ fontSize: "0.8rem", color: "#CCFF00" }}>{percent}%</span>
       </div>
       <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1 }}
            style={{ height: "100%", background: "#CCFF00", boxShadow: "0 0 10px rgba(204, 255, 0, 0.5)" }} 
          />
       </div>
    </div>
  );
}
