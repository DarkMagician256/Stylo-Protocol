import { z } from "zod";

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  reputation: z.number(), // ELO Reputation
  strategy: z.string(),
  managedAssets: z.string(),
  performance: z.number(),
  lastAction: z.string(),
  status: z.enum(["active", "idle", "maintenance"])
});

export type Agent = z.infer<typeof AgentSchema>;
