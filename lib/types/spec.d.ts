/** Durable storage declaration for Deep Research. */
import { z } from 'zod';
import { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts';
/** Stored success-criterion schema. */
export declare const researchCriterionSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    status: z.ZodEnum<{
        covered: "covered";
        partial: "partial";
        blocked: "blocked";
        missing: "missing";
        conflicted: "conflicted";
    }>;
    summary: z.ZodString;
    gap: z.ZodString;
}, z.core.$strip>;
/** Stored planned-question schema. */
export declare const researchQuestionSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
    text: z.ZodString;
    dependsOn: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>>;
    status: z.ZodEnum<{
        failed: "failed";
        pending: "pending";
        running: "running";
        covered: "covered";
        partial: "partial";
        blocked: "blocked";
    }>;
    criteria: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        status: z.ZodEnum<{
            covered: "covered";
            partial: "partial";
            blocked: "blocked";
            missing: "missing";
            conflicted: "conflicted";
        }>;
        summary: z.ZodString;
        gap: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Stored source-backed evidence schema. */
export declare const researchEvidenceSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchEvidenceId, string>>;
    questionId: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
    criterionIds: z.ZodArray<z.ZodString>;
    source: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    snippet: z.ZodString;
    claim: z.ZodString;
    confidence: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    createdAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored research project schema. */
export declare const researchProjectSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchId, string>>;
    title: z.ZodString;
    question: z.ZodString;
    goal: z.ZodString;
    constraints: z.ZodString;
    seedText: z.ZodString;
    depth: z.ZodEnum<{
        quick: "quick";
        standard: "standard";
        deep: "deep";
    }>;
    phase: z.ZodEnum<{
        planning: "planning";
        awaiting_plan_confirm: "awaiting_plan_confirm";
        investigating: "investigating";
        ready_for_report: "ready_for_report";
        incomplete: "incomplete";
        writing: "writing";
        done: "done";
        failed: "failed";
        aborted: "aborted";
    }>;
    planConfirmed: z.ZodBoolean;
    questions: z.ZodArray<z.ZodObject<{
        id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
        text: z.ZodString;
        dependsOn: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>>;
        status: z.ZodEnum<{
            failed: "failed";
            pending: "pending";
            running: "running";
            covered: "covered";
            partial: "partial";
            blocked: "blocked";
        }>;
        criteria: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            text: z.ZodString;
            status: z.ZodEnum<{
                covered: "covered";
                partial: "partial";
                blocked: "blocked";
                missing: "missing";
                conflicted: "conflicted";
            }>;
            summary: z.ZodString;
            gap: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    evidence: z.ZodArray<z.ZodObject<{
        id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchEvidenceId, string>>;
        questionId: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
        criterionIds: z.ZodArray<z.ZodString>;
        source: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        snippet: z.ZodString;
        claim: z.ZodString;
        confidence: z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>;
        createdAt: z.ZodNumber;
    }, z.core.$strip>>;
    conclusions: z.ZodArray<z.ZodString>;
    limitations: z.ZodArray<z.ZodString>;
    report: z.ZodNullable<z.ZodString>;
    budget: z.ZodObject<{
        maxSearches: z.ZodNumber;
        maxFetches: z.ZodNumber;
        searchesUsed: z.ZodNumber;
        fetchesUsed: z.ZodNumber;
    }, z.core.$strip>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Global research store shared by Sessions. */
export declare const deepResearchDomainSpec: {
    name: string;
    version: number;
    tables: {
        projects: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<ResearchId, import("./types.ts").ResearchProject>;
    };
};
