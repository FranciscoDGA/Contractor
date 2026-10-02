import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(180),
    keyword: z.string(),
    cluster: z.enum(['forensic', 'cost', 'state', 'tool']),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([])
  })
});

export const collections = { guides };
