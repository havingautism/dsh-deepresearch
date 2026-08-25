/** Codemini-aligned Deep Research library, plan review, and live investigation workspace. */

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { IconCheckOutline14 as IconCheck, IconChevronDownOutline14 as IconChevronDown, IconChevronLeftOutline14 as IconArrowLeft, IconChevronUpOutline14 as IconChevronUp, IconCloseOutline16 as IconX, IconDataOutline16 as IconLayoutGrid, IconGoalOutline16 as IconTarget, IconListPenOutline16 as IconList, IconLoadingOutline16 as IconLoading, IconPlusOutline16 as IconPlus, IconRightUpOutline14 as IconExternalLink, IconSparkle16 as IconBolt, MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import { ResearchId, type ResearchCoverageStatus, type ResearchDepth, type ResearchPhase, type ResearchProject, type ResearchStartRequest, type ResearchVerification } from '../types.ts'
import type { ResearchViewApi } from './view-types.ts'
import { hydrateResearchProject } from './project-hydrate.ts'
import type { DeepResearchKey } from './locales.ts'
import css from './views.module.css'

type PhaseFilter = 'all' | 'planning' | 'investigating' | 'done'
type Translate = (key: DeepResearchKey, params?: Record<string, unknown>) => string
type EditableQuestion = ResearchStartRequest['questions'][number]
type ResearchQuestionView = ResearchProject['questions'][number]
type ResearchEvidenceView = ResearchProject['evidence'][number]
type ResearchScoutView = ResearchProject['progress']['scouts'][number]
type QuestionIndex = ReadonlyMap<ResearchQuestionView['id'], number>
type PendingDelete = { id: ResearchProject['id']; title: string }

/** Props for the global Deep Research workspace surface. */
type ResearchViewProps = ResearchViewApi & {
  t: Translate
  projectId?: string | null
  onSelectProject?: (id: string | null) => void
  onClose?: () => void
}

/** Render the research library, reviewable plan, live investigation board, and report. */
export function ResearchView({ t, projectId, onSelectProject, onClose, ...api }: ResearchViewProps) {
  const [projects, setProjects] = useState<readonly ResearchProject[]>([])
  const [selected, setSelected] = useState<ResearchProject | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PhaseFilter>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<'recent' | 'title'>('recent')
  const [composerOpen, setComposerOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [projectLoading, setProjectLoading] = useState(false)

  const openProject = useCallback((project: ResearchProject | null) => {
    setSelected(project === null ? null : hydrateResearchProject(project))
    onSelectProject?.(project?.id ?? null)
  }, [onSelectProject])

  const apiRef = useRef(api)
  apiRef.current = api
  const refresh = useCallback(async (nextQuery: string) => {
    setError(null)
    try {
      const next = (await apiRef.current.list(nextQuery)).map(hydrateResearchProject)
      setProjects(next)
      setSelected(current => {
        if (current === null) return null
        const listed = next.find((item: ResearchProject) => item.id === current.id)
        return listed !== undefined && listed.updatedAt > current.updatedAt ? listed : current
      })
    } catch (cause) {
      setError(messageOf(cause))
    }
  }, [])
  useEffect(() => {
    if (selected !== null) return
    const timer = window.setTimeout(() => { void refresh(query) }, query === '' ? 0 : 250)
    return () => { window.clearTimeout(timer) }
  }, [query, refresh, selected])
  useEffect(() => {
    if (projectId === undefined) return
    if (projectId === null) { setSelected(null); setProjectLoading(false); return }
    const listed = projects.find(item => item.id === projectId)
    if (listed !== undefined) {
      setSelected(current => current?.id === listed.id && current.updatedAt >= listed.updatedAt ? current : hydrateResearchProject(listed))
      setProjectLoading(false)
      return
    }
    let active = true
    setProjectLoading(true)
    void apiRef.current.get(ResearchId(projectId)).then(project => {
      if (!active) return
      if (project === null) {
        setSelected(null)
        setError(t('empty.noMatch'))
      } else {
        setSelected(hydrateResearchProject(project))
      }
      setProjectLoading(false)
    }, (cause: unknown) => {
      if (active) {
        setError(messageOf(cause))
        setProjectLoading(false)
      }
    })
    return () => { active = false }
  }, [projectId, projects, t])

  const requestDelete = useCallback((target: PendingDelete) => { setError(null); setPendingDelete(target) }, [])
  const confirmDelete = useCallback(async () => {
    if (pendingDelete === null || deleteBusy) return
    setDeleteBusy(true)
    setError(null)
    try {
      await api.delete(pendingDelete.id)
      if (selected?.id === pendingDelete.id) openProject(null)
      setPendingDelete(null)
      await refresh(query)
    } catch (cause) {
      setError(messageOf(cause))
    } finally {
      setDeleteBusy(false)
    }
  }, [api, deleteBusy, openProject, pendingDelete, query, refresh, selected?.id])

  const visible = useMemo(() => {
    const phaseMatch = (phase: ResearchPhase) => filter === 'all' || filter === 'planning' && ['planning', 'awaiting_plan_confirm'].includes(phase) || filter === 'investigating' && ['investigating', 'ready_for_report', 'writing'].includes(phase) || filter === 'done' && ['done', 'incomplete'].includes(phase)
    const filtered = projects.filter(project => phaseMatch(project.phase))
    return sort === 'title' ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt)
  }, [filter, projects, sort])

  const updateSelected = useCallback((project: ResearchProject) => {
    const next = hydrateResearchProject(project)
    setSelected(current => current?.id === next.id && current.updatedAt === next.updatedAt ? current : next)
    setProjects(current => current.map(item => item.id === next.id ? next : item))
  }, [])
  if (projectId !== undefined && projectId !== null && selected === null && projectLoading) {
    return <div className={css.shell}><div className={css.content}><div className={css.projectLoading} role="status"><IconLoading className={css.spinner} size={16} /><span>{t('phase.planning')}</span></div></div></div>
  }
  if (selected !== null) return <div className={css.shell}>
    <ResearchWorkspace project={selected} api={api} t={t} onChange={updateSelected} onBack={() => { openProject(null) }} onDelete={() => { requestDelete({ id: selected.id, title: selected.title }) }} error={error} setError={setError} />
    {pendingDelete === null ? null : <DeleteConfirmDialog pending={pendingDelete} busy={deleteBusy} t={t} onCancel={() => { if (!deleteBusy) setPendingDelete(null) }} onConfirm={() => { void confirmDelete() }} />}
  </div>

  const filters: ReadonlyArray<readonly [PhaseFilter, DeepResearchKey]> = [['all', 'filter.all'], ['planning', 'filter.planning'], ['investigating', 'filter.investigating'], ['done', 'filter.done']]
  return <div className={css.shell}><div className={css.content}>
    <span data-deepresearch-view="" hidden />
    {onClose === undefined ? null : (
      <div className={css.libraryTopBar}>
        <button className={css.backButton} type="button" aria-label={t('library.backAria')} onClick={onClose}>
          <IconArrowLeft size={15} />
          {t('library.back')}
        </button>
      </div>
    )}
    <div className={css.toolbar}><div className={css.filters} aria-label={t('library.filterAria')}>{filters.map(([id, key]) => <button key={id} className={filter === id ? css.activeChip : css.chip} type="button" aria-current={filter === id ? 'page' : undefined} onClick={() => { setFilter(id) }}>{t(key)}</button>)}</div><div className={css.toolbarActions}><input className={css.search} value={query} onChange={event => { setQuery(event.target.value) }} placeholder={t('toolbar.search')} aria-label={t('toolbar.searchAria')} /><select className={css.select} value={sort} onChange={event => { setSort(event.target.value as 'recent' | 'title') }} aria-label={t('toolbar.sortAria')}><option value="recent">{t('toolbar.sortRecent')}</option><option value="title">{t('toolbar.sortTitle')}</option></select><div className={css.viewToggle}><button className={css.iconButton} type="button" aria-label={t('toolbar.gridView')} aria-pressed={viewMode === 'grid'} data-active={viewMode === 'grid'} onClick={() => { setViewMode('grid') }}><IconLayoutGrid size={16} /></button><button className={css.iconButton} type="button" aria-label={t('toolbar.listView')} aria-pressed={viewMode === 'list'} data-active={viewMode === 'list'} onClick={() => { setViewMode('list') }}><IconList size={16} /></button></div><button className={css.primaryButton} type="button" onClick={() => { setError(null); setComposerOpen(true) }}><IconPlus size={15} />{t('action.start')}</button></div></div>
    <section className={css.library}><header className={css.libraryTitle}><div><h2>{t('library.title')}</h2><p>{t('library.projectCount', { count: visible.length })}</p></div></header>
      {error === null || composerOpen ? null : <div className={css.error} role="alert">{error}</div>}
      {visible.length === 0 ? <div className={css.emptyState}><span aria-hidden="true"><IconBolt size={22} /></span><strong>{query === '' ? t('empty.none') : t('empty.noMatch')}</strong><p>{query === '' ? t('empty.hintStart') : t('empty.hintNoMatch')}</p>{query === '' ? <button className={css.primaryButton} type="button" onClick={() => { setComposerOpen(true) }}><IconPlus size={15} />{t('action.start')}</button> : null}</div> : <div className={viewMode === 'grid' ? css.projectGrid : css.projectList}>{viewMode === 'grid' ? <button className={css.createCard} type="button" onClick={() => { setComposerOpen(true) }}><span><IconPlus size={22} /></span><strong>{t('action.startShort')}</strong></button> : null}{visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} list={viewMode === 'list'} t={t} onOpen={() => { openProject(project) }} onDelete={() => { requestDelete({ id: project.id, title: project.title }) }} />)}</div>}
    </section>
  </div>{composerOpen ? <ResearchComposer busy={busy} error={error} setBusy={setBusy} t={t} onClose={() => { if (!busy) setComposerOpen(false) }} onCreate={async request => { const project = await api.start(request); setComposerOpen(false); await refresh(query); openProject(project) }} setError={setError} /> : null}{pendingDelete === null ? null : <DeleteConfirmDialog pending={pendingDelete} busy={deleteBusy} t={t} onCancel={() => { if (!deleteBusy) setPendingDelete(null) }} onConfirm={() => { void confirmDelete() }} />}</div>
}

