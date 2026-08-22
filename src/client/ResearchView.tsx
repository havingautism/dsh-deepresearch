/** Codemini-aligned Deep Research library and evidence workspace. */

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { IconCheckOutline14 as IconCheck, IconChevronDownOutline14 as IconChevronDown, IconChevronLeftOutline14 as IconArrowLeft, IconChevronUpOutline14 as IconChevronUp, IconCloseOutline16 as IconX, IconDataOutline16 as IconLayoutGrid, IconGoalOutline16 as IconTarget, IconListPenOutline16 as IconList, IconLoadingOutline16 as IconLoading, IconPlusOutline16 as IconPlus, IconQuestionOutline14 as IconCircle, IconRightUpOutline14 as IconExternalLink, IconSparkle16 as IconBolt } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { ResearchDepth, ResearchPhase, ResearchProject, ResearchStartRequest } from '../types.ts'
import type { ResearchViewApi } from './view-types.ts'
import type { DeepResearchKey } from './locales.ts'
import css from './views.module.css'

type PhaseFilter = 'all' | 'planning' | 'investigating' | 'done'

/**
 * Composed props: owner conversation-view share + the registered business
 * face (the research API) + the framework-injected locale `t` seat (declared
 * via `locale: NS` on the slot registration).
 */
type ResearchViewProps = ConvViewProps & InjectFace<ResearchViewApi> & { t: (key: DeepResearchKey, params?: Record<string, unknown>) => string }

/** Render the research library, editable plan, investigation evidence, and report. */
export function ResearchView({ t, ...api }: ResearchViewProps) {
  const [projects, setProjects] = useState<readonly ResearchProject[]>([])
  const [selected, setSelected] = useState<ResearchProject | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PhaseFilter>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<'recent' | 'title'>('recent')
  const [composerOpen, setComposerOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (nextQuery: string) => { setError(null); try { const next = await api.list(nextQuery); setProjects(next); setSelected(current => { if (current === null) return null; const listed = next.find((item: ResearchProject) => item.id === current.id); return listed !== undefined && listed.updatedAt >= current.updatedAt ? listed : current }) } catch (cause) { setError(messageOf(cause)) } }, [api])
  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(query) }, query === '' ? 0 : 250)
    return () => { window.clearTimeout(timer) }
  }, [query, refresh])

  const visible = useMemo(() => {
    const phaseMatch = (phase: ResearchPhase) => filter === 'all' || filter === 'planning' && ['planning', 'awaiting_plan_confirm'].includes(phase) || filter === 'investigating' && ['investigating', 'ready_for_report', 'writing'].includes(phase) || filter === 'done' && ['done', 'incomplete'].includes(phase)
    const filtered = projects.filter(project => phaseMatch(project.phase))
    return sort === 'title' ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt)
  }, [filter, projects, sort])

  const updateSelected = useCallback((project: ResearchProject) => { setSelected(project); setProjects(current => current.map(item => item.id === project.id ? project : item)) }, [])
  if (selected !== null) return <ResearchWorkspace project={selected} api={api} t={t} onChange={updateSelected} onBack={() => { setSelected(null) }} onDelete={async () => { await api.delete(selected.id); setSelected(null); await refresh(query) }} error={error} setError={setError} />

  const filters: ReadonlyArray<readonly [PhaseFilter, DeepResearchKey]> = [['all', 'filter.all'], ['planning', 'filter.planning'], ['investigating', 'filter.investigating'], ['done', 'filter.done']]
  return <div className={css.shell} data-conversation-composer-overlay=""><div className={css.content}>
    <span data-deepresearch-view="" hidden />
    <div className={css.toolbar}><div className={css.filters} aria-label={t('library.filterAria')}>{filters.map(([id, key]) => <button key={id} className={filter === id ? css.activeChip : css.chip} type="button" aria-current={filter === id ? 'page' : undefined} onClick={() => { setFilter(id) }}>{t(key)}</button>)}</div><div className={css.toolbarActions}><input className={css.search} value={query} onChange={event => { setQuery(event.target.value) }} placeholder={t('toolbar.search')} aria-label={t('toolbar.searchAria')} /><select className={css.select} value={sort} onChange={event => { setSort(event.target.value as 'recent' | 'title') }} aria-label={t('toolbar.sortAria')}><option value="recent">{t('toolbar.sortRecent')}</option><option value="title">{t('toolbar.sortTitle')}</option></select><div className={css.viewToggle}><button className={css.iconButton} type="button" aria-label={t('toolbar.gridView')} aria-pressed={viewMode === 'grid'} data-active={viewMode === 'grid'} onClick={() => { setViewMode('grid') }}><IconLayoutGrid size={16} /></button><button className={css.iconButton} type="button" aria-label={t('toolbar.listView')} aria-pressed={viewMode === 'list'} data-active={viewMode === 'list'} onClick={() => { setViewMode('list') }}><IconList size={16} /></button></div><button className={css.primaryButton} type="button" onClick={() => { setError(null); setComposerOpen(true) }}><IconPlus size={15} />{t('action.start')}</button></div></div>
    <section className={css.library}><header className={css.libraryTitle}><div><h2>{t('library.title')}</h2><p>{t('library.projectCount', { count: visible.length })}</p></div></header>
      {error === null || composerOpen ? null : <div className={css.error} role="alert">{error}</div>}
      {visible.length === 0 ? <div className={css.emptyState}><span aria-hidden="true"><IconBolt size={22} /></span><strong>{query === '' ? t('empty.none') : t('empty.noMatch')}</strong><p>{query === '' ? t('empty.hintStart') : t('empty.hintNoMatch')}</p>{query === '' ? <button className={css.primaryButton} type="button" onClick={() => { setComposerOpen(true) }}><IconPlus size={15} />{t('action.start')}</button> : null}</div> : <div className={viewMode === 'grid' ? css.projectGrid : css.projectList}>{viewMode === 'grid' ? <button className={css.createCard} type="button" onClick={() => { setComposerOpen(true) }}><span><IconPlus size={22} /></span><strong>{t('action.startShort')}</strong></button> : null}{visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} list={viewMode === 'list'} t={t} onOpen={() => { setSelected(project) }} onDelete={() => { void api.delete(project.id).then(() => refresh(query), (cause: unknown) => { setError(messageOf(cause)) }) }} />)}</div>}
    </section>
  </div>{composerOpen ? <ResearchComposer busy={busy} error={error} setBusy={setBusy} t={t} onClose={() => { if (!busy) setComposerOpen(false) }} onCreate={async request => { const project = await api.start(request); setComposerOpen(false); await refresh(query); setSelected(project) }} setError={setError} /> : null}</div>
}

