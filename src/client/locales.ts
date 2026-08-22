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
export const NS = 'deepresearch'

/** The deep-research dictionary key set (the source of truth for both locales). */
export type DeepResearchKey =
  // view / tab
  | 'view.deepResearch'
  // library
  | 'library.title'
  | 'library.projectCount'
  | 'library.filterAria'
  | 'filter.all'
  | 'filter.planning'
  | 'filter.investigating'
  | 'filter.done'
  // toolbar
  | 'toolbar.search'
  | 'toolbar.searchAria'
  | 'toolbar.sortAria'
  | 'toolbar.sortRecent'
  | 'toolbar.sortTitle'
  | 'toolbar.gridView'
  | 'toolbar.listView'
  // actions
  | 'action.start'
  | 'action.startShort'
  | 'action.cancel'
  | 'action.creating'
  | 'action.createPlan'
  | 'action.saveChanges'
  | 'action.confirmStart'
  | 'action.savePartial'
  | 'action.complete'
  // empty states
  | 'empty.none'
  | 'empty.noMatch'
  | 'empty.hintStart'
  | 'empty.hintNoMatch'
  // project card
  | 'card.openAria'
  | 'card.evidence'
  // composer
  | 'composer.title'
  | 'composer.subtitle'
  | 'composer.closeAria'
  | 'composer.question'
  | 'composer.required'
  | 'composer.questionPlaceholder'
  | 'composer.context'
  | 'composer.contextCount'
  | 'composer.contextHint'
  | 'composer.goal'
  | 'composer.goalPlaceholder'
  | 'composer.depth'
  | 'depth.quick'
  | 'depth.standard'
  | 'depth.deep'
  | 'composer.constraints'
  | 'composer.constraintsPlaceholder'
  | 'composer.seed'
  | 'composer.seedPlaceholder'
  | 'composer.footer'
  // workspace
  | 'workspace.back'
  | 'workspace.delete'
  | 'stepper.plan'
  | 'stepper.investigate'
  | 'stepper.report'
  // plan
  | 'plan.title'
  | 'plan.subtitle'
  | 'plan.confirmed'
  | 'plan.goal'
  | 'plan.constraints'
  | 'plan.criteria'
  // metrics
  | 'metric.subQuestions'
  | 'metric.evidence'
  | 'metric.searchBudget'
  | 'metric.fetchBudget'
  // investigate
  | 'investigate.title'
  | 'investigate.subtitle'
  | 'investigate.running'
  | 'investigate.stop'
  | 'investigate.stopReason'
  | 'investigate.dependsOn'
  // evidence
  | 'evidence.title'
  | 'evidence.empty'
  | 'evidence.open'
  // report
  | 'report.title'
  | 'report.subtitle'
  | 'report.placeholder'
  | 'report.limitations'
  | 'report.limitationsPlaceholder'
  | 'report.writing'
  | 'report.empty'
  // default plan template
  | 'planTemplate.define'
  | 'planTemplate.defineCriteria'
  | 'planTemplate.search'
  | 'planTemplate.searchCriteria'
  | 'planTemplate.crossValidate'
  | 'planTemplate.crossValidateCriteria'
  | 'planTemplate.synthesize'
  | 'planTemplate.synthesizeCriteria'
  // phase labels
  | 'phase.planning'
  | 'phase.awaitingPlanConfirm'
  | 'phase.investigating'
  | 'phase.readyForReport'
  | 'phase.incomplete'
  | 'phase.writing'
  | 'phase.done'
  | 'phase.failed'
  | 'phase.aborted'
  // status labels
  | 'status.pending'
  | 'status.running'
  | 'status.covered'
  | 'status.partial'
  | 'status.blocked'
  | 'status.failed'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The deep research view copy. */
    'deepresearch': DeepResearchKey
  }
}

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh: Record<DeepResearchKey, string> = {
  'view.deepResearch': '深度研究',
  'library.title': '研究资料库',
  'library.projectCount': '{count} 个研究项目',
  'library.filterAria': '研究状态筛选',
  'filter.all': '全部',
  'filter.planning': '计划中',
  'filter.investigating': '调查中',
  'filter.done': '已完成',
  'toolbar.search': '搜索研究',
  'toolbar.searchAria': '搜索研究',
  'toolbar.sortAria': '研究排序',
  'toolbar.sortRecent': '最近更新',
  'toolbar.sortTitle': '按标题',
  'toolbar.gridView': '网格视图',
  'toolbar.listView': '列表视图',
  'action.start': '发起研究',
  'action.startShort': '发起研究',
  'action.cancel': '取消',
  'action.creating': '创建中…',
  'action.createPlan': '创建研究计划',
  'action.saveChanges': '保存修改',
  'action.confirmStart': '确认并开始',
  'action.savePartial': '保存为部分完成',
  'action.complete': '完成研究',
  'empty.none': '还没有研究项目',
  'empty.noMatch': '没有匹配的研究项目',
  'empty.hintStart': '从一个值得深入的问题开始。',
  'empty.hintNoMatch': '试试其他关键词或清除搜索条件。',
  'card.openAria': '打开研究：{title}',
  'card.evidence': '{count} 条证据 · {date}',
  'composer.title': '发起深度研究',
  'composer.subtitle': '描述问题，先生成一份可审查、可修改的研究计划。',
  'composer.closeAria': '关闭',
  'composer.question': '研究问题',
  'composer.required': '必填',
  'composer.questionPlaceholder': '你想深入研究什么？',
  'composer.context': '添加研究背景',
  'composer.contextCount': ' · {count}',
  'composer.contextHint': '目标、深度、限制和已有材料',
  'composer.goal': '研究目标',
  'composer.goalPlaceholder': '希望最终得到什么',
  'composer.depth': '研究深度',
  'depth.quick': '快速',
  'depth.standard': '标准',
  'depth.deep': '深入',
  'composer.constraints': '限制与要求',
  'composer.constraintsPlaceholder': '时间、地域、来源或输出约束',
  'composer.seed': '已有材料',
  'composer.seedPlaceholder': '粘贴已有笔记或摘录（可选）',
  'composer.footer': '计划 → 调查 → 报告',
  'workspace.back': '深度研究',
  'workspace.delete': '删除',
  'stepper.plan': '1 计划',
  'stepper.investigate': '2 调查',
  'stepper.report': '3 报告',
  'plan.title': '研究计划',
  'plan.subtitle': '确认后，模型按子问题和验收标准组合 Web / subagent 调查。',
  'plan.confirmed': '已确认',
  'plan.goal': '研究目标',
  'plan.constraints': '约束',
  'plan.criteria': '子问题与验收标准',
  'metric.subQuestions': '子问题',
  'metric.evidence': '证据',
  'metric.searchBudget': '检索预算',
  'metric.fetchBudget': '抓取预算',
  'investigate.title': '调查看板',
  'investigate.subtitle': '覆盖度来自模型对已保存证据的显式审查。',
  'investigate.running': '后台研究 Agent 正在调查；本页会自动刷新进度。',
  'investigate.stop': '停止调查',
  'investigate.stopReason': '用户停止了调查。',
  'investigate.dependsOn': '依赖 {count} 个上游问题',
  'evidence.title': '来源证据',
  'evidence.empty': '后台研究 Agent 正在检索来源；保存证据后会自动显示在这里。',
  'evidence.open': '打开来源',
  'report.title': '综合报告',
  'report.subtitle': '比较证据、引用来源，并明确写出仍未解决的限制。',
  'report.placeholder': 'Markdown 研究报告…',
  'report.limitations': '限制与未解决问题',
  'report.limitationsPlaceholder': '每行一项限制',
  'report.writing': '后台研究 Agent 正在整理证据并撰写报告…',
  'report.empty': '报告尚未生成。',
  'planTemplate.define': '界定核心问题：{question}',
  'planTemplate.defineCriteria': '明确回答范围、关键概念和判定标准',
  'planTemplate.search': '检索并筛选权威来源',
  'planTemplate.searchCriteria': '至少获得两个相互独立且可追溯的来源',
  'planTemplate.crossValidate': '交叉验证关键结论',
  'planTemplate.crossValidateCriteria': '识别一致结论、冲突信息和证据缺口',
  'planTemplate.synthesize': '综合证据并形成报告',
  'planTemplate.synthesizeCriteria': '引用来源并说明限制与不确定性',
  'phase.planning': '计划中',
  'phase.awaitingPlanConfirm': '待确认',
  'phase.investigating': '调查中',
  'phase.readyForReport': '可写报告',
  'phase.incomplete': '部分完成',
  'phase.writing': '撰写中',
  'phase.done': '已完成',
  'phase.failed': '失败',
  'phase.aborted': '已停止',
  'status.pending': '待处理',
  'status.running': '调查中',
  'status.covered': '已覆盖',
  'status.partial': '部分覆盖',
  'status.blocked': '受阻',
  'status.failed': '失败',
}