function ProjectCard({ project, index, list, t, onOpen, onDelete }: { project: ResearchProject; index: number; list: boolean; t: Translate; onOpen: () => void; onDelete: () => void }) { const [emoji, title] = splitEmoji(project.title); return <article className={css.projectCard} data-list={list || undefined} style={{ '--card-tint': CARD_TONES[index % CARD_TONES.length] } as React.CSSProperties}><button className={css.cardOpen} type="button" onClick={onOpen} aria-label={t('card.openAria', { title: project.title })} /><div className={css.cardEmoji}>{emoji || <IconBolt size={25} />}</div><div className={css.cardInfo}><h3>{title}</h3><p>{project.goal || project.question}</p><div><span className={css.phase} data-phase={project.runState === 'paused' ? 'aborted' : project.phase}>{phaseLabel(project, t)}</span><span>{t('card.evidence', { count: project.evidence.length, date: formatDate(project.updatedAt) })}</span></div></div><button className={css.deleteButton} type="button" aria-label={t('workspace.delete')} onClick={event => { event.stopPropagation(); onDelete() }}><IconX size={15} /></button></article> }

function ResearchComposer({ busy, error, setBusy, t, onClose, onCreate, setError }: { busy: boolean; error: string | null; setBusy: (value: boolean) => void; t: Translate; onClose: () => void; onCreate: (request: ResearchStartRequest) => Promise<void>; setError: (value: string | null) => void }) {
  const [question, setQuestion] = useState(''); const [goal, setGoal] = useState(''); const [constraints, setConstraints] = useState(''); const [seedText, setSeedText] = useState(''); const [depth, setDepth] = useState<ResearchDepth>('standard'); const [contextOpen, setContextOpen] = useState(false)
  const contextCount = [goal, constraints, seedText].filter(value => value.trim() !== '').length
  const submit = (event: FormEvent) => { event.preventDefault(); const trimmed = question.trim(); if (busy || trimmed === '') return; setBusy(true); setError(null); void onCreate({ question: trimmed, goal: goal.trim(), constraints: constraints.trim(), seedText: seedText.trim(), depth, questions: [] }).catch((cause: unknown) => { setError(messageOf(cause)) }).finally(() => { setBusy(false) }) }
  return <div className={css.modalBackdrop} role="presentation"><form className={css.modal} role="dialog" aria-modal="true" aria-labelledby="new-research-title" onSubmit={submit}><div className={css.modalHeader}><div className={css.modalHeading}><span aria-hidden="true"><IconBolt size={18} /></span><div><h3 id="new-research-title">{t('composer.title')}</h3><p>{t('composer.subtitle')}</p></div></div><button className={css.modalCloseButton} type="button" aria-label={t('composer.closeAria')} disabled={busy} onClick={onClose}><IconX size={16} /></button></div><div className={css.modalBody}><label className={css.fieldLabel}><span>{t('composer.question')} <b>{t('composer.required')}</b></span><textarea autoFocus className={css.questionInput} value={question} onChange={event => { setQuestion(event.target.value) }} placeholder={t('composer.questionPlaceholder')} /></label><div className={css.contextCard}><button type="button" aria-expanded={contextOpen} onClick={() => { setContextOpen(value => !value) }}><span><IconTarget size={15} /></span><span><strong>{t('composer.context')}{contextCount === 0 ? '' : t('composer.contextCount', { count: contextCount })}</strong><small>{t('composer.contextHint')}</small></span><b>{contextOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}</b></button>{contextOpen ? <div className={css.contextFields}><label>{t('composer.goal')}<input className={css.input} value={goal} onChange={event => { setGoal(event.target.value) }} placeholder={t('composer.goalPlaceholder')} /></label><label>{t('composer.depth')}<select className={css.input} value={depth} onChange={event => { setDepth(event.target.value as ResearchDepth) }}><option value="quick">{t('depth.quick')}</option><option value="standard">{t('depth.standard')}</option><option value="deep">{t('depth.deep')}</option></select></label><label>{t('composer.constraints')}<textarea className={css.textareaSmall} value={constraints} onChange={event => { setConstraints(event.target.value) }} placeholder={t('composer.constraintsPlaceholder')} /></label><label>{t('composer.seed')}<textarea className={css.textareaSmall} value={seedText} onChange={event => { setSeedText(event.target.value) }} placeholder={t('composer.seedPlaceholder')} /></label></div> : null}</div>{error === null ? null : <div className={css.modalError} role="alert">{error}</div>}</div><div className={css.modalFooter}><span>{t('composer.footer')}</span><div><button className={css.modalCancelButton} type="button" disabled={busy} onClick={onClose}>{t('action.cancel')}</button><button className={css.modalSubmitButton} type="submit" disabled={busy || question.trim() === ''}>{busy ? <IconLoading className={css.spinner} size={14} /> : <IconBolt size={14} />}{busy ? t('action.creating') : t('action.createPlan')}</button></div></div></form></div>
}

