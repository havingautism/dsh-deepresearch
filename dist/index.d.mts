import { Context, Service } from "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { z } from "zod";
import { Branded } from "@deepseek-ai/dsh-brand";

//#region src/types.d.ts
/** Opaque research project identity. */
type ResearchId = Branded<'ResearchId'>;
/**
 * Construct a research project identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded project identity.
 */
declare const ResearchId: (value: string) => ResearchId;
/** Opaque planned-question identity. */
type ResearchQuestionId = Branded<'ResearchQuestionId'>;
/**
 * Construct a planned-question identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded question identity.
 */
declare const ResearchQuestionId: (value: string) => ResearchQuestionId;
/** Opaque evidence identity. */
type ResearchEvidenceId = Branded<'ResearchEvidenceId'>;
/**
 * Construct an evidence identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded evidence identity.
 */
declare const ResearchEvidenceId: (value: string) => ResearchEvidenceId;
/** Supported investigation depths. */
type ResearchDepth = 'quick' | 'standard' | 'deep';
/** Durable research lifecycle phase. */
type ResearchPhase = 'planning' | 'awaiting_plan_confirm' | 'investigating' | 'ready_for_report' | 'incomplete' | 'writing' | 'done' | 'failed' | 'aborted';
/** Whether a private runner is live, idle, or user-paused. */
type ResearchRunState = 'idle' | 'running' | 'paused';
/** Progress state for one planned sub-question. */
type ResearchQuestionStatus = 'pending' | 'running' | 'covered' | 'partial' | 'blocked' | 'failed';
/** Evidence coverage state for one success criterion. */
type ResearchCoverageStatus = 'missing' | 'partial' | 'covered' | 'conflicted' | 'blocked';
/** Reviewer confidence assigned to one evidence item. */
type ResearchConfidence = 'low' | 'medium' | 'high';
/** Evaluator decision for one criterion. */
type ResearchVerification = '' | 'PASS' | 'WARNING' | 'FAIL';
/** Evidence review state. Missing on old rows means accepted. */
type ResearchEvidenceStatus = 'candidate' | 'accepted' | 'rejected';
/** Live scout card role. */
type ResearchScoutRole = 'waiting' | 'scout' | 'evaluator' | 'writing';
/** One source bound to a claim. */
interface ResearchEvidenceSource {
  readonly url: string;
  readonly snippet: string;
  readonly artifactId?: string | undefined;
}
/** One acceptance criterion tracked for a research sub-question. */
interface ResearchCriterion {
  readonly id: string;
  readonly text: string;
  readonly status: ResearchCoverageStatus;
  readonly summary: string;
  readonly gap: string;
  readonly warning: string;
  readonly verification: ResearchVerification;
  readonly toolCount: number;
}
/** One planned sub-question and its coverage state. */
interface ResearchQuestion {
  readonly id: ResearchQuestionId;
  readonly text: string;
  readonly dependsOn: ResearchQuestionId[];
  readonly status: ResearchQuestionStatus;
  readonly criteria: ResearchCriterion[];
  readonly gaps: string[];
  readonly handoff: string;
}
/** One accepted or reviewable source-backed finding. */
interface ResearchEvidence {
  readonly id: ResearchEvidenceId;
  readonly questionId: ResearchQuestionId;
  readonly criterionIds: string[];
  readonly source: string;
  readonly url: string | null;
  readonly snippet: string;
  readonly sources: ResearchEvidenceSource[];
  readonly claim: string;
  readonly confidence: ResearchConfidence;
  readonly status: ResearchEvidenceStatus;
  readonly createdAt: number;
}
/** Planned and consumed investigation budget. */
interface ResearchBudget {
  readonly maxSearches: number;
  readonly maxFetches: number;
  readonly searchesUsed: number;
  readonly fetchesUsed: number;
}
/** One recent tool row on a scout card. */
interface ResearchProgressTool {
  readonly name: string;
  readonly detail: string;
  readonly status: 'running' | 'done';
}
/** Live process state for one sub-question scout. */
interface ResearchScoutProgress {
  readonly questionId: ResearchQuestionId;
  readonly role: ResearchScoutRole;
  readonly status: 'waiting' | 'running' | 'verifying' | 'done' | 'partial' | 'blocked';
  readonly waitingOn: ResearchQuestionId[];
  readonly toolsUsed: number;
  readonly toolsCap: number;
  readonly activity: string;
  readonly tools: ResearchProgressTool[];
  readonly scoutDraft: string;
  readonly evaluatorDraft: string;
  readonly activeCriterionId: string;
  readonly activeCriterionText: string;
  readonly dependencySummary: string;
  readonly handoff: string;
}
/** Coarse investigation process snapshot for the overlay poll. */
interface ResearchProgress {
  readonly running: number;
  readonly waiting: number;
  readonly scouts: ResearchScoutProgress[];
}
/** One durable research project. */
interface ResearchProject {
  readonly id: ResearchId;
  readonly title: string;
  readonly question: string;
  readonly goal: string;
  readonly constraints: string;
  readonly seedText: string;
  readonly depth: ResearchDepth;
  readonly phase: ResearchPhase;
  readonly runState: ResearchRunState;
  readonly planConfirmed: boolean;
  readonly questions: ResearchQuestion[];
  readonly evidence: ResearchEvidence[];
  readonly conclusions: string[];
  readonly limitations: string[];
  readonly report: string | null;
  readonly budget: ResearchBudget;
  readonly progress: ResearchProgress;
  readonly createdAt: number;
  readonly updatedAt: number;
}
/** Create a project with an editable question plan. */
interface ResearchStartRequest {
  readonly title?: string;
  readonly question: string;
  readonly goal?: string;
  readonly constraints?: string;
  readonly seedText?: string;
  readonly depth: ResearchDepth;
  readonly questions: Array<{
    readonly text: string;
    readonly criteria: string[];
    readonly dependsOn?: number[];
  }>;
}
/** Replace the unconfirmed plan of an existing project. */
interface ResearchPlanUpdateRequest {
  readonly id: ResearchId;
  readonly goal: string;
  readonly constraints: string;
  readonly depth: ResearchDepth;
  readonly questions: Array<{
    readonly text: string;
    readonly criteria: string[];
    readonly dependsOn?: number[];
  }>;
}
/** Confirm a reviewed project plan. */
interface ResearchConfirmRequest {
  readonly id: ResearchId;
}
/** Attach a source-backed claim to one question. */
interface ResearchEvidenceRequest {
  readonly id: ResearchId;
  readonly questionId: ResearchQuestionId;
  readonly criterionIds?: string[] | undefined;
  readonly source: string;
  readonly url?: string | undefined;
  readonly snippet?: string | undefined;
  readonly sources?: ResearchEvidenceSource[] | undefined;
  readonly claim: string;
  readonly confidence: ResearchConfidence;
  readonly status?: ResearchEvidenceStatus | undefined;
}
/** Update question progress and optional criterion coverage. */
interface ResearchQuestionUpdateRequest {
  readonly id: ResearchId;
  readonly questionId: ResearchQuestionId;
  readonly status: ResearchQuestionStatus;
  readonly criteria?: ResearchCriterion[];
}
/** Save a final report. `partial` is accepted for compatibility and ignored: a saved report is complete. */
interface ResearchCompleteRequest {
  readonly id: ResearchId;
  readonly report: string;
  readonly conclusions?: string[] | undefined;
  readonly limitations?: string[] | undefined;
  readonly partial?: boolean | undefined;
}
/** Record an aborted or failed investigation. `aborted` pauses the run and keeps evidence. */
interface ResearchFailRequest {
  readonly id: ResearchId;
  readonly reason: string;
  readonly aborted?: boolean;
}
/** Resume a paused planning or investigation run. */
interface ResearchResumeRequest {
  readonly id: ResearchId;
}
/** Start or rewrite the report from current evidence. */
interface ResearchWriteReportRequest {
  readonly id: ResearchId;
}
/** Filter projects by searchable content and lifecycle phase. */
interface ResearchListRequest {
  readonly query?: string;
  readonly phase?: ResearchPhase;
}
/** Project listing response, newest edit first. */
interface ResearchListResult {
  readonly projects: ResearchProject[];
}
/** Exact project lookup. */
interface ResearchGetRequest {
  readonly id: ResearchId;
}
/** Delete one research project. */
interface ResearchDeleteRequest {
  readonly id: ResearchId;
}
/** Stable project deletion outcome. */
interface ResearchDeleteResult {
  readonly deleted: boolean;
}
declare module '@deepseek-ai/cordis' {
  interface Events {
    /**
     * Live project snapshot after each durable mutation so the workspace
     * can refresh plans, scout tools, and agent drafts without polling.
     * @param project - detached project after the mutation.
     * @mode emit
     */
    'deepResearch/progress'(project: ResearchProject): void;
  }
} //# sourceMappingURL=types.d.ts.map
//#endregion
//#region src/spec.d.ts
/** Stored success-criterion schema. */
declare const researchCriterionSchema: z.ZodObject<{
  id: z.ZodString;
  text: z.ZodString;
  status: z.ZodEnum<{
    missing: "missing";
    partial: "partial";
    covered: "covered";
    conflicted: "conflicted";
    blocked: "blocked";
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
declare const researchQuestionSchema: z.ZodObject<{
  id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>;
  text: z.ZodString;
  dependsOn: z.ZodArray<z.ZodPipe<z.ZodString, z.ZodTransform<ResearchQuestionId, string>>>;
  status: z.ZodEnum<{
    partial: "partial";
    covered: "covered";
    blocked: "blocked";
    pending: "pending";
    running: "running";
    failed: "failed";
  }>;
  criteria: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    status: z.ZodEnum<{
      missing: "missing";
      partial: "partial";
      covered: "covered";
      conflicted: "conflicted";
      blocked: "blocked";
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
declare const researchEvidenceSchema: z.ZodObject<{
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
/** Stored research project schema. */
declare const researchProjectSchema: z.ZodObject<{
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
    awaiting_plan_confirm: "awaiting_plan_confirm";
    investigating: "investigating";
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
      partial: "partial";
      covered: "covered";
      blocked: "blocked";
      pending: "pending";
      running: "running";
      failed: "failed";
    }>;
    criteria: z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      text: z.ZodString;
      status: z.ZodEnum<{
        missing: "missing";
        partial: "partial";
        covered: "covered";
        conflicted: "conflicted";
        blocked: "blocked";
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
declare const deepResearchDomainSpec: {
  name: string;
  version: number;
  tables: {
    projects: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<ResearchId, ResearchProject>;
  };
};
//#endregion
//#region src/migrate.d.ts
/** Default JSON unit path used by the web profile (`dshHomePath('storages')`). */
declare function defaultDeepResearchUnitPath(env?: NodeJS.ProcessEnv): string;
/** Resolve the on-disk unit file, optionally overriding the storages directory (tests). */
declare function resolveDeepResearchUnitPath(storageRoot?: string, env?: NodeJS.ProcessEnv): string;
/** Canonical sqlite file both product plugins mount when the host has none. */
declare function defaultSharedSqlitePath(env?: NodeJS.ProcessEnv): string;
/** Leftover plugin-named sqlite from before the shared-file cutover. */
declare function defaultDeepResearchSqlitePath(env?: NodeJS.ProcessEnv): string;
/**
 * Copy leftover `deepresearch.sqlite` projects into an empty domain table.
 * Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
 */
declare function importLegacySqliteProjectsIfEmpty(legacyPath: string, liveSqlitePath: string, table: {
  entries(): Iterable<[ResearchId, ResearchProject]>;
  put(id: ResearchId, project: ResearchProject): Promise<void>;
}): Promise<number>;
/**
 * Upgrade a stored deepresearch JSON unit up to the current domain version.
 * @param path - Absolute unit file path.
 * @param targetVersion - Expected domain version after migration.
 * @returns true when the file was rewritten.
 */
declare function migrateDeepResearchUnitFile(path: string, targetVersion?: number): Promise<boolean>;
/**
 * Copy leftover JSON projects into an empty domain table (JSON → SQLite cutover).
 * @param path - Migrated JSON unit path.
 * @param table - Opened projects table.
 * @returns number of imported projects.
 */
declare function importJsonProjectsIfEmpty(path: string, table: {
  entries(): Iterable<[ResearchId, ResearchProject]>;
  put(id: ResearchId, project: ResearchProject): Promise<void>;
}): Promise<number>;
//#endregion
//#region src/budget.d.ts
/**
 * Infer depth from the main question / goal. Brief cues win.
 * @param question - user research question.
 * @param goal - optional goal text.
 */
declare function inferResearchPlanDepth(question: string, goal?: string): ResearchDepth;
/** Session search/fetch caps from criterion count, with Codemini floors. */
declare function planResearchBudget(criterionCount: number, used?: {
  searchesUsed: number;
  fetchesUsed: number;
}): ResearchBudget;
/** Validate a submitted plan against depth limits. Throws a RangeError when oversized. */
declare function assertPlanFitsDepth(depth: ResearchDepth, questions: ReadonlyArray<{
  criteria: readonly unknown[];
}>, config: {
  maxQuestions: number;
  maxCriteriaPerQuestion: number;
}): void;
//#endregion
//#region src/investigation.d.ts
interface IndexedUrl {
  url: string;
  text: string;
  artifactId: string;
}
interface CandidateSource {
  url: string;
  snippet: string;
  artifactId: string;
  toolText: string;
}
interface Candidate {
  id: string;
  claim: string;
  confidence: 'low' | 'medium' | 'high';
  riskFlags: string[];
  sources: CandidateSource[];
}
declare function normalizeQuery(value: string): string;
declare function normalizeUrl(value: string): string;
declare function normalizeSubmittedCandidates(raw: unknown, criterionId: string): Candidate[];
declare function gateCandidatesByUrl(candidates: Candidate[], urlIndex: Map<string, IndexedUrl>): {
  accepted: Candidate[];
  rejected: Array<Candidate & {
    reason: string;
  }>;
};
declare function parseCandidatesFromText(raw: string, criterionId: string): {
  candidates: Candidate[];
  summary: string;
  gap: string;
};
declare function selectReadyWaveBatch(questions: readonly ResearchQuestion[], maxParallel?: number): {
  ready: ResearchQuestion[];
  waiting: Array<{
    question: ResearchQuestion;
    waitingOn: ResearchQuestionId[];
  }>;
};
declare function buildResearchWritingPack(project: ResearchProject): string;
//#endregion
//#region src/index.d.ts
/** Required project, evidence, and report limits. */
interface Config {
  readonly runnerEnabled: boolean;
  readonly runnerCwd: string;
  readonly maxProjects: number;
  readonly maxQuestions: number;
  readonly maxCriteriaPerQuestion: number;
  readonly maxEvidencePerProject: number;
  readonly maxReportChars: number;
  /** Override JSON storages directory; defaults to `DSH_HOME/storages`. */
  readonly storageRoot?: string;
}
declare module '@deepseek-ai/cordis' {
  interface Context {
    deepResearch: DeepResearchService;
  }
}
/** Durable Codemini-style Deep Research project service. */
declare class DeepResearchService extends TypertRemoteService {
  private readonly config;
  static inject: string[];
  static Config: s<Config>;
  private table?;
  private mutationTail;
  private readonly activeRuns;
  /** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
  constructor(ctx: Context, config: Config);
  protected [Service.init](): Promise<void>;
  list(request: ResearchListRequest): ResearchListResult;
  get(request: ResearchGetRequest): ResearchProject | null;
  start(request: ResearchStartRequest): Promise<ResearchProject>;
  updatePlan(request: ResearchPlanUpdateRequest): Promise<ResearchProject>;
  confirmPlan(request: ResearchConfirmRequest): Promise<ResearchProject>;
  addEvidence(request: ResearchEvidenceRequest): Promise<ResearchProject>;
  updateQuestion(request: ResearchQuestionUpdateRequest): Promise<ResearchProject>;
  complete(request: ResearchCompleteRequest): Promise<ResearchProject>;
  fail(request: ResearchFailRequest): Promise<ResearchProject>;
  resume(request: ResearchResumeRequest): Promise<ResearchProject>;
  writeReport(request: ResearchWriteReportRequest): Promise<ResearchProject>;
  delete(request: ResearchDeleteRequest): Promise<ResearchDeleteResult>;
  private launch;
  private runPlanning;
  private runInvestigation;
  private runWritingPhase;
  private runScoutForQuestion;
  private runCriterion;
  private runEvaluator;
  private runWriting;
  private spawnRole;
  private markPaused;
  private stopRun;
  private reserveBudget;
  private buildQuestions;
  private require;
  private requireWeb;
  private update;
  private emitProgress;
  private enqueue;
  private requireTable;
}
//#endregion
export { Config, DeepResearchService, DeepResearchService as default, type ResearchBudget, type ResearchCompleteRequest, type ResearchConfidence, type ResearchConfirmRequest, type ResearchCoverageStatus, type ResearchCriterion, type ResearchDeleteRequest, type ResearchDeleteResult, type ResearchDepth, type ResearchEvidence, ResearchEvidenceId, type ResearchEvidenceRequest, type ResearchEvidenceSource, type ResearchEvidenceStatus, type ResearchFailRequest, type ResearchGetRequest, ResearchId, type ResearchListRequest, type ResearchListResult, type ResearchPhase, type ResearchPlanUpdateRequest, type ResearchProgress, type ResearchProgressTool, type ResearchProject, type ResearchQuestion, ResearchQuestionId, type ResearchQuestionStatus, type ResearchQuestionUpdateRequest, type ResearchResumeRequest, type ResearchRunState, type ResearchScoutProgress, type ResearchScoutRole, type ResearchStartRequest, type ResearchVerification, type ResearchWriteReportRequest, assertPlanFitsDepth, buildResearchWritingPack, deepResearchDomainSpec, defaultDeepResearchSqlitePath, defaultDeepResearchUnitPath, defaultSharedSqlitePath, gateCandidatesByUrl, importJsonProjectsIfEmpty, importLegacySqliteProjectsIfEmpty, inferResearchPlanDepth, migrateDeepResearchUnitFile, normalizeQuery, normalizeSubmittedCandidates, normalizeUrl, parseCandidatesFromText, planResearchBudget, researchCriterionSchema, researchEvidenceSchema, researchProjectSchema, researchQuestionSchema, resolveDeepResearchUnitPath, selectReadyWaveBatch };