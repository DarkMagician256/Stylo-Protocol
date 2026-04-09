"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Wallet, Activity, Shield, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Vaults", path: "/vaults" },
    { name: "RWA Intel", path: "/rwa-bridge" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Audit", path: "/audit" },
  ];



  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar" style={{ borderBottom: "1px solid rgba(204, 255, 0, 0.15)" }}>
      {/* Logo */}
      <Link href="/" className="navbar-logo" onClick={closeMobile}>
        <div className="navbar-logo-icon">
          <Brain width={28} height={28} style={{ color: "#CCFF00" }} />
        </div>
        <span className="navbar-logo-text" style={{ fontFamily: "var(--font-jetbrains)" }}>
          STYLO <span style={{ color: "rgba(204, 255, 0, 0.6)" }}>PROT_</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`navbar-link${pathname === link.path ? " active" : ""}`}
            style={pathname === link.path ? { color: "#CCFF00", background: "rgba(204, 255, 0, 0.1)" } : {}}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {/* Native Network Status */}
        <div className="hidden md:block">
          <div
            className="btn-glass"
            style={{ 
              padding: "0.4rem 1rem", 
              fontSize: "0.75rem", 
              borderColor: "#CCFF00",
              boxShadow: "0 0 10px rgba(204, 255, 0, 0.2)",
              cursor: "default"
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CCFF00" }} />
            Arbitrum One
          </div>
        </div>

        {/* x402 Micropayments Badge */}
        <div className="navbar-status hidden md:flex" style={{ background: "rgba(204, 255, 0, 0.05)", borderColor: "rgba(204, 255, 0, 0.1)" }}>
          <Activity width={13} height={13} style={{ color: "#CCFF00" }} />
          <span style={{ fontWeight: "700", color: "#CCFF00" }}>$24.50</span>
          <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>x402</span>
        </div>

        <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
          <Wallet width={15} height={15} />
          <span className="hidden md:inline">StylusConnect</span>
        </button>

        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X width={20} height={20} /> : <Menu width={20} height={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="navbar-mobile-menu open"
            style={{ background: "rgba(10, 10, 10, 0.98)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={closeMobile}
                className={`navbar-mobile-link${pathname === link.path ? " active" : ""}`}
                style={pathname === link.path ? { color: "#CCFF00" } : {}}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