function DeleteConfirmDialog({ pending, busy, t, onCancel, onConfirm }: { pending: PendingDelete; busy: boolean; t: Translate; onCancel: () => void; onConfirm: () => void }) {
  const [, title] = splitEmoji(pending.title)
  const name = title || pending.title
  return <div className={css.confirmBackdrop} role="presentation" onClick={() => { if (!busy) onCancel() }}>
    <div className={css.confirmCard} role="dialog" aria-modal="true" aria-labelledby="delete-research-title" onClick={event => { event.stopPropagation() }}>
      <span className={css.confirmMark} aria-hidden="true" />
      <h3 id="delete-research-title">{t('delete.title')}</h3>
      <p>{t('delete.body', { title: name })}</p>
      <div className={css.confirmActions}>
        <button className={css.confirmCancel} type="button" disabled={busy} onClick={onCancel}>{t('action.cancel')}</button>
        <button className={css.confirmDelete} type="button" disabled={busy} onClick={onConfirm}>{busy ? <IconLoading className={css.spinner} size={14} /> : null}{t('delete.confirm')}</button>
      </div>
    </div>
  </div>
}

type ResearchStep = 'plan' | 'investigate' | 'report'

function ResearchWorkspace({ project, api, t, onChange, onBack, onDelete, error, setError }: { project: ResearchProject; api: ResearchViewApi; t: Translate; onChange: (project: ResearchProject) => void; onBack: () => void; onDelete: () => void; error: string | null; setError: (value: string | null) => void }) {
  const [focus, setFocus] = useState<ResearchStep>(stepFor(project))
  const [goal, setGoal] = useState(project.goal)
  const [questions, setQuestions] = useState<EditableQuestion[]>(() => editablePlan(project))
  const [busy, setBusy] = useState(false)

  const prevPhase = useRef(project.phase)
  useEffect(() => {
    setGoal(project.goal)
    setQuestions(editablePlan(project))
    const from = prevPhase.current
    prevPhase.current = project.phase
    setFocus(current => {
      const target = stepFor(project)
      if (from !== project.phase && target === 'investigate' && current === 'plan') return 'investigate'
      if (from !== project.phase && target === 'report' && current !== 'report') return 'report'
      return reachableStep(project, current) ? current : target
    })
  }, [project.phase, project.goal, project.id, project.updatedAt])

  const seenUpdatedAt = useRef(project.updatedAt)
  seenUpdatedAt.current = project.updatedAt
  const applyLatest = useCallback((latest: ResearchProject) => {
    if (latest.id !== project.id || latest.updatedAt === seenUpdatedAt.current) return
    onChange(latest)
  }, [onChange, project.id])
  useEffect(() => {
    let active = true
    const unsubscribe = api.subscribeProgress(latest => {
      if (active) applyLatest(latest)
    })
    return () => { active = false; unsubscribe() }
  }, [api.subscribeProgress, applyLatest])
  useEffect(() => {
    if (project.runState !== 'running') return
    let active = true
    let inFlight = false
    const sync = () => {
      if (!active || inFlight) return
      inFlight = true
      void api.get(project.id).then(latest => {
        if (active && latest !== null) applyLatest(latest)
      }).finally(() => { inFlight = false })
    }
    sync()
    const timer = window.setInterval(sync, 2500)
    return () => { active = false; window.clearInterval(timer) }
  }, [api, applyLatest, project.id, project.runState])

  const run = useCallback(async (operation: () => Promise<ResearchProject>) => {
    setBusy(true)
    setError(null)
    try { onChange(await operation()) } catch (cause) { setError(messageOf(cause)) } finally { setBusy(false) }
  }, [onChange, setError])

  // Constraints are collected once in the composer context and are never edited here.
  const planRequest = useCallback(() => ({
    id: project.id,
    goal: goal.trim(),
    constraints: project.constraints,
    depth: project.depth,
    questions: questions
      .map(question => ({ ...question, text: question.text.trim(), criteria: question.criteria.map(item => item.trim()).filter(Boolean) }))
      .filter(question => question.text !== '' && question.criteria.length > 0),
  }), [goal, project.constraints, project.depth, project.id, questions])

  const savePlan = useCallback(() => { void run(() => api.updatePlan(planRequest())) }, [api, planRequest, run])
  const confirmAndStart = useCallback(async () => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const saved = await api.updatePlan(planRequest())
      onChange(await api.confirmPlan(saved.id))
      setFocus('investigate')
    } catch (cause) {
      setError(messageOf(cause))
    } finally {
      setBusy(false)
    }
  }, [api, busy, onChange, planRequest, setError])

  const running = project.runState === 'running'
  const paused = project.runState === 'paused'
  const canContinue = paused && ['planning', 'investigating', 'incomplete', 'writing', 'aborted', 'failed'].includes(project.phase)
  const canWrite = project.planConfirmed && !running && ['ready_for_report', 'writing', 'done', 'incomplete', 'investigating'].includes(project.phase)
  const stopRun = useCallback(() => { void run(() => api.fail(project.id, t('investigate.stopReason'), true)) }, [api, project.id, run, t])
  const resumeRun = useCallback(() => { void run(() => api.resume(project.id)) }, [api, project.id, run])
  const rewriteReport = useCallback(() => {
    void run(async () => {
      const next = await api.writeReport(project.id)
      setFocus('report')
      return next
    })
  }, [api, project.id, run])

  const activeStep = reachableStep(project, focus) ? focus : stepFor(project)
  const steps: ReadonlyArray<readonly [ResearchStep, DeepResearchKey]> = [['plan', 'stepper.plan'], ['investigate', 'stepper.investigate'], ['report', 'stepper.report']]
  return <div className={css.workspace}>
    <header className={css.workspaceHeader}>
      <button className={css.backButton} type="button" onClick={onBack}><IconArrowLeft size={15} />{t('workspace.back')}</button>
      <div className={css.projectHeading}><p className={css.eyebrow}>RESEARCH PROJECT</p><h2>{project.title}</h2></div>
      <div className={css.headerActions}>
        <span className={css.phase} data-phase={paused ? 'aborted' : project.phase}>{phaseLabel(project, t)}</span>
        {running ? <button className={css.stopButton} type="button" disabled={busy} onClick={stopRun}>{t('investigate.stop')}</button> : null}
        {canContinue ? <button className={css.secondaryButton} type="button" disabled={busy} onClick={resumeRun}>{project.planConfirmed ? t('investigate.continue') : t('plan.retry')}</button> : null}
        {canWrite && (project.phase === 'ready_for_report' || project.phase === 'writing' || project.phase === 'done' || project.phase === 'incomplete') ? <button className={css.primaryButton} type="button" disabled={busy} onClick={rewriteReport}>{project.report ? t('report.retry') : t('investigate.writeReport')}</button> : null}
        <button className={css.deleteText} type="button" onClick={onDelete}>{t('workspace.delete')}</button>
      </div>
    </header>
    <div className={css.progressBar}><nav className={css.stepper}>{steps.map(([id, key]) => {
      const reachable = reachableStep(project, id)
      return <button key={id} type="button" disabled={!reachable} data-active={activeStep === id} onClick={() => { setFocus(id) }}>{t(key)}</button>
    })}</nav></div>
    {error === null ? null : <div className={css.error}>{error}</div>}
    <div className={css.detailBody}>
    <span data-deepresearch-view="" hidden />
      {activeStep !== 'plan' ? null : <PlanStep project={project} t={t} busy={busy} goal={goal} setGoal={setGoal} questions={questions} setQuestions={setQuestions} onSave={savePlan} onConfirm={() => { void confirmAndStart() }} onRetry={resumeRun} />}
      {activeStep !== 'investigate' ? null : <InvestigatePane project={project} t={t} busy={busy} onStop={stopRun} onContinue={resumeRun} onWrite={rewriteReport} />}
      {activeStep !== 'report' ? null : <ReportPane project={project} t={t} busy={busy} onRewrite={rewriteReport} />}
    </div>
  </div>
}

