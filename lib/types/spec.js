/** Durable storage declaration for Deep Research. */
import { z } from 'zod';
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain';
import { ResearchEvidenceId, ResearchId, ResearchQuestionId } from "./types.js";
const emptyProgress = { running: 0, waiting: 0, scouts: [] };
/** Stored success-criterion schema. */
export const researchCriterionSchema = z.object({
    id: z.string(),
    text: z.string(),
    status: z.enum(['missing', 'partial', 'covered', 'conflicted', 'blocked']),
    summary: z.string(),
    gap: z.string(),
    warning: z.string().optional().default(''),
    verification: z.enum(['', 'PASS', 'WARNING', 'FAIL']).optional().default(''),
    toolCount: z.number().optional().default(0),
});
/** Stored planned-question schema. */
export const researchQuestionSchema = z.object({
    id: z.string().transform(ResearchQuestionId),
    text: z.string(),
    dependsOn: z.array(z.string().transform(ResearchQuestionId)),
    status: z.enum(['pending', 'running', 'covered', 'partial', 'blocked', 'failed']),
    criteria: z.array(researchCriterionSchema),
    gaps: z.array(z.string()).optional().default([]),
    handoff: z.string().optional().default(''),
});
/** Stored source-backed evidence schema. */
export const researchEvidenceSchema = z.object({
    id: z.string().transform(ResearchEvidenceId),
    questionId: z.string().transform(ResearchQuestionId),
    criterionIds: z.array(z.string()),
    source: z.string(),
    url: z.string().nullable(),
    snippet: z.string(),
    sources: z.array(z.object({ url: z.string(), snippet: z.string(), artifactId: z.string().optional() })).optional().default([]),
    claim: z.string(),
    confidence: z.enum(['low', 'medium', 'high']),
    status: z.enum(['candidate', 'accepted', 'rejected']).optional().default('accepted'),
    createdAt: z.number(),
});
const researchScoutProgressSchema = z.object({
    questionId: z.string().transform(ResearchQuestionId),
    role: z.enum(['waiting', 'scout', 'evaluator', 'writing']),
    status: z.enum(['waiting', 'running', 'verifying', 'done', 'partial', 'blocked']),
    waitingOn: z.array(z.string().transform(ResearchQuestionId)),
    toolsUsed: z.number(),
    toolsCap: z.number(),
    activity: z.string(),
    tools: z.array(z.object({ name: z.string(), detail: z.string(), status: z.enum(['running', 'done']) })),
    scoutDraft: z.string(),
    evaluatorDraft: z.string(),
    activeCriterionId: z.string(),
    activeCriterionText: z.string(),
    dependencySummary: z.string(),
    handoff: z.string(),
});
/** Stored investigation process snapshot. */
export const researchProgressSchema = z.object({
    running: z.number(),
    waiting: z.number(),
    scouts: z.array(researchScoutProgressSchema),
});
/** Stored research project schema. */
export const researchProjectSchema = z.object({
    id: z.string().transform(ResearchId), title: z.string(), question: z.string(), goal: z.string(), constraints: z.string(), seedText: z.string(),
    depth: z.enum(['quick', 'standard', 'deep']), phase: z.enum(['planning', 'awaiting_plan_confirm', 'investigating', 'ready_for_report', 'incomplete', 'writing', 'done', 'failed', 'aborted']),
    runState: z.enum(['idle', 'running', 'paused']).optional().default('idle'),
    planConfirmed: z.boolean(),
    questions: z.array(researchQuestionSchema), evidence: z.array(researchEvidenceSchema), conclusions: z.array(z.string()), limitations: z.array(z.string()), report: z.string().nullable(),
    budget: z.object({ maxSearches: z.number(), maxFetches: z.number(), searchesUsed: z.number(), fetchesUsed: z.number() }),
    progress: researchProgressSchema.optional().default(emptyProgress),
    createdAt: z.number(), updatedAt: z.number(),
});
/** Global research store shared by Sessions. */
export const deepResearchDomainSpec = defineDomain({ name: 'deepresearch', version: 3, tables: { projects: domainTable(researchProjectSchema) } });
//# sourceMappingURL=spec.js.map