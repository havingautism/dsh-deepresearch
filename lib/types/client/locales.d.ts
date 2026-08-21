/**
 * `deepresearch` namespace dictionaries (view copy + slot tab label).
 *
 * Mirrors the locale pattern of `@deepseek-ai/dsh-client-ui-trajectory`
 * (`src/client/locales.ts`): the key set is declared once as
 * `DeepResearchKey`, both dictionaries are typed `Record<DeepResearchKey,
 * string>`, and the namespace is merged into `LocaleNamespaceMap` so
 * registering `locale: NS` puts the typed `t` seat on the component props.
 */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "deepresearch";
/** The deep-research dictionary key set (the source of truth for both locales). */
export type DeepResearchKey = 'view.deepResearch' | 'library.title' | 'library.projectCount' | 'library.filterAria' | 'filter.all' | 'filter.planning' | 'filter.investigating' | 'filter.done' | 'toolbar.search' | 'toolbar.searchAria' | 'toolbar.sortAria' | 'toolbar.sortRecent' | 'toolbar.sortTitle' | 'toolbar.gridView' | 'toolbar.listView' | 'action.start' | 'action.startShort' | 'action.cancel' | 'action.creating' | 'action.createPlan' | 'action.saveChanges' | 'action.confirmStart' | 'action.savePartial' | 'action.complete' | 'empty.none' | 'empty.noMatch' | 'empty.hintStart' | 'empty.hintNoMatch' | 'card.openAria' | 'card.evidence' | 'composer.title' | 'composer.subtitle' | 'composer.closeAria' | 'composer.question' | 'composer.required' | 'composer.questionPlaceholder' | 'composer.context' | 'composer.contextCount' | 'composer.contextHint' | 'composer.goal' | 'composer.goalPlaceholder' | 'composer.depth' | 'depth.quick' | 'depth.standard' | 'depth.deep' | 'composer.constraints' | 'composer.constraintsPlaceholder' | 'composer.seed' | 'composer.seedPlaceholder' | 'composer.footer' | 'workspace.back' | 'workspace.delete' | 'stepper.plan' | 'stepper.investigate' | 'stepper.report' | 'plan.title' | 'plan.subtitle' | 'plan.confirmed' | 'plan.goal' | 'plan.constraints' | 'plan.criteria' | 'metric.subQuestions' | 'metric.evidence' | 'metric.searchBudget' | 'metric.fetchBudget' | 'investigate.title' | 'investigate.subtitle' | 'investigate.stop' | 'investigate.stopReason' | 'investigate.dependsOn' | 'evidence.title' | 'evidence.empty' | 'evidence.open' | 'report.title' | 'report.subtitle' | 'report.placeholder' | 'report.limitations' | 'report.limitationsPlaceholder' | 'planTemplate.define' | 'planTemplate.defineCriteria' | 'planTemplate.search' | 'planTemplate.searchCriteria' | 'planTemplate.crossValidate' | 'planTemplate.crossValidateCriteria' | 'planTemplate.synthesize' | 'planTemplate.synthesizeCriteria' | 'phase.planning' | 'phase.awaitingPlanConfirm' | 'phase.investigating' | 'phase.readyForReport' | 'phase.incomplete' | 'phase.writing' | 'phase.done' | 'phase.failed' | 'phase.aborted' | 'status.pending' | 'status.running' | 'status.covered' | 'status.partial' | 'status.blocked' | 'status.failed';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The deep research view copy. */
        'deepresearch': DeepResearchKey;
    }
}
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: Record<DeepResearchKey, string>;
/** English dictionary. */
export declare const en: Record<DeepResearchKey, string>;
//# sourceMappingURL=locales.d.ts.map