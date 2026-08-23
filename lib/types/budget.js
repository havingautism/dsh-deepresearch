/** Depth limits and session tool budgets, aligned with Codemini. */
/** Combined search/fetch/successful-read cap per success criterion. */
export const TOOLS_PER_CRITERION = 10;
/** Independent questions that may scout at once. */
export const MAX_PARALLEL_SCOUTS = 3;
/** Oversized plan resubmits before the planning run fails. */
export const MAX_PLAN_REJECTS = 3;
/** Floor applied when auto-sizing session search budget. */
export const MIN_SESSION_SEARCHES = 25;
/** Floor applied when auto-sizing session fetch budget. */
export const MIN_SESSION_FETCHES = 200;
/** Plan size by depth (quick maps to Codemini brief). */
export const PLAN_DEPTH_LIMITS = {
    quick: { maxQuestions: 2, maxCriteriaPerQuestion: 2 },
    standard: { maxQuestions: 4, maxCriteriaPerQuestion: 3 },
    deep: { maxQuestions: 6, maxCriteriaPerQuestion: 3 },
};
/** Effective plan limits: depth cap intersected with plugin config. */
export function planLimits(depth, config) {
    const limits = PLAN_DEPTH_LIMITS[depth];
    return {
        maxQuestions: Math.min(config.maxQuestions, limits.maxQuestions),
        maxCriteriaPerQuestion: Math.min(config.maxCriteriaPerQuestion, limits.maxCriteriaPerQuestion),
    };
}
/**
 * Infer depth from the main question / goal. Brief cues win.
 * @param question - user research question.
 * @param goal - optional goal text.
 */
export function inferResearchPlanDepth(question, goal = '') {
    const text = `${question} ${goal}`.toLowerCase();
    const briefHints = ['简短', '简单', '快速', '概览', '简介', '一眼', '一句话', 'brief', 'quick', 'short', 'simple', 'overview', 'tl;dr', 'tldr', 'eli5'];
    const deepHints = ['深入', '详尽', '全面', '对比决策', '系统梳理', '调研报告', 'deep', 'thorough', 'comprehensive', 'exhaustive', 'in-depth', 'detailed analysis'];
    if (briefHints.some(hint => text.includes(hint)))
        return 'quick';
    if (deepHints.some(hint => text.includes(hint)))
        return 'deep';
    return 'standard';
}
/**
 * Apply the brief-wins rule when the model submits a depth.
 * @param requested - depth from the planner.
 * @param question - main question.
 * @param goal - optional goal.
 */
export function resolveSubmittedDepth(requested, question, goal = '') {
    return inferResearchPlanDepth(question, goal) === 'quick' ? 'quick' : requested;
}
/** Session search/fetch caps from criterion count, with Codemini floors. */
export function planResearchBudget(criterionCount, used) {
    const count = Math.max(1, Math.floor(criterionCount) || 1);
    const toolBudget = count * TOOLS_PER_CRITERION;
    return {
        maxSearches: Math.max(MIN_SESSION_SEARCHES, toolBudget),
        maxFetches: Math.max(MIN_SESSION_FETCHES, toolBudget),
        searchesUsed: used?.searchesUsed ?? 0,
        fetchesUsed: used?.fetchesUsed ?? 0,
    };
}
/** Count success criteria on a project or draft plan. */
export function countCriteria(questions) {
    return questions.reduce((sum, question) => sum + question.criteria.length, 0);
}
/** Validate a submitted plan against depth limits. Throws a RangeError when oversized. */
export function assertPlanFitsDepth(depth, questions, config) {
    const limits = planLimits(depth, config);
    if (questions.length === 0)
        throw new TypeError('deepresearch: plan must contain at least one question');
    if (questions.length > limits.maxQuestions) {
        throw new RangeError(`depth "${depth}" allows at most ${limits.maxQuestions} sub-questions; got ${questions.length}. Resubmit a smaller plan that fits this depth.`);
    }
    for (const [index, question] of questions.entries()) {
        if (question.criteria.length === 0)
            throw new TypeError(`deepresearch: questions[${index}] requires criteria`);
        if (question.criteria.length > limits.maxCriteriaPerQuestion) {
            throw new RangeError(`depth "${depth}" allows at most ${limits.maxCriteriaPerQuestion} success criteria per sub-question; question ${index + 1} has ${question.criteria.length}. Resubmit with fewer criteria.`);
        }
    }
}
/** True when a plan-size error should bounce the planner instead of failing the run. */
export function isOversizedPlanError(error) {
    return error instanceof RangeError && String(error.message).includes('allows at most');
}
/** Session budget for a stored project, preserving used counts. */
export function budgetForProject(project) {
    return planResearchBudget(countCriteria(project.questions), project.budget);
}
//# sourceMappingURL=budget.js.map