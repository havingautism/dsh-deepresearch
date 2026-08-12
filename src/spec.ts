/** Durable storage declaration for Deep Research. */

import { z } from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts'

/** Stored success-criterion schema. */
export const researchCriterionSchema = z.object({ id: z.string(), text: z.string(), status: z.enum(['missing', 'partial', 'covered', 'conflicted', 'blocked']), summary: z.string(), gap: z.string() })
/** Stored planned-question schema. */
export const researchQuestionSchema = z.object({ id: z.string().transform(ResearchQuestionId), text: z.string(), dependsOn: z.array(z.string().transform(ResearchQuestionId)), status: z.enum(['pending', 'running', 'covered', 'partial', 'blocked', 'failed']), criteria: z.array(researchCriterionSchema) })
/** Stored source-backed evidence schema. */
export const researchEvidenceSchema = z.object({ id: z.string().transform(ResearchEvidenceId), questionId: z.string().transform(ResearchQuestionId), criterionIds: z.array(z.string()), source: z.string(), url: z.string().nullable(), snippet: z.string(), claim: z.string(), confidence: z.enum(['low', 'medium', 'high']), createdAt: z.number() })
/** Stored research project schema. */
export const researchProjectSchema = z.object({
  id: z.string().transform(ResearchId), title: z.string(), question: z.string(), goal: z.string(), constraints: z.string(), seedText: z.string(),
  depth: z.enum(['quick', 'standard', 'deep']), phase: z.enum(['planning', 'awaiting_plan_confirm', 'investigating', 'ready_for_report', 'incomplete', 'writing', 'done', 'failed', 'aborted']), planConfirmed: z.boolean(),
  questions: z.array(researchQuestionSchema), evidence: z.array(researchEvidenceSchema), conclusions: z.array(z.string()), limitations: z.array(z.string()), report: z.string().nullable(),
  budget: z.object({ maxSearches: z.number(), maxFetches: z.number(), searchesUsed: z.number(), fetchesUsed: z.number() }), createdAt: z.number(), updatedAt: z.number(),
})
/** Global research store shared by Sessions. */
export const deepResearchDomainSpec = defineDomain({ name: 'deepresearch', version: 2, tables: { projects: domainTable<import('./types.ts').ResearchId, import('./types.ts').ResearchProject>(researchProjectSchema) } })