/** English dictionary. */
export const en: Record<DeepResearchKey, string> = {
  'view.deepResearch': 'Deep Research',
  'library.title': 'Research Library',
  'library.projectCount': '{count} research projects',
  'library.filterAria': 'Filter by research status',
  'filter.all': 'All',
  'filter.planning': 'Planning',
  'filter.investigating': 'Investigating',
  'filter.done': 'Done',
  'toolbar.search': 'Search research',
  'toolbar.searchAria': 'Search research',
  'toolbar.sortAria': 'Sort research',
  'toolbar.sortRecent': 'Recently updated',
  'toolbar.sortTitle': 'By title',
  'toolbar.gridView': 'Grid view',
  'toolbar.listView': 'List view',
  'action.start': 'Start research',
  'action.startShort': 'Start research',
  'action.cancel': 'Cancel',
  'action.creating': 'Creating…',
  'action.createPlan': 'Create research plan',
  'action.saveChanges': 'Save changes',
  'action.confirmStart': 'Confirm & start',
  'action.savePartial': 'Save as partially complete',
  'action.complete': 'Complete research',
  'empty.none': 'No research projects yet',
  'empty.noMatch': 'No matching research projects',
  'empty.hintStart': 'Start with a question worth digging into.',
  'empty.hintNoMatch': 'Try different keywords or clear the search.',
  'card.openAria': 'Open research: {title}',
  'card.evidence': '{count} evidence · {date}',
  'composer.title': 'Start Deep Research',
  'composer.subtitle': 'Describe the question; a reviewable, editable research plan is generated first.',
  'composer.closeAria': 'Close',
  'composer.question': 'Research question',
  'composer.required': 'required',
  'composer.questionPlaceholder': 'What would you like to research in depth?',
  'composer.context': 'Add research context',
  'composer.contextCount': ' · {count}',
  'composer.contextHint': 'Goal, depth, constraints, and existing material',
  'composer.goal': 'Research goal',
  'composer.goalPlaceholder': 'What you want to end up with',
  'composer.depth': 'Research depth',
  'depth.quick': 'Quick',
  'depth.standard': 'Standard',
  'depth.deep': 'Deep',
  'composer.constraints': 'Constraints & requirements',
  'composer.constraintsPlaceholder': 'Time, region, source, or output constraints',
  'composer.seed': 'Existing material',
  'composer.seedPlaceholder': 'Paste existing notes or excerpts (optional)',
  'composer.footer': 'Plan → Investigate → Report',
  'workspace.back': 'Deep Research',
  'workspace.delete': 'Delete',
  'stepper.plan': '1 Plan',
  'stepper.investigate': '2 Investigate',
  'stepper.report': '3 Report',
  'plan.title': 'Research plan',
  'plan.subtitle': 'Once confirmed, the model combines Web / subagent investigation per sub-question and acceptance criteria.',
  'plan.confirmed': 'Confirmed',
  'plan.goal': 'Research goal',
  'plan.constraints': 'Constraints',
  'plan.criteria': 'Sub-questions & acceptance criteria',
  'metric.subQuestions': 'Sub-questions',
  'metric.evidence': 'Evidence',
  'metric.searchBudget': 'Search budget',
  'metric.fetchBudget': 'Fetch budget',
  'investigate.title': 'Investigation board',
  'investigate.subtitle': "Coverage comes from the model's explicit review of saved evidence.",
  'investigate.running': 'The background research agent is investigating. This page refreshes automatically.',
  'investigate.stop': 'Stop investigation',
  'investigate.stopReason': 'The user stopped the investigation.',
  'investigate.dependsOn': 'Depends on {count} upstream question(s)',
  'evidence.title': 'Source evidence',
  'evidence.empty': 'The background research agent is finding sources. Saved evidence appears here automatically.',
  'evidence.open': 'Open source',
  'report.title': 'Synthesis report',
  'report.subtitle': 'Compare evidence, cite sources, and explicitly note unresolved limitations.',
  'report.placeholder': 'Markdown research report…',
  'report.limitations': 'Limitations & open questions',
  'report.limitationsPlaceholder': 'One limitation per line',
  'report.writing': 'The background research agent is synthesizing evidence and writing the report…',
  'report.empty': 'No report has been generated yet.',
  'planTemplate.define': 'Define the core question: {question}',
  'planTemplate.defineCriteria': 'Clarify the answer scope, key concepts, and success criteria',
  'planTemplate.search': 'Search and filter authoritative sources',
  'planTemplate.searchCriteria': 'Obtain at least two independent, traceable sources',
  'planTemplate.crossValidate': 'Cross-validate key conclusions',
  'planTemplate.crossValidateCriteria': 'Identify consistent conclusions, conflicting information, and evidence gaps',
  'planTemplate.synthesize': 'Synthesize evidence and produce a report',
  'planTemplate.synthesizeCriteria': 'Cite sources and state limitations and uncertainty',
  'phase.planning': 'Planning',
  'phase.awaitingPlanConfirm': 'Awaiting confirmation',
  'phase.investigating': 'Investigating',
  'phase.readyForReport': 'Report ready',
  'phase.incomplete': 'Partially complete',
  'phase.writing': 'Writing',
  'phase.done': 'Done',
  'phase.failed': 'Failed',
  'phase.aborted': 'Stopped',
  'status.pending': 'Pending',
  'status.running': 'Investigating',
  'status.covered': 'Covered',
  'status.partial': 'Partially covered',
  'status.blocked': 'Blocked',
  'status.failed': 'Failed',
}
