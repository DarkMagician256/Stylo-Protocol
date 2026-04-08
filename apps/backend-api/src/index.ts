// ============================================================================
// STYLO PROTOCOL — Backend API Entry Point
// Node.js + x402 Gateway + MCP Server
// ============================================================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { x402Router } from "./routes/x402";
import { vaultsRouter } from "./routes/vaults";
import { agentsRouter } from "./routes/agents";
import { rwaRouter } from "./routes/rwa";
import { healthRouter } from "./routes/health";
import { x402Middleware } from "./middleware/x402-gate";
import { errorHandler } from "./middleware/error-handler";
import { startMCPServer } from "./mcp/server";
import { startDeadManSwitch } from "./services/dead-man-switch";
import { initSupabase } from "./services/supabase";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

// ---------------------------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------------------------

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? ["https://stylo.protocol", "https://app.stylo.protocol"]
    : "*",
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

// ---------------------------------------------------------------------------
// Public Routes
// ---------------------------------------------------------------------------

app.use("/api/health", healthRouter);
app.use("/api/agents", agentsRouter);

// ---------------------------------------------------------------------------
// x402 Protected Routes (require on-chain USDC payment)
// ---------------------------------------------------------------------------

app.use("/api/x402", x402Router);
app.use("/api/vaults", x402Middleware, vaultsRouter);
app.use("/api/rwa", x402Middleware, rwaRouter);

// ---------------------------------------------------------------------------
// Error Handler
// ---------------------------------------------------------------------------

app.use(errorHandler);

// ---------------------------------------------------------------------------
// Server Startup
// ---------------------------------------------------------------------------

async function bootstrap() {
  console.log("🔷 Stylo Protocol — Backend API");
  console.log("================================");

  // Initialize Supabase
  await initSupabase();
  console.log("✅ Supabase connected");

  // Start Dead-Man Switch monitor
  startDeadManSwitch();
  console.log("🛡️  Dead-Man Switch active");

  // Start MCP Server on separate port
  const mcpPort = parseInt(process.env.MCP_SERVER_PORT || "4001", 10);
  await startMCPServer(mcpPort);
  console.log(`🤖 MCP Server listening on port ${mcpPort}`);

  // Start Express server
  const server = app.listen(PORT, () => {
    console.log(`🚀 API Server listening on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  // Graceful shutdown handling for Node.js watch mode
  const shutdown = () => {
    console.log("\n🔌 Shutting down gracefully...");
    server.close(() => {
      console.log("🛑 API Server closed");
      process.exit(0);
    });
  };
  
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});

export { app };
