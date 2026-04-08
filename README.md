# ⚡️ Stylo Protocol: Sovereign AI Infrastructure

[![Network: Arbitrum](https://img.shields.io/badge/Network-Arbitrum%20One-blue.svg)](https://arbitrum.io/)
[![Logic: Stylus (Rust)](https://img.shields.io/badge/Logic-Stylus%20(Rust)-orange.svg)](https://arbitrum.io/stylus)
[![Security: Fhenix FHE](https://img.shields.io/badge/Security-Fhenix%20FHE-green.svg)](https://fhenix.io/)
[![Design: Neon Institutional](https://img.shields.io/badge/Design-Neon%20Institutional-CCFF00.svg)](#)

**Stylo Protocol** is an institutional-grade RWA (Real World Asset) orchestration layer built on **Arbitrum Stylus**. It bridges high-yield US Treasuries (**Ondo USDY** and **OpenEden TBILL**) with autonomous AI agents, creating a sovereign execution environment for the Agentic Economy.

---

## 🌌 The Institutional Vision

Stylo acts as a **Software-only Intelligence Layer**. It does not custody assets; it orchestrates them. By leveraging the performance of Rust-based smart contracts (Stylus) and the privacy of Fully Homomorphic Encryption (FHE), Stylo enables AI agents to execute complex rebalancing strategies without revealing competitive thresholds to MEV bots.

### 💎 Core Assets
*   **Ondo USDY**: Yield-bearing USD stablecoin backed by short-term US Treasuries.
*   **OpenEden TBILL**: Tokenized US Treasury Bills with 24/7 liquidity on Arbitrum.

---

## 🛠️ Technology Stack (April 2026)

*   **Frontend**: Google Antigravity v2.2 (GPU-accelerated Three.js + React 19).
*   **Smart Contracts**: Arbitrum Stylus (Rust) for ultra-low gas and high-performance math.
*   **Privacy Layer**: Fhenix FHE for shielded rebalancing intents and encrypted strategy bounds.
*   **Oracle**: Pyth Network (Low-latency Pull Oracles).
*   **Micropayments**: x402 Specification for Agent-to-Agent (M2M) signal monetization.
*   **Security**: Native integration with Gnosis Safe {Wallet} for institutional multi-sig controls.

---

## 📂 Repository Structure

```bash
stylo-protocol/
├── apps/
│   ├── web/                # Next.js 16 + Antigravity Neural UI
│   └── backend-api/        # Node.js + Supabase Real-time Swarm Telemetry
├── packages/
│   ├── contracts/          # Arbitrum Stylus (Rust) Smart Contracts
│   └── sdk/                # Agentic SDK for cross-chain strategy execution
└── docs/
    └── TECHNICAL_PAPER.md  # Architectural deep-dive
```

---

## ⚡️ Getting Started

### Prerequisites
*   Node.js >= 22.0.0
*   pnpm >= 9.0.0
*   Rust + `cargo-stylus` (for contract development)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/DarkMagician256/Stylo-Protocol.git
    cd Stylo-Protocol
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Launch the development environment:
    ```bash
    pnpm dev
    ```

### Contract Deployment (Stylus)
```bash
cd packages/contracts
cargo stylus check
cargo stylus deploy --private-key <YOUR_KEY>
```

---

## 🛡️ Security & Audits

Stylo Protocol prioritized security via a multi-layered approach:
*   **Rust-Native Math**: Protection against integer overflows and standard EVM vulnerabilities.
*   **FHE Shielding**: MEV bots cannot see strategy thresholds, preventing front-running on large-cap RWA rebalances.
*   **Safe Multi-sig**: Critical parameter updates (Caps, Fees, Allocations) require multi-agent or institutional signatures.

---

## 📜 Legal Notice
Stylo Protocol is a software solution. It is not a financial service provider, custodian, or fund manager. All RWA assets are governed by their respective issuers (Ondo Finance & OpenEden).

---

**Developed with ⚡️ by the Stylo Labs Team.**
