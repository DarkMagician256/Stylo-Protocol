"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Globe, Lock, ShieldCheck, Zap, Activity, Terminal as TerminalIcon, Cpu, Command } from "lucide-react";
import { motion } from "framer-motion";

export function Landing() {
  return (
    <div className="landing-wrapper" style={{ color: "#fff", paddingTop: "0" }}>
      {/* Hero Section */}
      <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 10, padding: "4rem 1.5rem" }}>
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           style={{ textAlign: "center", maxWidth: "1000px" }}
        >
          {/* Badge */}
          <div className="landing-badge" style={{ background: "rgba(204, 255, 0, 0.05)", border: "1px solid rgba(204, 255, 0, 0.2)", color: "#CCFF00", marginBottom: "2.5rem" }}>
            <span className="landing-badge-dot" style={{ background: "#CCFF00" }} />
            <span>AGENTIC_EXECUTION_LAYER_v2.2_ONLINE</span>
          </div>

          <h1 className="landing-title" style={{ fontSize: "clamp(3rem, 12vw, 7.5rem)", letterSpacing: "-0.06em", lineHeight: 0.9, marginBottom: "2rem" }}>
            THE_NEURAL<br />
            <span style={{ color: "#CCFF00", filter: "drop-shadow(0 0 30px rgba(204, 255, 0, 0.3))" }}>LIQUIDITY_HUB</span>
          </h1>

          <p className="landing-subtitle" style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", color: "rgba(255,255,255,0.5)", maxWidth: "720px", margin: "0 auto 3rem", lineHeight: 1.6 }}>
            Autonomous orchestration of <span style={{ color: "#CCFF00" }}>Ondo USDY</span> and <span style={{ color: "#CCFF00" }}>OpenEden TBILL</span>. 
            Bridging institutional US Treasuries with Arbitrum liquidity via FHE-encrypted AI agents.
          </p>

          <div className="landing-cta" style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: "1.2rem 3rem", fontSize: "1rem" }}>
              INITIALIZE_DASHBOARD <Command size={18} style={{ marginLeft: "0.5rem" }} />
            </Link>
            <Link href="/vaults" className="btn-glass" style={{ padding: "1.2rem 3rem", fontSize: "1rem" }}>
              EXPLORE_VAULTS
            </Link>
          </div>
        </motion.div>

        {/* Live System Intel - Hero Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            marginTop: "5rem",
            width: "100%",
            maxWidth: "1280px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem"
          }}
        >
          <StatCard
            label="Neural APY"
            value="18.92%"
            trend="Aggregated Swarm Yield"
            icon={<Zap size={20} color="#CCFF00" />}
          />
          <StatCard
            label="RWA Liquidity"
            value="$45.35M"
            trend="Ondo / OpenEden TVL"
            icon={<Globe size={20} color="#CCFF00" />}
          />
          <StatCard
            label="x402 Volume"
            value="24.8k"
            trend="M2M Signal Payments"
            icon={<Activity size={20} color="#CCFF00" />}
          />
          <StatCard
            label="Stylus Ink"
            value="OPTIMIZED"
            trend="WASM Execution Tier"
            icon={<Cpu size={20} color="#CCFF00" />}
          />
        </motion.div>
      </section>

      {/* Logic & Features Section */}
      <section style={{ padding: "8rem 2rem", position: "relative" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
             <h2 style={{ fontSize: "0.75rem", fontWeight: "800", color: "#CCFF00", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>System Architecture</h2>
             <h3 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em" }}>THE_AGENTIC_ECONOMY_CORE</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <FeatureCard
              icon={<BrainCircuit size={28} color="#CCFF00" />}
              title="Neural Swarm v2.2"
              description="High-frequency agent coordination layer executing sub-second strategy rebalancing on Arbitrum One."
            />
            <FeatureCard
              icon={<ShieldCheck size={28} color="#CCFF00" />}
              title="Fhenix FHE Privacy"
              description="Trade intents are shielded using Fully Homomorphic Encryption to prevent MEV exploitation by front-running bots."
            />
            <FeatureCard
              icon={<Lock size={28} color="#CCFF00" />}
              title="Institutional Safe"
              description="Native integration with Gnosis Safe multisig. Institutional controls for large-cap USDY/TBILL depositions."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: { label: string; value: string; trend: string; icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: "rgba(204, 255, 0, 0.3)" }}
      className="glass-card" 
      style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(10, 10, 10, 0.7)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
        {icon}
      </div>
      <div style={{ fontSize: "2.25rem", fontWeight: "900", color: "#fff", marginBottom: "0.25rem", letterSpacing: "-0.05em" }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "#CCFF00", opacity: 0.8 }}>{trend}</div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: "3rem 2rem", 
        border: "1px solid rgba(255,255,255,0.05)", 
        background: "rgba(10, 10, 10, 0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}
    >
      <div style={{ width: "56px", height: "56px", background: "rgba(204, 255, 0, 0.05)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(204, 255, 0, 0.1)" }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#fff" }}>{title}</h3>
      <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: "1.6" }}>{description}</p>
    </div>
  );
}
