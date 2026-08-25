/** Depth limits and session tool budgets, aligned with Codemini. */
import type { ResearchBudget, ResearchDepth, ResearchProject } from './types.ts';
/** Combined search/fetch/successful-read cap per success criterion. */
export declare const TOOLS_PER_CRITERION = 10;
/** Independent questions that may scout at once. */
export declare const MAX_PARALLEL_SCOUTS = 3;
/** Oversized plan resubmits before the planning run fails. */
export declare const MAX_PLAN_REJECTS = 3;
/** Floor applied when auto-sizing session search budget. */
export declare const MIN_SESSION_SEARCHES = 25;
/** Floor applied when auto-sizing session fetch budget. */
export declare const MIN_SESSION_FETCHES = 200;
/** Plan size by depth (quick maps to Codemini brief). */
export declare const PLAN_DEPTH_LIMITS: Record<ResearchDepth, {
    maxQuestions: number;
    maxCriteriaPerQuestion: number;
}>;
/** Effective plan limits: depth cap intersected with plugin config. */
export declare function planLimits(depth: ResearchDepth, config: {
    maxQuestions: number;
    maxCriteriaPerQuestion: number;
}): {
    maxQuestions: number;
    maxCriteriaPerQuestion: number;
};
/**
 * Infer depth from the main question / goal. Brief cues win.
 * @param question - user research question.
 * @param goal - optional goal text.
 */
export declare function inferResearchPlanDepth(question: string, goal?: string): ResearchDepth;
/**
 * Apply the brief-wins rule when the model submits a depth.
 * @param requested - depth from the planner.
 * @param question - main question.
 * @param goal - optional goal.
 */
export declare function resolveSubmittedDepth(requested: ResearchDepth, question: string, goal?: string): ResearchDepth;
/** Session search/fetch caps from criterion count, with Codemini floors. */
export declare function planResearchBudget(criterionCount: number, used?: {
    searchesUsed: number;
    fetchesUsed: number;
}): ResearchBudget;
/** Count success criteria on a project or draft plan. */
export declare function countCriteria(questions: ReadonlyArray<{
    criteria: readonly unknown[];
}>): number;
/** Validate a submitted plan against depth limits. Throws a RangeError when oversized. */
export declare function assertPlanFitsDepth(depth: ResearchDepth, questions: ReadonlyArray<{
    criteria: readonly unknown[];
}>, config: {
    maxQuestions: number;
    maxCriteriaPerQuestion: number;
}): void;
/** True when a plan-size error should bounce the planner instead of failing the run. */
export declare function isOversizedPlanError(error: unknown): boolean;
/** Session budget for a stored project, preserving used counts. */
export declare function budgetForProject(project: Pick<ResearchProject, 'questions' | 'budget'>): ResearchBudget;
//# sourceMappingURL=budget.d.ts.map