/** Plan step: waiting shell, planner failure, or the reviewable plan itself. */
function PlanStep({ project, t, busy, goal, setGoal, questions, setQuestions, onSave, onConfirm, onRetry }: { project: ResearchProject; t: Translate; busy: boolean; goal: string; setGoal: (value: string) => void; questions: EditableQuestion[]; setQuestions: React.Dispatch<React.SetStateAction<EditableQuestion[]>>; onSave: () => void; onConfirm: () => void; onRetry: () => void }) {
  if (project.phase === 'planning' && project.questions.length === 0) {
    const stopped = project.runState !== 'running'
    return <section className={css.planPane}>
      <div className={css.planningState}>
        <span className={css.planningIcon} aria-hidden="true">{stopped ? <IconTarget size={22} /> : <IconLoading className={css.spinner} size={22} />}</span>
        <div>
          <h3>{stopped ? t('plan.stopped') : t('phase.planning')}</h3>
          <p>{stopped ? t('plan.stoppedHint') : t('plan.subtitle')}</p>
          {stopped ? <button className={css.primaryButton} type="button" disabled={busy} onClick={onRetry}>{t('plan.retry')}</button> : null}
        </div>
      </div>
    </section>
  }
  if (project.phase === 'failed' && !project.planConfirmed && project.questions.length === 0) {
    return <section className={css.planPane}>
      <div className={css.planFailure} role="alert">
        <h3>{t('plan.failedTitle')}</h3>
        <p>{t('plan.failedHint')}</p>
        {project.limitations.map(item => <code key={item}>{item}</code>)}
      </div>
    </section>
  }

  const locked = project.planConfirmed || busy
  const updateQuestion = (index: number, patch: Partial<EditableQuestion>) => {
    setQuestions(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item))
  }
  return <section className={css.planPane}>
    <div className={css.sectionHeader}>
      <div>
        <p className={css.planEyebrow}>{t('plan.title')}</p>
        <h3 className={css.planQuestionTitle}>{project.question}</h3>
        <p>{t('plan.subtitle')}</p>
      </div>
      <div className={css.headerActions}>
        <span className={css.planDepth}>{`${t('composer.depth')} · ${depthLabel(project.depth, t)}`}</span>
        {project.planConfirmed
          ? <span className={css.confirmed}><IconCheck size={13} />{t('plan.confirmed')}</span>
          : <>
            <button className={css.secondaryButton} type="button" disabled={busy} onClick={onSave}>{t('action.saveChanges')}</button>
            <button className={css.primaryButton} type="button" disabled={busy || questions.length === 0} onClick={onConfirm}>{t('action.confirmStart')}</button>
          </>}
      </div>
    </div>
    <label className={css.goalBlock}>
      <span>{t('plan.goal')}</span>
      <textarea value={goal} disabled={locked} onChange={event => { setGoal(event.target.value) }} />
    </label>
    <div className={css.planList}>
      <span className={css.planListLabel}>{t('plan.criteria')}</span>
      {questions.map((question, index) => {
        const criteria = question.criteria.filter(item => item.trim() !== '')
        const deps = question.dependsOn ?? []
        return <section className={css.planQuestion} key={`${project.id}-${index}`}>
          <span>{ordinal(index)}</span>
          <div>
            {project.planConfirmed
              ? <h4>{question.text}</h4>
              : <textarea value={question.text} disabled={busy} onChange={event => { updateQuestion(index, { text: event.target.value }) }} />}
            {project.planConfirmed
              ? <ul className={css.criteriaList}>{criteria.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{item}</li>)}</ul>
              : <label>{t('plan.criteria')}<textarea value={question.criteria.join('\n')} disabled={busy} onChange={event => { updateQuestion(index, { criteria: event.target.value.split('\n') }) }} /></label>}
            {deps.length === 0 ? null : <div className={css.depBlock}>
              <span className={css.depLabel}>{t('plan.dependsOn')}</span>
              <div className={css.depChips}>
                {deps.map(dep => <span className={css.depChip} key={`${index}-${dep}`}>{t('plan.dependsOnChip', { label: formatDepLabel(dep, questions[dep]?.text ?? '') })}</span>)}
              </div>
              <small className={css.depHint}>{t('plan.dependsOnHint')}</small>
            </div>}
          </div>
        </section>
      })}
    </div>
  </section>
}

