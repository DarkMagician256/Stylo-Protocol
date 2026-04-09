"use client";

import { Github, Twitter, MessageSquare, ShieldCheck, Activity, Cpu, Globe, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer" style={{ borderTop: "1px solid rgba(204, 255, 0, 0.1)", background: "rgba(5, 5, 5, 0.8)" }}>
      <div className="footer-inner" style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
          
          {/* Brand & Mission */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Zap color="#CCFF00" size={24} fill="#CCFF00" />
              <h3 style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-0.05em", color: "#fff" }}>
                STYLO <span style={{ color: "#CCFF00" }}>PROT_</span>
              </h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", maxWidth: "300px" }}>
              Sovereign AI Infrastructure orchestrating Institutional US Treasuries (USDY/TBILL) 
              on Arbitrum One. Powered by Stylus & Fhenix.
            </p>
            <div className="footer-social" style={{ display: "flex", gap: "1rem" }}>
              <SocialIcon icon={<Twitter size={18} />} label="X / Twitter" />
              <SocialIcon icon={<Github size={18} />} label="GitHub" />
              <SocialIcon icon={<MessageSquare size={18} />} label="Discord" />
            </div>
          </div>

          {/* Infrastructure Links */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
             <div>
                <h4 style={{ fontSize: "0.75rem", fontWeight: "800", color: "#CCFF00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Protocol</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0 }}>
                  <FooterLink label="Documentation" />
                  <FooterLink label="Stylus SDK" />
                  <FooterLink label="x402 Protocol" />
                  <FooterLink label="Governance" />
                </ul>
             </div>
             <div>
                <h4 style={{ fontSize: "0.75rem", fontWeight: "800", color: "#CCFF00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Security</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0 }}>
                  <FooterLink label="OSPP Audit" icon={<ShieldCheck size={12} />} />
                  <FooterLink label="Bug Bounty" />
                  <FooterLink label="FHE Specs" />
                  <FooterLink label="Status" />
                </ul>
             </div>
          </div>

          {/* Real-time Health Monitor */}
          <div className="glass-card" style={{ padding: "1.5rem", border: "1px solid rgba(204, 255, 0, 0.1)", background: "rgba(204, 255, 0, 0.02)" }}>
             <h4 style={{ fontSize: "0.65rem", fontWeight: "800", color: "#CCFF00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={14} />
                LIVE_NETWORK_HEALTH
             </h4>
             <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <HealthItem label="Arbitrum One" status="OPERATIONAL" sub="Finality: 0.25s" />
                <HealthItem label="Neural Swarm" status="SYNCED" sub="32 Nodes Active" />
                <HealthItem label="Fhenix FHE" status="ONLINE" sub="MEV Shield: 100%" />
             </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar" style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
           <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
              © 2026 STYLO PROTOCOL _ NEON_INSTITUTIONAL_CORE
           </div>
           <div style={{ display: "flex", gap: "2rem" }}>
              <a href="#" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>TERMS_OF_SERVICE</a>
              <a href="#" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>PRIVACY_POLICY</a>
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#CCFF00", fontSize: "0.75rem", fontWeight: "800" }}>
              <Globe size={14} />
              GLOBAL_CONSENSUS: VALID
           </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a 
      href="#" 
      style={{ 
        width: "36px", 
        height: "36px", 
        borderRadius: "50%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "rgba(255,255,255,0.03)", 
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.6)",
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#CCFF00";
        e.currentTarget.style.color = "#CCFF00";
        e.currentTarget.style.background = "rgba(204, 255, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      {icon}
    </a>
  );
}

function FooterLink({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <li>
      <a 
        href="#" 
        style={{ 
          fontSize: "0.875rem", 
          color: "rgba(255,255,255,0.4)", 
          textDecoration: "none", 
          display: "flex", 
          alignItems: "center", 
          gap: "0.5rem",
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#CCFF00"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
      >
        {icon}
        {label}
      </a>
    </li>
  );
}

function HealthItem({ label, status, sub }: { label: string; status: string; sub: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
       <div>
          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#fff" }}>{label}</div>
          <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>{sub}</div>
       </div>
       <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: "900", color: "#CCFF00" }}>{status}</div>
          <div style={{ width: "40px", height: "1px", background: "rgba(204, 255, 0, 0.3)", marginTop: "0.2rem", float: "right" }} />
       </div>
    </div>
  );
}
