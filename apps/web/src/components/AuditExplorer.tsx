"use client";

import { TerminalSquare, Shield, CheckCircle, AlertTriangle, Cpu, Command } from "lucide-react";
import { motion } from "framer-motion";

const logs = [
  {
    time: "10:24:05",
    id: "0x3f...8a",
    agent: "AGENT_07",
    action: "Moved 50k USDY to GMX Pool due to volatility spike detected in Pendle.",
    status: "success",
  },
  {
    time: "10:23:42",
    id: "0x9a...2b",
    agent: "SWARM_LEAD",
    action: "Rebalanced OpenEden TBILL allocation. Hedging 15% via Stylus flash-loan proxy.",
    status: "success",
  },
  {
    time: "10:21:11",
    id: "SYSTEM",
    agent: "PYTH_ORACLE",
    action: "USDY/USD price feed update received. Deviation 0.02% from GMX internal skew.",
    status: "warning",
  },
  {
    time: "10:15:30",
    id: "0xcc...aa",
    agent: "X402_MIDDLEWARE",
    action: "Micropayment signal purchased: $0.01 USDC settled for 'Delta-Neutral' intent.",
    status: "success",
  },
  {
    time: "10:10:05",
    id: "0x11...44",
    agent: "FHENIX_PRIVACY",
    action: "Encrypted trade intent published to FHE chain. MEV-shield status: VALID.",
    status: "success",
  },
];

export function AuditExplorer() {
  return (
    <div className="page-wrapper animate-slide-in-right" style={{ color: "#fff" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#CCFF00" }}>
          <Command width={32} height={32} />
          BLACKBOX_AUDIT_ARCHIVE
        </h1>
        <p className="page-subtitle">Human-readable AI logs. IPFS-anchored agentic execution traces.</p>
      </header>

      <div 
        className="glass-card" 
        style={{ 
          background: "rgba(5, 5, 5, 0.9)", 
          border: "1px solid rgba(204, 255, 0, 0.15)",
          borderRadius: "12px",
          padding: "0",
          overflow: "hidden",
          fontFamily: "var(--font-mono)"
        }}
      >
        <div style={{ background: "rgba(204, 255, 0, 0.05)", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(204, 255, 0, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "#CCFF00" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#CCFF00", boxShadow: "0 0 10px #CCFF00" }} />
            SYSTEM_LIVE_LOGS
          </div>
          <Cpu width={16} height={16} color="rgba(204, 255, 0, 0.4)" />
        </div>

        <div style={{ padding: "1.5rem" }}>
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 150px 1fr 40px",
                gap: "1.5rem",
                padding: "1rem",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                alignItems: "center",
                fontSize: "0.85rem"
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.2)" }}>[{log.time}]</span>
              <span style={{ color: "#CCFF00", fontWeight: "700" }}>{log.agent}</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{log.action}</span>
              <div style={{ justifySelf: "end" }}>
                {log.status === "success" ? <CheckCircle size={16} color="#4ade80" /> : <AlertTriangle size={16} color="#fbbf24" />}
              </div>
            </motion.div>
          ))}
          
          <div style={{ padding: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
            WAITING_FOR_NEXT_BLOCK_SYNC...
          </div>
        </div>
      </div>
    </div>
  );
}