/** Investigate step: timeline first, then questions + limitations, then evidence. */
function InvestigatePane({ project, t, busy, onStop, onContinue, onWrite }: { project: ResearchProject; t: Translate; busy: boolean; onStop: () => void; onContinue: () => void; onWrite: () => void }) {
  const indexOf = useMemo<QuestionIndex>(() => new Map(project.questions.map((question, index) => [question.id, index])), [project.questions])
  const scouts = useMemo(() => boardScouts(project), [project])
  const scoutOf = useMemo(() => new Map(scouts.map(scout => [scout.questionId, scout])), [scouts])
  const settledQuestions = project.questions.filter(item => isSettledQuestion(item.status)).length
  const settledScouts = scouts.filter(item => item.status === 'done' || item.status === 'partial' || item.status === 'blocked').length
  const accepted = project.evidence.filter(item => item.status !== 'candidate' && item.status !== 'rejected').length
  const limitations = boardLimitations(project, t, project.phase === 'investigating')

  return <section className={css.investigatePane}>
    <header className={css.questionHeader}>
      <span>{t('composer.question')}</span>
      <h3>{project.question}</h3>
      {project.goal === '' ? null : <p>{project.goal}</p>}
    </header>
    {project.phase === 'investigating' && project.runState === 'running' ? <div className={css.runningBanner} role="status"><IconLoading className={css.spinner} size={16} /><span>{t('investigate.running')}</span><button className={css.stopButton} type="button" disabled={busy} onClick={onStop}>{t('investigate.stop')}</button></div> : null}
    {project.runState === 'paused' && ['investigating', 'incomplete', 'writing', 'aborted'].includes(project.phase) ? <div className={css.pausedBanner} role="status"><IconTarget size={15} /><div><strong>{t('phase.aborted')}</strong><p>{t('investigate.pausedHint')}</p></div><div className={css.bannerActions}><button className={css.secondaryButton} type="button" disabled={busy} onClick={onContinue}>{t('investigate.continue')}</button>{project.questions.every(item => isSettledQuestion(item.status)) ? <button className={css.primaryButton} type="button" disabled={busy} onClick={onWrite}>{t('investigate.writeReport')}</button> : null}</div></div> : null}
    {project.phase === 'ready_for_report' && project.runState !== 'running' ? <div className={css.readyBanner} role="status"><IconCheck size={15} /><div><strong>{t('investigate.readyTitle')}</strong><p>{t('investigate.readyHint')}</p></div><button className={css.primaryButton} type="button" disabled={busy} onClick={onWrite}>{t('investigate.writeReport')}</button></div> : null}
    {project.phase === 'incomplete' && project.runState !== 'paused' ? <div className={css.incompleteBanner} role="status"><IconTarget size={15} /><div><strong>{t('investigate.incompleteTitle')}</strong><p>{t('investigate.incompleteHint')}</p></div></div> : null}
    <div className={css.metrics}>
      <Metric label={t('metric.subQuestions')} value={`${settledQuestions}/${project.questions.length}`} />
      <Metric label={t('metric.evidence')} value={String(accepted)} />
      <Metric label={t('investigate.scouts')} value={`${settledScouts}/${scouts.length}`} />
    </div>
    <section className={css.timeline}>
      <div className={css.sectionHeader}><div><h3>{t('investigate.title')}</h3><p>{t('investigate.subtitle')}</p></div></div>
      {scouts.map(scout => <ScoutCard key={scout.questionId} project={project} scout={scout} indexOf={indexOf} t={t} />)}
    </section>
    <div className={css.boardGrid}>
      <div className={css.questions}>
        <h4 className={css.boardHeading}>{t('investigate.questions')} <span>{project.questions.length}</span></h4>
        {project.questions.map((question, index) => <QuestionCard key={question.id} project={project} question={question} index={index} indexOf={indexOf} scout={scoutOf.get(question.id)} t={t} />)}
      </div>
      <LimitationsBoard items={limitations} t={t} always />
    </div>
    <section className={css.evidencePane}>
      <h4 className={css.boardHeading}>{t('evidence.title')} <span>{project.evidence.length}</span></h4>
      {project.evidence.length === 0
        ? <div className={css.evidenceEmpty}><span><IconTarget size={17} /></span><p>{t('evidence.empty')}</p></div>
        : <div className={css.evidenceGrid}>{project.evidence.map(item => <EvidenceCard key={item.id} evidence={item} t={t} />)}</div>}
    </section>
  </section>
}