function ProjectCard({ project, index, list, t, onOpen, onDelete }: { project: ResearchProject; index: number; list: boolean; t: ResearchViewProps['t']; onOpen: () => void; onDelete: () => void }) { const [emoji, title] = splitEmoji(project.title); return <article className={css.projectCard} data-list={list || undefined} style={{ '--card-tint': CARD_TONES[index % CARD_TONES.length] } as React.CSSProperties}><button className={css.cardOpen} type="button" onClick={onOpen} aria-label={t('card.openAria', { title: project.title })} /><div className={css.cardEmoji}>{emoji || <IconBolt size={25} />}</div><div className={css.cardInfo}><h3>{title}</h3><p>{project.goal || project.question}</p><div><span className={css.phase} data-phase={project.phase}>{phaseLabel(project.phase, t)}</span><span>{t('card.evidence', { count: project.evidence.length, date: formatDate(project.updatedAt) })}</span></div></div><button className={css.deleteButton} type="button" aria-label={t('workspace.delete')} onClick={event => { event.stopPropagation(); onDelete() }}><IconX size={15} /></button></article> }

function ResearchComposer({ busy, error, setBusy, t, onClose, onCreate, setError }: { busy: boolean; error: string | null; setBusy: (value: boolean) => void; t: ResearchViewProps['t']; onClose: () => void; onCreate: (request: ResearchStartRequest) => Promise<void>; setError: (value: string | null) => void }) {
  const [question, setQuestion] = useState(''); const [goal, setGoal] = useState(''); const [constraints, setConstraints] = useState(''); const [seedText, setSeedText] = useState(''); const [depth, setDepth] = useState<ResearchDepth>('standard'); const [contextOpen, setContextOpen] = useState(false)
  const contextCount = [goal, constraints, seedText].filter(value => value.trim() !== '').length
  const submit = (event: FormEvent) => { event.preventDefault(); const trimmed = question.trim(); if (busy || trimmed === '') return; setBusy(true); setError(null); void onCreate({ question: trimmed, goal: goal.trim(), constraints: constraints.trim(), seedText: seedText.trim(), depth, questions: [] }).catch(cause => { setError(messageOf(cause)) }).finally(() => { setBusy(false) }) }
  return <div className={css.modalBackdrop} role="presentation"><form className={css.modal} role="dialog" aria-modal="true" aria-labelledby="new-research-title" onSubmit={submit}><div className={css.modalHeader}><div className={css.modalHeading}><span aria-hidden="true"><IconBolt size={18} /></span><div><h3 id="new-research-title">{t('composer.title')}</h3><p>{t('composer.subtitle')}</p></div></div><button className={css.modalCloseButton} type="button" aria-label={t('composer.closeAria')} disabled={busy} onClick={onClose}><IconX size={16} /></button></div><div className={css.modalBody}><label className={css.fieldLabel}><span>{t('composer.question')} <b>{t('composer.required')}</b></span><textarea autoFocus className={css.questionInput} value={question} onChange={event => { setQuestion(event.target.value) }} placeholder={t('composer.questionPlaceholder')} /></label><div className={css.contextCard}><button type="button" aria-expanded={contextOpen} onClick={() => { setContextOpen(value => !value) }}><span><IconTarget size={15} /></span><span><strong>{t('composer.context')}{contextCount === 0 ? '' : t('composer.contextCount', { count: contextCount })}</strong><small>{t('composer.contextHint')}</small></span><b>{contextOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}</b></button>{contextOpen ? <div className={css.contextFields}><label>{t('composer.goal')}<input className={css.input} value={goal} onChange={event => { setGoal(event.target.value) }} placeholder={t('composer.goalPlaceholder')} /></label><label>{t('composer.depth')}<select className={css.input} value={depth} onChange={event => { setDepth(event.target.value as ResearchDepth) }}><option value="quick">{t('depth.quick')}</option><option value="standard">{t('depth.standard')}</option><option value="deep">{t('depth.deep')}</option></select></label><label>{t('composer.constraints')}<textarea className={css.textareaSmall} value={constraints} onChange={event => { setConstraints(event.target.value) }} placeholder={t('composer.constraintsPlaceholder')} /></label><label>{t('composer.seed')}<textarea className={css.textareaSmall} value={seedText} onChange={event => { setSeedText(event.target.value) }} placeholder={t('composer.seedPlaceholder')} /></label></div> : null}</div>{error === null ? null : <div className={css.modalError} role="alert">{error}</div>}</div><div className={css.modalFooter}><span>{t('composer.footer')}</span><div><button className={css.modalCancelButton} type="button" disabled={busy} onClick={onClose}>{t('action.cancel')}</button><button className={css.modalSubmitButton} type="submit" disabled={busy || question.trim() === ''}>{busy ? <IconLoading className={css.spinner} size={14} /> : <IconBolt size={14} />}{busy ? t('action.creating') : t('action.createPlan')}</button></div></div></form></div>
}

