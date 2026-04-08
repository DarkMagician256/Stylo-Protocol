"use client";

import { useState } from "react";
import { ShieldCheck, Globe, Activity, ExternalLink, Database, Search } from "lucide-react";
import { motion } from "framer-motion";

export function RWABridge() {
  const [activeTab, setActiveTab] = useState("Ondo");

  return (
    <div className="page-wrapper animate-fade-in-up" style={{ color: "#fff" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 className="page-title" style={{ color: "#CCFF00", fontSize: "2.5rem" }}>RWA_INTEL_LAYER</h1>
        <p className="page-subtitle">Real-time transparency and proof-of-reserves for Institutional US Treasuries.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* Transparency Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid rgba(204, 255, 0, 0.1)" }}>
             <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
               <ShieldCheck color="#CCFF00" size={18} />
               PROOF_OF_RESERVES
             </h3>
             <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <TransparencyMetric label="Total Treasury Value" value="$1.24B" source="US Custodian" />
                <TransparencyMetric label="Ondo USDY (Arbitrum)" value="$24.5M" source="Pyth Oracle" />
                <TransparencyMetric label="OpenEden TBILL (Arbitrum)" value="$12.8M" source="Pyth Oracle" />
             </div>
             <button className="btn-glass" style={{ width: "100%", marginTop: "1.5rem", fontSize: "0.75rem" }}>
               VERIFY_ON_CHAIN_DASHBOARD <ExternalLink size={12} />
             </button>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
             <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "1rem" }}>Pyth Oracle Feed</h3>
             <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(204, 255, 0, 0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                   <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>USDY / USD</span>
                   <span style={{ fontSize: "0.8rem", color: "#CCFF00", fontWeight: "800" }}>$1.0124</span>
                </div>
                <div style={{ height: "40px", width: "100%", display: "flex", alignItems: "flex-end", gap: "2px" }}>
                   {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.85, 1.0, 0.95, 0.9].map((h, i) => (
                     <div key={i} style={{ flex: 1, background: "#CCFF00", height: `${h * 100}%`, opacity: 0.3 + (i * 0.07) }} />
                   ))}
                </div>
             </div>
             <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "0.75rem" }}>
               *Pull-based oracle latency: 420ms. Optimized for Stylus execution.
             </p>
          </div>
        </div>

        {/* Real-time Intel Feed */}
        <div className="glass-card" style={{ padding: "2rem", border: "1px solid rgba(204, 255, 0, 0.15)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                 <button onClick={() => setActiveTab("Ondo")} style={{ background: "transparent", border: "none", color: activeTab === "Ondo" ? "#CCFF00" : "rgba(255,255,255,0.4)", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer", borderBottom: activeTab === "Ondo" ? "2px solid #CCFF00" : "none", paddingBottom: "0.25rem" }}>ONDO_FINANCE</button>
                 <button onClick={() => setActiveTab("OpenEden")} style={{ background: "transparent", border: "none", color: activeTab === "OpenEden" ? "#CCFF00" : "rgba(255,255,255,0.4)", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer", borderBottom: activeTab === "OpenEden" ? "2px solid #CCFF00" : "none", paddingBottom: "0.25rem" }}>OPENEDEN</button>
              </div>
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={12} color="#CCFF00" />
                API_V2026_CONNECTED
              </div>
           </div>

           <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {activeTab === "Ondo" ? (
                <>
                  <IntelRow label="Asset Name" value="Ondo Yield-Bearing USD (USDY)" />
                  <IntelRow label="Underlying" value="Short-term US Treasuries & Bank Deposits" />
                  <IntelRow label="Custodian" value="Morgan Stanley / Clearstream" />
                  <IntelRow label="Bridge Status" value="LayerZero OFT V2 - ACTIVE" />
                  <IntelRow label="Yield (30D Avg)" value="5.14% APY" />
                </>
              ) : (
                <>
                  <IntelRow label="Asset Name" value="OpenEden TBILL Token" />
                  <IntelRow label="Underlying" value="Direct Ownership of US Treasury Bills" />
                  <IntelRow label="Custodian" value="First Digital Trust" />
                  <IntelRow label="Bridge Status" value="Native Arbitrum One - ACTIVE" />
                  <IntelRow label="Yield (30D Avg)" value="5.32% APY" />
                </>
              )}
           </div>

           <div style={{ marginTop: "3rem", padding: "1.5rem", background: "rgba(0,0,0,0.5)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <Database color="#CCFF00" size={18} />
                <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>Transparency Archive</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
                All RWA movements are audited by the Neural Swarm and published to the BlackBox Archive. 
                View cryptographically signed attestation reports (v2026) below.
              </p>
              <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                 <button className="btn-glass" style={{ fontSize: "0.7rem" }}>MAR_2026_REPORT.PDF</button>
                 <button className="btn-glass" style={{ fontSize: "0.7rem" }}>FEB_2026_REPORT.PDF</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TransparencyMetric({ label, value, source }: { label: string; value: string; source: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
       <div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{label}</div>
          <div style={{ fontSize: "0.6rem", color: "#CCFF00", opacity: 0.6 }}>{source}</div>
       </div>
       <div style={{ fontSize: "1.1rem", fontWeight: "800" }}>{value}</div>
    </div>
  );
}

function IntelRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem", alignItems: "center" }}>
       <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
       <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", fontWeight: "600" }}>{value}</span>
    </div>
  );
}