function QuestionCard({ project, question, index, indexOf, scout, t }: { project: ResearchProject; question: ResearchQuestionView; index: number; indexOf: QuestionIndex; scout: ResearchScoutView | undefined; t: Translate }) {
  const deps = resolveIndexes(question.dependsOn, indexOf)
  const waiting = resolveIndexes(scout?.waitingOn ?? [], indexOf)
  const gaps = question.gaps ?? []
  const label = (at: number) => formatDepLabel(at, project.questions[at]?.text ?? '')
  const waitingOnDeps = waiting.length > 0
  const queued = !waitingOnDeps && scout?.status === 'waiting'
  return <article className={css.questionCard} data-status={waitingOnDeps ? 'waiting' : question.status} data-live={question.status === 'running' || undefined}>
    <div className={css.questionTitle}>
      <span>{ordinal(index)}</span>
      <div>
        <h4>{question.text}</h4>
        {deps.length === 0 ? null : <div className={css.depChips}>
          {deps.map(at => <span className={css.depChip} key={at}>{t('plan.dependsOnChip', { label: label(at) })}</span>)}
        </div>}
        {waiting.length === 0 ? null : <p className={css.waitingLine}>{t('investigate.waitingOn', { list: waiting.map(label).join('、') })}</p>}
        {gaps.length === 0 ? null : <p className={css.gapLine}>{`${t('investigate.gaps')}: ${gaps.join(' · ')}`}</p>}
      </div>
      <strong data-status={waitingOnDeps ? 'waiting' : queued ? 'pending' : question.status}>{waitingOnDeps ? t('investigate.waitingStatus') : queued ? t('investigate.queued') : statusLabel(question.status, t)}</strong>
    </div>
  </article>
}

function ScoutCard({ project, scout, indexOf, t }: { project: ResearchProject; scout: ResearchScoutView; indexOf: QuestionIndex; t: Translate }) {
  const at = indexOf.get(scout.questionId)
  const question = at === undefined ? undefined : project.questions[at]
  const title = question?.text ?? String(scout.questionId)
  const waiting = scout.status === 'waiting'
  const verifying = scout.status === 'verifying' || scout.role === 'evaluator'
  const live = scout.status === 'running' || verifying
  const failed = scout.status === 'blocked'
  const partial = scout.status === 'partial'
  const accepted = project.evidence.filter(item => item.questionId === scout.questionId && item.status !== 'candidate' && item.status !== 'rejected')
  const activity = scout.activity.trim() !== ''
    ? scout.activity
    : verifying
      ? t('investigate.evaluating')
      : waiting
        ? (scout.waitingOn.length > 0 ? t('investigate.waitingOn', { list: resolveIndexes(scout.waitingOn, indexOf).map(item => formatDepLabel(item, project.questions[item]?.text ?? '')).join('、') }) : t('investigate.queuedHint'))
        : live
          ? (scout.activeCriterionText || t('investigate.running'))
          : ''
  const scoutDraft = readableDraft(scout.scoutDraft)
  const evaluatorDraft = readableDraft(scout.evaluatorDraft)
  const criterionLabel = clipLabel(scout.activeCriterionText, 36)
  return <details className={css.scoutCard} data-status={scout.status} data-role={scout.role} data-live={live || undefined} open={live || waiting || failed || undefined}>
    <summary className={css.scoutSummary}>
      <span className={css.scoutIcon} data-status={waiting ? 'waiting' : live ? 'running' : failed || partial ? scout.status : 'done'}>
        {live ? <IconLoading className={css.spinner} size={14} /> : failed || partial ? <IconTarget size={14} /> : waiting ? <IconTarget size={14} /> : <IconCheck size={14} />}
      </span>
      <span className={css.scoutSummaryBody}>
        <strong>{title}</strong>
        <span className={css.scoutMetaRow}>
          <span className={css.scoutChip} data-kind={verifying ? 'verify' : 'role'}>{verifying ? t('investigate.verifying') : t('investigate.scouts')}</span>
          <span className={css.scoutChip}>{t('investigate.toolsUsed', { used: scout.toolsUsed, cap: scout.toolsCap || 10 })}</span>
          <span className={css.scoutChip}>{t('investigate.evidenceCount', { count: accepted.length })}</span>
          {criterionLabel === '' || !live ? null : <span className={css.scoutChip} data-kind="criterion">{criterionLabel}</span>}
        </span>
      </span>
      <span className={css.scoutStatus} data-live={live || undefined}>{scoutStatusLabel(scout, t)}</span>
      <IconChevronDown size={14} />
    </summary>
    <div className={css.scoutBody}>
      {activity === '' ? null : <p className={css.scoutActivity} data-live={live || undefined}>{live ? <IconLoading className={css.spinner} size={12} /> : waiting ? <IconTarget size={12} /> : null}<span>{activity}</span></p>}
      {question === undefined || question.criteria.length === 0 ? null : <CriterionList criteria={question.criteria} scout={scout} t={t} />}
      {(scout.tools ?? []).length === 0 ? null : <ul className={css.toolList}>
        {scout.tools.map((tool, index) => <li key={`${tool.name}-${index}`} data-status={tool.status}><b>{toolLabel(tool.name, t)}</b><span>{tool.detail}</span></li>)}
      </ul>}
      {accepted.length === 0 ? null : <div className={css.scoutEvidence}>
        {accepted.slice(0, 8).map(item => <EvidenceCard key={item.id} evidence={item} t={t} />)}
      </div>}
      {scout.dependencySummary === '' ? null : <details className={css.handoff} open={waiting || undefined}><summary>{t('investigate.dependencySummary')}</summary><pre>{scout.dependencySummary}</pre></details>}
      {scoutDraft === '' ? null : <details className={css.handoff}><summary>{t('investigate.scoutDraft')}</summary><pre>{scoutDraft}</pre></details>}
      {evaluatorDraft === '' ? null : <details className={css.handoff}><summary>{t('investigate.evaluatorDraft')}</summary><pre>{evaluatorDraft}</pre></details>}
      {scout.handoff === '' ? null : <details className={css.handoff}><summary>{t('investigate.handoff')}</summary><pre>{scout.handoff}</pre></details>}
    </div>
  </details>
}

