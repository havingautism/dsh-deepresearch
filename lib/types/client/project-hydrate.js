/** Fill fields the stale Remote codec may strip so the workspace never reads undefined. */
const emptyProgress = { running: 0, waiting: 0, scouts: [] };
/** Normalize one wire project after Remote parse. */
export function hydrateResearchProject(project) {
    const progress = project.progress;
    return {
        ...project,
        runState: project.runState ?? (['planning', 'investigating', 'writing'].includes(project.phase) ? 'running' : 'idle'),
        questions: (project.questions ?? []).map(question => ({
            ...question,
            dependsOn: question.dependsOn ?? [],
            gaps: question.gaps ?? [],
            handoff: question.handoff ?? '',
            criteria: (question.criteria ?? []).map(criterion => ({
                ...criterion,
                warning: criterion.warning ?? '',
                verification: criterion.verification ?? '',
                toolCount: criterion.toolCount ?? 0,
            })),
        })),
        evidence: (project.evidence ?? []).map(item => ({
            ...item,
            criterionIds: item.criterionIds ?? [],
            sources: item.sources ?? [],
            status: item.status ?? 'accepted',
        })),
        conclusions: project.conclusions ?? [],
        limitations: project.limitations ?? [],
        progress: {
            running: progress?.running ?? 0,
            waiting: progress?.waiting ?? 0,
            scouts: (progress?.scouts ?? emptyProgress.scouts).map(scout => ({
                questionId: scout.questionId,
                role: scout.role ?? 'waiting',
                status: scout.status ?? 'waiting',
                waitingOn: scout.waitingOn ?? [],
                toolsUsed: scout.toolsUsed ?? 0,
                toolsCap: scout.toolsCap ?? 0,
                activity: scout.activity ?? '',
                tools: scout.tools ?? [],
                scoutDraft: scout.scoutDraft ?? '',
                evaluatorDraft: scout.evaluatorDraft ?? '',
                activeCriterionId: scout.activeCriterionId ?? '',
                activeCriterionText: scout.activeCriterionText ?? '',
                dependencySummary: scout.dependencySummary ?? '',
                handoff: scout.handoff ?? '',
            })),
        },
    };
}
//# sourceMappingURL=project-hydrate.js.map