type ResearchStep = 'plan' | 'investigate' | 'report'

function ResearchWorkspace({ project, api, t, onChange, onBack, onDelete, error, setError }: { project: ResearchProject; api: ResearchViewApi; t: ResearchViewProps['t']; onChange: (project: ResearchProject) => void; onBack: () => void; onDelete: () => Promise<void>; error: string | null; setError: (value: string | null) => void }) {
  const [focus, setFocus] = useState<ResearchStep>(stepFor(project.phase)); const [goal, setGoal] = useState(project.goal); const [constraints, setConstraints] = useState(project.constraints); const [questions, setQuestions] = useState<ResearchStartRequest['questions']>(() => editablePlan(project)); const [busy, setBusy] = useState(false)
  useEffect(() => { setFocus(stepFor(project.phase)); setGoal(project.goal); setConstraints(project.constraints); setQuestions(editablePlan(project)) }, [project])
  useEffect(() => {
    if (!['planning', 'investigating', 'ready_for_report', 'writing'].includes(project.phase)) return
    let active = true
    const refresh = async () => {
      try {
        const latest = await api.get(project.id)
        if (active && latest !== null && latest.updatedAt !== project.updatedAt) onChange(latest)
      } catch (cause) {
        if (active) setError(messageOf(cause))
      }
    }
    const timer = window.setInterval(() => { void refresh() }, 750)
    void refresh()
    return () => { active = false; window.clearInterval(timer) }
  }, [api.get, onChange, project.id, project.phase, project.updatedAt, setError])
  const action = async (operation: () => Promise<ResearchProject>) => { setBusy(true); setError(null); try { onChange(await operation()) } catch (cause) { setError(messageOf(cause)) } finally { setBusy(false) } }
  const planRequest = () => ({ id: project.id, goal, constraints, depth: project.depth, questions: questions.map(question => ({ ...question, text: question.text.trim(), criteria: question.criteria.map(item => item.trim()).filter(Boolean) })).filter(question => question.text !== '' && question.criteria.length > 0) })
  const savePlan = () => { void action(() => api.updatePlan(planRequest())) }
  const confirmAndStart = async () => {
    if (busy) return
    setBusy(true); setError(null)
    try {
      const saved = await api.updatePlan(planRequest())
      onChange(await api.confirmPlan(saved.id))
    } catch (cause) {
      setError(messageOf(cause))
    } finally {
      setBusy(false)
    }
  }
  const activeStep = reachableStep(project.phase, focus) ? focus : stepFor(project.phase)
  return <div className={css.workspace} data-conversation-composer-overlay=""><header className={css.workspaceHeader}><button className={css.backButton} type="button" onClick={onBack}><IconArrowLeft size={15} />{t('workspace.back')}</button><div className={css.projectHeading}><p className={css.eyebrow}>RESEARCH PROJECT</p><h2>{project.title}</h2></div><div className={css.headerActions}><span className={css.phase} data-phase={project.phase}>{phaseLabel(project.phase, t)}</span><button className={css.deleteText} type="button" onClick={() => { void onDelete() }}>{t('workspace.delete')}</button></div></header><div className={css.progressBar}><nav className={css.stepper}>{([['plan', 'stepper.plan'], ['investigate', 'stepper.investigate'], ['report', 'stepper.report']] as const).map(([id, key]) => { const reachable = reachableStep(project.phase, id); return <button key={id} type="button" disabled={!reachable} data-active={activeStep === id} onClick={() => { setFocus(id) }}>{t(key)}</button> })}</nav></div>{error === null ? null : <div className={css.error}>{error}</div>}<div className={css.detailBody}>
    <span data-deepresearch-view="" hidden />
    {activeStep === 'plan' ? project.phase === 'planning' && project.questions.length === 0 ? <section className={css.planPane}><div className={css.planningState}><span className={css.planningIcon} aria-hidden="true"><IconLoading className={css.spinner} size={22} /></span><div><h3>{t('phase.planning')}</h3><p>{t('plan.subtitle')}</p></div></div></section> : <section className={css.planPane}><div className={css.sectionHeader}><div><h3>{t('plan.title')}</h3><p>{t('plan.subtitle')}</p></div><div className={css.headerActions}>{project.planConfirmed ? <span className={css.confirmed}><IconCheck size={13} />{t('plan.confirmed')}</span> : <><button className={css.secondaryButton} type="button" disabled={busy} onClick={savePlan}>{t('action.saveChanges')}</button><button className={css.primaryButton} type="button" disabled={busy || questions.length === 0} onClick={() => { void confirmAndStart() }}>{t('action.confirmStart')}</button></>}</div></div><div className={css.formGrid}><label>{t('plan.goal')}<textarea value={goal} onChange={event => { setGoal(event.target.value) }} disabled={project.planConfirmed || busy} /></label><label>{t('plan.constraints')}<textarea value={constraints} onChange={event => { setConstraints(event.target.value) }} disabled={project.planConfirmed || busy} /></label></div><div className={css.planList}><span className={css.planListLabel}>{t('plan.criteria')}</span>{questions.map((question, index) => <section className={css.planQuestion} key={`${project.id}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><div><textarea value={question.text} disabled={project.planConfirmed || busy} onChange={event => { const text = event.target.value; setQuestions(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, text } : item)) }} /><label>{t('plan.criteria')}<textarea value={question.criteria.join('\n')} disabled={project.planConfirmed || busy} onChange={event => { const criteria = event.target.value.split('\n'); setQuestions(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, criteria } : item)) }} /></label>{question.dependsOn?.length ? <small>{t('investigate.dependsOn', { count: question.dependsOn.length })}</small> : null}</div></section>)}</div></section> : null}
    {activeStep === 'investigate' ? <section className={css.investigatePane}>
      <header className={css.questionHeader}><span>{t('composer.question')}</span><h3>{project.question}</h3>{project.goal ? <p>{project.goal}</p> : null}</header>
      {project.phase === 'investigating' ? <div className={css.runningBanner} role="status"><IconLoading className={css.spinner} size={14} /><span>{t('investigate.running')}</span></div> : null}
      <div className={css.metrics}><Metric label={t('metric.subQuestions')} value={`${project.questions.filter(q => ['covered', 'partial', 'blocked'].includes(q.status)).length}/${project.questions.length}`} /><Metric label={t('metric.evidence')} value={String(project.evidence.length)} /><Metric label={t('metric.searchBudget')} value={`${project.budget.searchesUsed}/${project.budget.maxSearches}`} /><Metric label={t('metric.fetchBudget')} value={`${project.budget.fetchesUsed}/${project.budget.maxFetches}`} /></div>
      <div className={css.sectionHeader}><div><h3>{t('investigate.title')}</h3><p>{t('investigate.subtitle')}</p></div>{project.phase === 'investigating' ? <button className={css.stopButton} type="button" disabled={busy} onClick={() => { void action(() => api.fail(project.id, t('investigate.stopReason'), true)) }}>{t('investigate.stop')}</button> : null}</div>
      <div className={css.boardGrid}><div className={css.questions}>{project.questions.map((question, index) => <article className={css.questionCard} key={question.id}><div className={css.questionTitle}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{question.text}</h4><strong data-status={question.status}>{statusLabel(question.status, t)}</strong></div></div>{question.dependsOn.length > 0 ? <p>{t('investigate.dependsOn', { count: question.dependsOn.length })}</p> : null}<ul>{question.criteria.map(criterion => <li key={criterion.id} data-status={criterion.status}><span>{criterion.status === 'covered' ? <IconCheck size={13} /> : <IconCircle size={12} />}</span><div><b>{criterion.text}</b>{criterion.summary ? <p>{criterion.summary}</p> : null}{criterion.gap ? <em>{criterion.gap}</em> : null}</div></li>)}</ul></article>)}</div><aside className={css.evidencePane}><h3>{t('evidence.title')} <span>{project.evidence.length}</span></h3>{project.evidence.length === 0 ? <div className={css.evidenceEmpty}><span><IconTarget size={17} /></span><p>{t('evidence.empty')}</p></div> : project.evidence.map(item => <article className={css.evidenceCard} key={item.id}><div><strong>{item.source}</strong><span data-confidence={item.confidence}>{item.confidence}</span></div><p>{item.claim}</p>{item.snippet ? <blockquote>{item.snippet}</blockquote> : null}{item.url === null ? null : <a href={item.url} target="_blank" rel="noreferrer">{t('evidence.open')}<IconExternalLink size={12} /></a>}</article>)}</aside></div>
    </section> : null}
    {activeStep === 'report' ? <section className={css.reportPane}><div className={css.sectionHeader}><div><h3>{t('report.title')}</h3><p>{t('report.subtitle')}</p></div></div>{project.report ? <article className={css.reportDocument}>{project.report}</article> : project.phase === 'writing' ? <div className={css.reportPending} role="status"><IconLoading className={css.spinner} size={16} /><span>{t('report.writing')}</span></div> : <div className={css.reportPending}>{t('report.empty')}</div>}{project.limitations.length > 0 ? <section className={css.reportLimitations}><h4>{t('report.limitations')}</h4><ul>{project.limitations.map(item => <li key={item}>{item}</li>)}</ul></section> : null}</section> : null}
  </div></div>
}

function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div> }
const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a']
function editablePlan(project: ResearchProject): ResearchStartRequest['questions'] { return project.questions.map(question => ({ text: question.text, criteria: question.criteria.map(item => item.text), dependsOn: question.dependsOn.map(id => project.questions.findIndex(candidate => candidate.id === id)).filter(index => index >= 0) })) }
function stepFor(phase: ResearchPhase): ResearchStep { return ['planning', 'awaiting_plan_confirm'].includes(phase) ? 'plan' : ['writing', 'done'].includes(phase) ? 'report' : 'investigate' }
function reachableStep(phase: ResearchPhase, step: ResearchStep): boolean { const order: ResearchStep[] = ['plan', 'investigate', 'report']; const unlocked = phase === 'ready_for_report' ? 'investigate' : stepFor(phase); return order.indexOf(step) <= order.indexOf(unlocked) }
function phaseLabel(phase: ResearchPhase, t: ResearchViewProps['t']): string { return t(({ planning: 'phase.planning', awaiting_plan_confirm: 'phase.awaitingPlanConfirm', investigating: 'phase.investigating', ready_for_report: 'phase.readyForReport', incomplete: 'phase.incomplete', writing: 'phase.writing', done: 'phase.done', failed: 'phase.failed', aborted: 'phase.aborted' } as const)[phase]) }
function statusLabel(status: ResearchProject['questions'][number]['status'], t: ResearchViewProps['t']): string { return t(({ pending: 'status.pending', running: 'status.running', covered: 'status.covered', partial: 'status.partial', blocked: 'status.blocked', failed: 'status.failed' } as const)[status]) }
function splitEmoji(value: string): [string, string] { const first = Array.from(value.trim())[0] ?? ''; return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value] }
function formatDate(value: number): string { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value) }
function messageOf(value: unknown): string { return value instanceof Error ? value.message : String(value) }