function CriterionList({ criteria, scout, t }: { criteria: ResearchQuestionView['criteria']; scout: ResearchScoutView | undefined; t: Translate }) {
  const live = scout?.status === 'running' || scout?.status === 'verifying'
  const verifying = scout?.status === 'verifying' || scout?.role === 'evaluator'
  const cap = Math.max(1, scout?.toolsCap || 10)
  if (criteria.length === 0) return null
  return <div className={css.coverage}>
    <h5>{t('investigate.coverage')}</h5>
    <ul className={css.coverageList}>
      {criteria.map(criterion => {
        const active = Boolean(live && scout !== undefined && scout.activeCriterionId === criterion.id)
        const used = active && scout !== undefined ? scout.toolsUsed : (criterion.toolCount ?? 0)
        const atCap = used >= cap
        const status = active && verifying ? t('investigate.verifying') : coverageLabel(criterion.status, t)
        const verification = verificationLabel(criterion.verification, t)
        return <li key={criterion.id} className={css.coverageItem} data-status={criterion.status} data-active={active || undefined} data-verify={criterion.verification || undefined}>
          <div className={css.coverageHead}>
            <b>{criterion.text}</b>
            <span>
              {active ? `${t('investigate.activeNow')} · ` : ''}
              {status}
              {verification === '' ? '' : ` · ${verification}`}
              {` · ${t('investigate.toolsUsed', { used, cap })}`}
              {atCap ? ` · ${t('investigate.capReached')}` : ''}
            </span>
          </div>
          {criterion.summary === '' ? null : <p>{`${t('investigate.summary')}: ${criterion.summary}`}</p>}
          {criterion.warning === '' ? null : <em data-tone="warning">{`${t('investigate.warning')}: ${criterion.warning}`}</em>}
          {criterion.gap === '' ? null : <em data-tone="gap">{`${t('investigate.gaps')}: ${criterion.gap}`}</em>}
        </li>
      })}
    </ul>
  </div>
}

function EvidenceCard({ evidence, t }: { evidence: ResearchEvidenceView; t: Translate }) {
  const url = primaryEvidenceUrl(evidence)
  const host = sourceHostname(url)
  return <article className={css.evidenceCard} data-status={evidence.status}>
    <div>
      <span data-confidence={evidence.confidence}>{confidenceLabel(evidence.confidence, t)}</span>
      {host === '' ? null : <span title={url}>{host}</span>}
    </div>
    <p>{evidence.claim}</p>
    {url === '' ? null : <a href={url} target="_blank" rel="noreferrer" title={url}><IconExternalLink size={12} /><span>{host || url}</span></a>}
  </article>
}

function ReportPane({ project, t, busy, onRewrite }: { project: ResearchProject; t: Translate; busy: boolean; onRewrite: () => void }) {
  const accepted = project.evidence.filter(item => item.status !== 'candidate' && item.status !== 'rejected')
  const writing = project.phase === 'writing' && project.runState === 'running'
  return <section className={css.reportPane}>
    <div className={css.sectionHeader}><div><h3>{t('report.title')}</h3><p>{t('report.subtitle')}</p></div>{project.planConfirmed && !writing ? <button className={css.primaryButton} type="button" disabled={busy} onClick={onRewrite}>{project.report ? t('report.retry') : t('investigate.writeReport')}</button> : null}</div>
    {project.report !== null
      ? <article className={css.reportDocument}><MarkdownText text={project.report} streaming={writing} /></article>
      : writing
        ? <div className={css.reportPending} role="status"><IconLoading className={css.spinner} size={16} /><span>{t('report.writing')}</span></div>
        : <div className={css.reportPending}>{t('report.empty')}</div>}
    {accepted.length === 0 ? null : <section className={css.evidencePane}>
      <h4 className={css.boardHeading}>{t('evidence.sourcesTitle')} <span>{accepted.length}</span></h4>
      <div className={css.evidenceGrid}>{accepted.map(item => <EvidenceCard key={item.id} evidence={item} t={t} />)}</div>
    </section>}
  </section>
}

type LimitationView = { key: string; status: ResearchCoverageStatus | ''; ref: string; text: string }

function LimitationsBoard({ items, t, always }: { items: LimitationView[]; t: Translate; always?: boolean }) {
  if (!always && items.length === 0) return null
  return <section className={css.limitationsBoard}>
    <h4>{t('report.limitations')}{items.length === 0 ? null : <span>{items.length}</span>}</h4>
    {items.length === 0
      ? <p className={css.limitationsEmpty}>{t('report.limitationsEmpty')}</p>
      : <ul className={css.limitationList}>
        {items.map(item => <li key={item.key} className={css.limitationItem} data-status={item.status || undefined}>
          <div className={css.limitationHead}>
            {item.ref === '' ? null : <span>{item.ref}</span>}
            {item.status === '' ? null : <b>{coverageLabel(item.status, t)}</b>}
          </div>
          <p>{item.text}</p>
        </li>)}
      </ul>}
  </section>
}

