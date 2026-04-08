// ============================================================================
// Supabase Client & Database Initialization
// ============================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient;

export async function initSupabase(): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("⚠️  Supabase credentials not configured, using mock mode");
    return;
  }

  supabase = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });

  // Verify connection
  const { error } = await supabase.from("agent_telemetry").select("id").limit(1);
  if (error && !error.message.includes("does not exist")) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
}

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error("Supabase not initialized. Call initSupabase() first.");
  }
  return supabase;
}

// ---------------------------------------------------------------------------
// Realtime Subscriptions
// ---------------------------------------------------------------------------

export function subscribeToAgentTelemetry(
  callback: (payload: any) => void
): () => void {
  const channel = getSupabase()
    .channel("agent-telemetry-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "agent_telemetry",
      },
      callback
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}

export function subscribeToX402Receipts(
  callback: (payload: any) => void
): () => void {
  const channel = getSupabase()
    .channel("x402-receipts-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "x402_receipts",
      },
      callback
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}
