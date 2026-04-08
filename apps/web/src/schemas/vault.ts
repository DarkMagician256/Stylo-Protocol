import { z } from "zod";

export const VaultSchema = z.object({
  id: z.string(),
  name: z.string(),
  asset: z.string(),
  provider: z.string(),
  tvl: z.string(),
  apy: z.string(),
  breakdown: z.string(),
  privacy: z.enum(["FHE_ENCRYPTED", "MEV_SHIELDED", "TRANSPARENT"]),
  status: z.enum(["racing", "analyzing", "synthesizing", "idle"])
});

export type Vault = z.infer<typeof VaultSchema>;
