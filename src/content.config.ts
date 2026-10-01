import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Uma entrada por versão publicada. Vazio enquanto não houver download público.
const releases = defineCollection({
  loader: glob({ pattern: "**/*.{md,json}", base: "./src/content/releases" }),
  schema: z.object({
    // Versões ocupam a série 1xx do catálogo (ALX 100 é o próprio catálogo de versões).
    catalog: z.string().regex(/^ALX 1\d{2}$/),
    version: z.string(),
    channel: z.enum(["alpha", "beta", "rc", "stable"]),
    published: z.boolean().default(false),
    files: z
      .array(
        z.object({
          platform: z.string(),
          format: z.string(),
          name: z.string(),
          url: z.url(),
          sha256: z.string().regex(/^[a-f0-9]{64}$/),
          size: z.string().optional(),
        }),
      )
      .min(1),
    notes: z.record(z.enum(["pt-br", "en"]), z.string()),
  }),
});

export const collections = { releases };
