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
    warning: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    verification: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        "": "";
        PASS: "PASS";
        WARNING: "WARNING";
        FAIL: "FAIL";
    }>>>;
    toolCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
/** Stored planned-question schema. */
export declare const researchQuestionSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
    text: z.ZodString;
    dependsOn: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>>;
    status: z.ZodEnum<{
        covered: "covered";
        partial: "partial";
        blocked: "blocked";
        pending: "pending";
        running: "running";
        failed: "failed";
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
        warning: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        verification: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            "": "";
            PASS: "PASS";
            WARNING: "WARNING";
            FAIL: "FAIL";
        }>>>;
        toolCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>;
    gaps: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    handoff: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
/** Stored source-backed evidence schema. */
export declare const researchEvidenceSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchEvidenceId, string>>;
    questionId: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
    criterionIds: z.ZodArray<z.ZodString>;
    source: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    snippet: z.ZodString;
    sources: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        snippet: z.ZodString;
        artifactId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    claim: z.ZodString;
    confidence: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        candidate: "candidate";
        accepted: "accepted";
        rejected: "rejected";
    }>>>;
    createdAt: z.ZodNumber;
}, z.core.$strip>;
/** Stored investigation process snapshot. */
export declare const researchProgressSchema: z.ZodObject<{
    running: z.ZodNumber;
    waiting: z.ZodNumber;
    scouts: z.ZodArray<z.ZodObject<{
        questionId: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
        role: z.ZodEnum<{
            waiting: "waiting";
            scout: "scout";
            evaluator: "evaluator";
            writing: "writing";
        }>;
        status: z.ZodEnum<{
            partial: "partial";
            blocked: "blocked";
            running: "running";
            waiting: "waiting";
            verifying: "verifying";
            done: "done";
        }>;
        waitingOn: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>>;
        toolsUsed: z.ZodNumber;
        toolsCap: z.ZodNumber;
        activity: z.ZodString;
        tools: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            detail: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                done: "done";
            }>;
        }, z.core.$strip>>;
        scoutDraft: z.ZodString;
        evaluatorDraft: z.ZodString;
        activeCriterionId: z.ZodString;
        activeCriterionText: z.ZodString;
        dependencySummary: z.ZodString;
        handoff: z.ZodString;
    }, z.core.$strip>>;
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
        failed: "failed";
        writing: "writing";
        done: "done";
        planning: "planning";
        investigating: "investigating";
        awaiting_plan_confirm: "awaiting_plan_confirm";
        ready_for_report: "ready_for_report";
        incomplete: "incomplete";
        aborted: "aborted";
    }>;
    runState: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        running: "running";
        idle: "idle";
        paused: "paused";
    }>>>;
    planConfirmed: z.ZodBoolean;
    questions: z.ZodArray<z.ZodObject<{
        id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
        text: z.ZodString;
        dependsOn: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>>;
        status: z.ZodEnum<{
            covered: "covered";
            partial: "partial";
            blocked: "blocked";
            pending: "pending";
            running: "running";
            failed: "failed";
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
            warning: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            verification: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
                "": "";
                PASS: "PASS";
                WARNING: "WARNING";
                FAIL: "FAIL";
            }>>>;
            toolCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>>;
        gaps: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        handoff: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    evidence: z.ZodArray<z.ZodObject<{
        id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchEvidenceId, string>>;
        questionId: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
        criterionIds: z.ZodArray<z.ZodString>;
        source: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        snippet: z.ZodString;
        sources: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            snippet: z.ZodString;
            artifactId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>>;
        claim: z.ZodString;
        confidence: z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>;
        status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            candidate: "candidate";
            accepted: "accepted";
            rejected: "rejected";
        }>>>;
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
    progress: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        running: z.ZodNumber;
        waiting: z.ZodNumber;
        scouts: z.ZodArray<z.ZodObject<{
            questionId: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
            role: z.ZodEnum<{
                waiting: "waiting";
                scout: "scout";
                evaluator: "evaluator";
                writing: "writing";
            }>;
            status: z.ZodEnum<{
                partial: "partial";
                blocked: "blocked";
                running: "running";
                waiting: "waiting";
                verifying: "verifying";
                done: "done";
            }>;
            waitingOn: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>>;
            toolsUsed: z.ZodNumber;
            toolsCap: z.ZodNumber;
            activity: z.ZodString;
            tools: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                detail: z.ZodString;
                status: z.ZodEnum<{
                    running: "running";
                    done: "done";
                }>;
            }, z.core.$strip>>;
            scoutDraft: z.ZodString;
            evaluatorDraft: z.ZodString;
            activeCriterionId: z.ZodString;
            activeCriterionText: z.ZodString;
            dependencySummary: z.ZodString;
            handoff: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
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
//# sourceMappingURL=spec.d.ts.map