function Metric({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div> }

const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a']

/** Render a dependency reference as `01 · question text`, clipped to `max` characters. */
function formatDepLabel(index: number, text: string, max = 42): string {
  const number = ordinal(index)
  const clipped = clipLabel(text, max)
  return clipped === '' ? number : `${number} · ${clipped}`
}

function clipLabel(text: string, max: number): string {
  const characters = Array.from(text.trim())
  if (characters.length === 0) return ''
  return characters.length > max ? `${characters.slice(0, max - 1).join('')}…` : characters.join('')
}

function readableDraft(text: string): string {
  const value = text.trim()
  if (value === '') return ''
  if (/^(Search|Fetch|Read artifact|Evaluator read)\b/i.test(value)) return ''
  if (value.startsWith('{') || value.startsWith('[')) return ''
  return value
}

function toolLabel(name: string, t: Translate): string {
  if (name === 'research_web_search') return t('investigate.toolSearch')
  if (name === 'research_web_fetch') return t('investigate.toolFetch')
  if (name === 'read_artifact') return t('investigate.toolRead')
  return name
}

function isSettledQuestion(status: ResearchQuestionView['status']): boolean {
  return status === 'covered' || status === 'partial' || status === 'blocked'
}

function limitationFallback(status: ResearchCoverageStatus, t: Translate): string {
  if (status === 'partial') return t('limitation.partialFallback')
  if (status === 'blocked') return t('limitation.blockedFallback')
  if (status === 'conflicted') return t('limitation.conflictedFallback')
  return t('limitation.missingFallback')
}

function boardLimitations(project: ResearchProject, t: Translate, live: boolean): LimitationView[] {
  const rows: LimitationView[] = []
  for (const [index, question] of project.questions.entries()) {
    for (const criterion of question.criteria) {
      if (criterion.status === 'covered') continue
      const note = [criterion.gap, criterion.warning].map(item => item.trim()).filter(Boolean).join(' ')
      if (criterion.status === 'missing' && live && note === '') continue
      const text = note || limitationFallback(criterion.status, t)
      rows.push({
        key: `${question.id}:${criterion.id}`,
        status: criterion.status,
        ref: `${formatDepLabel(index, question.text, 36)} · ${clipLabel(criterion.text, 28)}`,
        text,
      })
    }
  }
  for (const [index, item] of project.limitations.entries()) {
    const text = item.trim()
    if (!text || rows.some(row => row.text === text || text.endsWith(row.text))) continue
    rows.push({ key: `note:${index}:${text}`, status: '', ref: '', text })
  }
  return rows
}

function boardScouts(project: ResearchProject): ResearchScoutView[] {
  const live = new Map((project.progress?.scouts ?? []).map(scout => [scout.questionId, scout]))
  return project.questions.map(question => {
    const existing = live.get(question.id)
    if (existing !== undefined) return existing
    return {
      questionId: question.id,
      role: question.status === 'running' ? 'scout' : 'waiting',
      status: question.status === 'running' ? 'running' : question.status === 'covered' ? 'done' : question.status === 'partial' ? 'partial' : question.status === 'blocked' || question.status === 'failed' ? 'blocked' : 'waiting',
      waitingOn: question.dependsOn ?? [],
      toolsUsed: 0,
      toolsCap: 10,
      activity: '',
      tools: [],
      scoutDraft: '',
      evaluatorDraft: '',
      activeCriterionId: '',
      activeCriterionText: '',
      dependencySummary: '',
      handoff: question.handoff ?? '',
    }
  })
}

function ordinal(index: number): string { return String(index + 1).padStart(2, '0') }
function resolveIndexes(ids: readonly ResearchQuestionView['id'][], indexOf: QuestionIndex): number[] { return ids.flatMap(id => { const at = indexOf.get(id); return at === undefined ? [] : [at] }) }
function editablePlan(project: ResearchProject): EditableQuestion[] { return project.questions.map(question => ({ text: question.text, criteria: question.criteria.map(item => item.text), dependsOn: question.dependsOn.map(id => project.questions.findIndex(candidate => candidate.id === id)).filter(index => index >= 0) })) }
function stepFor(project: ResearchProject): ResearchStep { return ['planning', 'awaiting_plan_confirm'].includes(project.phase) || ['failed', 'aborted'].includes(project.phase) && !project.planConfirmed ? 'plan' : ['writing', 'done'].includes(project.phase) ? 'report' : 'investigate' }
function reachableStep(project: ResearchProject, step: ResearchStep): boolean {
  if (project.planConfirmed && ['done', 'incomplete', 'failed', 'aborted', 'writing', 'ready_for_report'].includes(project.phase)) return true
  const order: ResearchStep[] = ['plan', 'investigate', 'report']
  const unlocked = project.phase === 'ready_for_report' ? 'investigate' : stepFor(project)
  return order.indexOf(step) <= order.indexOf(unlocked)
}
function depthLabel(depth: ResearchDepth, t: Translate): string { return t(({ quick: 'depth.quick', standard: 'depth.standard', deep: 'depth.deep' } as const)[depth]) }
function phaseLabel(project: Pick<ResearchProject, 'phase' | 'runState'>, t: Translate): string {
  if (project.runState === 'paused') return t('phase.aborted')
  return t(({ planning: 'phase.planning', awaiting_plan_confirm: 'phase.awaitingPlanConfirm', investigating: 'phase.investigating', ready_for_report: 'phase.readyForReport', incomplete: 'phase.incomplete', writing: 'phase.writing', done: 'phase.done', failed: 'phase.failed', aborted: 'phase.aborted' } as const)[project.phase])
}
function statusLabel(status: ResearchQuestionView['status'], t: Translate): string { return t(({ pending: 'status.pending', running: 'status.running', covered: 'status.covered', partial: 'status.partial', blocked: 'status.blocked', failed: 'status.failed' } as const)[status]) }
function scoutStatusLabel(scout: ResearchScoutView, t: Translate): string {
  if (scout.status === 'waiting' && scout.waitingOn.length === 0) return t('investigate.queued')
  return t(({ waiting: 'investigate.waitingStatus', running: 'status.running', verifying: 'investigate.verifying', done: 'status.covered', partial: 'status.partial', blocked: 'status.blocked' } as const)[scout.status])
}
function coverageLabel(status: ResearchCoverageStatus, t: Translate): string { return t((`coverage.${status}`) as DeepResearchKey) }
function confidenceLabel(value: ResearchProject['evidence'][number]['confidence'], t: Translate): string {
  return t(value === 'high' ? 'confidence.high' : value === 'low' ? 'confidence.low' : 'confidence.medium')
}
function primaryEvidenceUrl(evidence: ResearchEvidenceView): string {
  const seen = new Set<string>()
  for (const source of evidence.sources ?? []) {
    const url = source.url.trim()
    if (url === '' || seen.has(url)) continue
    seen.add(url)
    return url
  }
  return evidence.url?.trim() ?? ''
}
function sourceHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] ?? ''
  }
}
function verificationLabel(value: ResearchVerification, t: Translate): string { return value === 'PASS' ? t('verify.pass') : value === 'WARNING' ? t('verify.warning') : value === 'FAIL' ? t('verify.fail') : '' }
function splitEmoji(value: string): [string, string] { const first = Array.from(value.trim())[0] ?? ''; return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value] }
function formatDate(value: number): string { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value) }
function messageOf(value: unknown): string { return value instanceof Error ? value.message : String(value) }
