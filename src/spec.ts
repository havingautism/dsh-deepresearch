/** Durable storage declaration for deep research. */

import { z } from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { ResearchId } from './types.ts'

/** Durable source evidence schema. */
export const researchEvidenceSchema = z.object({
  source: z.string(),
  url: z.string().nullable(),
  summary: z.string(),
})

/** Durable research project schema. */
export const researchProjectSchema = z.object({
  id: z.string().transform(ResearchId),
  question: z.string(),
  depth: z.enum(['quick', 'standard', 'deep']),
  phase: z.enum(['planning', 'researching', 'synthesizing', 'complete']),
  plan: z.array(z.string()),
  evidence: z.array(researchEvidenceSchema),
  report: z.string().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
})

/** Global research store shared by Sessions. */
export const deepResearchDomainSpec = defineDomain({
  name: 'deepresearch',
  version: 1,
  tables: { projects: domainTable<import('./types.ts').ResearchId, import('./types.ts').ResearchProject>(researchProjectSchema) },
})
