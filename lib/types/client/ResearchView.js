import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Codemini-aligned Deep Research library, plan review, and live investigation workspace. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconCheckOutline14 as IconCheck, IconChevronDownOutline14 as IconChevronDown, IconChevronLeftOutline14 as IconArrowLeft, IconChevronUpOutline14 as IconChevronUp, IconCloseOutline16 as IconX, IconDataOutline16 as IconLayoutGrid, IconGoalOutline16 as IconTarget, IconListPenOutline16 as IconList, IconLoadingOutline16 as IconLoading, IconPlusOutline16 as IconPlus, IconRightUpOutline14 as IconExternalLink, IconSparkle16 as IconBolt, MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives';
import { ResearchId } from "../types.js";
import { hydrateResearchProject } from "./project-hydrate.js";
import css from './views.module.css';
/** Render the research library, reviewable plan, live investigation board, and report. */
export function ResearchView({ t, projectId, onSelectProject, onClose, ...api }) {
    const [projects, setProjects] = useState([]);
    const [selected, setSelected] = useState(null);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('recent');
    const [composerOpen, setComposerOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [projectLoading, setProjectLoading] = useState(false);
    const openProject = useCallback((project) => {
        setSelected(project === null ? null : hydrateResearchProject(project));
        onSelectProject?.(project?.id ?? null);
    }, [onSelectProject]);
    const apiRef = useRef(api);
    apiRef.current = api;
    const refresh = useCallback(async (nextQuery) => {
        setError(null);
        try {
            const next = (await apiRef.current.list(nextQuery)).map(hydrateResearchProject);
            setProjects(next);
            setSelected(current => {
                if (current === null)
                    return null;
                const listed = next.find((item) => item.id === current.id);
                return listed !== undefined && listed.updatedAt > current.updatedAt ? listed : current;
            });
        }
        catch (cause) {
            setError(messageOf(cause));
        }
    }, []);
    useEffect(() => {
        if (selected !== null)
            return;
        const timer = window.setTimeout(() => { void refresh(query); }, query === '' ? 0 : 250);
        return () => { window.clearTimeout(timer); };
    }, [query, refresh, selected]);
    useEffect(() => {
        if (projectId === undefined)
            return;
        if (projectId === null) {
            setSelected(null);
            setProjectLoading(false);
            return;
        }
        const listed = projects.find(item => item.id === projectId);
        if (listed !== undefined) {
            setSelected(current => current?.id === listed.id && current.updatedAt >= listed.updatedAt ? current : hydrateResearchProject(listed));
            setProjectLoading(false);
            return;
        }
        let active = true;
        setProjectLoading(true);
        void apiRef.current.get(ResearchId(projectId)).then(project => {
            if (!active)
                return;
            if (project === null) {
                setSelected(null);
                setError(t('empty.noMatch'));
            }
            else {
                setSelected(hydrateResearchProject(project));
            }
            setProjectLoading(false);
        }, (cause) => {
            if (active) {
                setError(messageOf(cause));
                setProjectLoading(false);
            }
        });
        return () => { active = false; };
    }, [projectId, projects, t]);
    const requestDelete = useCallback((target) => { setError(null); setPendingDelete(target); }, []);
    const confirmDelete = useCallback(async () => {
        if (pendingDelete === null || deleteBusy)
            return;
        setDeleteBusy(true);
        setError(null);
        try {
            await api.delete(pendingDelete.id);
            if (selected?.id === pendingDelete.id)
                openProject(null);
            setPendingDelete(null);
            await refresh(query);
        }
        catch (cause) {
            setError(messageOf(cause));
        }
        finally {
            setDeleteBusy(false);
        }
    }, [api, deleteBusy, openProject, pendingDelete, query, refresh, selected?.id]);
    const visible = useMemo(() => {
        const phaseMatch = (phase) => filter === 'all' || filter === 'planning' && ['planning', 'awaiting_plan_confirm'].includes(phase) || filter === 'investigating' && ['investigating', 'ready_for_report', 'writing'].includes(phase) || filter === 'done' && ['done', 'incomplete'].includes(phase);
        const filtered = projects.filter(project => phaseMatch(project.phase));
        return sort === 'title' ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt);
    }, [filter, projects, sort]);
    const updateSelected = useCallback((project) => {
        const next = hydrateResearchProject(project);
        setSelected(current => current?.id === next.id && current.updatedAt === next.updatedAt ? current : next);
        setProjects(current => current.map(item => item.id === next.id ? next : item));
    }, []);
    if (projectId !== undefined && projectId !== null && selected === null && projectLoading) {
        return _jsx("div", { className: css.shell, children: _jsx("div", { className: css.content, children: _jsxs("div", { className: css.projectLoading, role: "status", children: [_jsx(IconLoading, { className: css.spinner, size: 16 }), _jsx("span", { children: t('phase.planning') })] }) }) });
    }
    if (selected !== null)
        return _jsxs("div", { className: css.shell, children: [_jsx(ResearchWorkspace, { project: selected, api: api, t: t, onChange: updateSelected, onBack: () => { openProject(null); }, onDelete: () => { requestDelete({ id: selected.id, title: selected.title }); }, error: error, setError: setError }), pendingDelete === null ? null : _jsx(DeleteConfirmDialog, { pending: pendingDelete, busy: deleteBusy, t: t, onCancel: () => { if (!deleteBusy)
                        setPendingDelete(null); }, onConfirm: () => { void confirmDelete(); } })] });
    const filters = [['all', 'filter.all'], ['planning', 'filter.planning'], ['investigating', 'filter.investigating'], ['done', 'filter.done']];
    return _jsxs("div", { className: css.shell, children: [_jsxs("div", { className: css.content, children: [_jsx("span", { "data-deepresearch-view": "", hidden: true }), onClose === undefined ? null : (_jsx("div", { className: css.libraryTopBar, children: _jsxs("button", { className: css.backButton, type: "button", "aria-label": t('library.backAria'), onClick: onClose, children: [_jsx(IconArrowLeft, { size: 15 }), t('library.back')] }) })), _jsxs("div", { className: css.toolbar, children: [_jsx("div", { className: css.filters, "aria-label": t('library.filterAria'), children: filters.map(([id, key]) => _jsx("button", { className: filter === id ? css.activeChip : css.chip, type: "button", "aria-current": filter === id ? 'page' : undefined, onClick: () => { setFilter(id); }, children: t(key) }, id)) }), _jsxs("div", { className: css.toolbarActions, children: [_jsx("input", { className: css.search, value: query, onChange: event => { setQuery(event.target.value); }, placeholder: t('toolbar.search'), "aria-label": t('toolbar.searchAria') }), _jsxs("select", { className: css.select, value: sort, onChange: event => { setSort(event.target.value); }, "aria-label": t('toolbar.sortAria'), children: [_jsx("option", { value: "recent", children: t('toolbar.sortRecent') }), _jsx("option", { value: "title", children: t('toolbar.sortTitle') })] }), _jsxs("div", { className: css.viewToggle, children: [_jsx("button", { className: css.iconButton, type: "button", "aria-label": t('toolbar.gridView'), "aria-pressed": viewMode === 'grid', "data-active": viewMode === 'grid', onClick: () => { setViewMode('grid'); }, children: _jsx(IconLayoutGrid, { size: 16 }) }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": t('toolbar.listView'), "aria-pressed": viewMode === 'list', "data-active": viewMode === 'list', onClick: () => { setViewMode('list'); }, children: _jsx(IconList, { size: 16 }) })] }), _jsxs("button", { className: css.primaryButton, type: "button", onClick: () => { setError(null); setComposerOpen(true); }, children: [_jsx(IconPlus, { size: 15 }), t('action.start')] })] })] }), _jsxs("section", { className: css.library, children: [_jsx("header", { className: css.libraryTitle, children: _jsxs("div", { children: [_jsx("h2", { children: t('library.title') }), _jsx("p", { children: t('library.projectCount', { count: visible.length }) })] }) }), error === null || composerOpen ? null : _jsx("div", { className: css.error, role: "alert", children: error }), visible.length === 0 ? _jsxs("div", { className: css.emptyState, children: [_jsx("span", { "aria-hidden": "true", children: _jsx(IconBolt, { size: 22 }) }), _jsx("strong", { children: query === '' ? t('empty.none') : t('empty.noMatch') }), _jsx("p", { children: query === '' ? t('empty.hintStart') : t('empty.hintNoMatch') }), query === '' ? _jsxs("button", { className: css.primaryButton, type: "button", onClick: () => { setComposerOpen(true); }, children: [_jsx(IconPlus, { size: 15 }), t('action.start')] }) : null] }) : _jsxs("div", { className: viewMode === 'grid' ? css.projectGrid : css.projectList, children: [viewMode === 'grid' ? _jsxs("button", { className: css.createCard, type: "button", onClick: () => { setComposerOpen(true); }, children: [_jsx("span", { children: _jsx(IconPlus, { size: 22 }) }), _jsx("strong", { children: t('action.startShort') })] }) : null, visible.map((project, index) => _jsx(ProjectCard, { project: project, index: index, list: viewMode === 'list', t: t, onOpen: () => { openProject(project); }, onDelete: () => { requestDelete({ id: project.id, title: project.title }); } }, project.id))] })] })] }), composerOpen ? _jsx(ResearchComposer, { busy: busy, error: error, setBusy: setBusy, t: t, onClose: () => { if (!busy)
                    setComposerOpen(false); }, onCreate: async (request) => { const project = await api.start(request); setComposerOpen(false); await refresh(query); openProject(project); }, setError: setError }) : null, pendingDelete === null ? null : _jsx(DeleteConfirmDialog, { pending: pendingDelete, busy: deleteBusy, t: t, onCancel: () => { if (!deleteBusy)
                    setPendingDelete(null); }, onConfirm: () => { void confirmDelete(); } })] });
}
function ProjectCard({ project, index, list, t, onOpen, onDelete }) { const [emoji, title] = splitEmoji(project.title); return _jsxs("article", { className: css.projectCard, "data-list": list || undefined, style: { '--card-tint': CARD_TONES[index % CARD_TONES.length] }, children: [_jsx("button", { className: css.cardOpen, type: "button", onClick: onOpen, "aria-label": t('card.openAria', { title: project.title }) }), _jsx("div", { className: css.cardEmoji, children: emoji || _jsx(IconBolt, { size: 25 }) }), _jsxs("div", { className: css.cardInfo, children: [_jsx("h3", { children: title }), _jsx("p", { children: project.goal || project.question }), _jsxs("div", { children: [_jsx("span", { className: css.phase, "data-phase": project.runState === 'paused' ? 'aborted' : project.phase, children: phaseLabel(project, t) }), _jsx("span", { children: t('card.evidence', { count: project.evidence.length, date: formatDate(project.updatedAt) }) })] })] }), _jsx("button", { className: css.deleteButton, type: "button", "aria-label": t('workspace.delete'), onClick: event => { event.stopPropagation(); onDelete(); }, children: _jsx(IconX, { size: 15 }) })] }); }
function ResearchComposer({ busy, error, setBusy, t, onClose, onCreate, setError }) {
    const [question, setQuestion] = useState('');
    const [goal, setGoal] = useState('');
    const [constraints, setConstraints] = useState('');
    const [seedText, setSeedText] = useState('');
    const [depth, setDepth] = useState('standard');
    const [contextOpen, setContextOpen] = useState(false);
    const contextCount = [goal, constraints, seedText].filter(value => value.trim() !== '').length;
    const submit = (event) => { event.preventDefault(); const trimmed = question.trim(); if (busy || trimmed === '')
        return; setBusy(true); setError(null); void onCreate({ question: trimmed, goal: goal.trim(), constraints: constraints.trim(), seedText: seedText.trim(), depth, questions: [] }).catch((cause) => { setError(messageOf(cause)); }).finally(() => { setBusy(false); }); };
    return _jsx("div", { className: css.modalBackdrop, role: "presentation", children: _jsxs("form", { className: css.modal, role: "dialog", "aria-modal": "true", "aria-labelledby": "new-research-title", onSubmit: submit, children: [_jsxs("div", { className: css.modalHeader, children: [_jsxs("div", { className: css.modalHeading, children: [_jsx("span", { "aria-hidden": "true", children: _jsx(IconBolt, { size: 18 }) }), _jsxs("div", { children: [_jsx("h3", { id: "new-research-title", children: t('composer.title') }), _jsx("p", { children: t('composer.subtitle') })] })] }), _jsx("button", { className: css.modalCloseButton, type: "button", "aria-label": t('composer.closeAria'), disabled: busy, onClick: onClose, children: _jsx(IconX, { size: 16 }) })] }), _jsxs("div", { className: css.modalBody, children: [_jsxs("label", { className: css.fieldLabel, children: [_jsxs("span", { children: [t('composer.question'), " ", _jsx("b", { children: t('composer.required') })] }), _jsx("textarea", { autoFocus: true, className: css.questionInput, value: question, onChange: event => { setQuestion(event.target.value); }, placeholder: t('composer.questionPlaceholder') })] }), _jsxs("div", { className: css.contextCard, children: [_jsxs("button", { type: "button", "aria-expanded": contextOpen, onClick: () => { setContextOpen(value => !value); }, children: [_jsx("span", { children: _jsx(IconTarget, { size: 15 }) }), _jsxs("span", { children: [_jsxs("strong", { children: [t('composer.context'), contextCount === 0 ? '' : t('composer.contextCount', { count: contextCount })] }), _jsx("small", { children: t('composer.contextHint') })] }), _jsx("b", { children: contextOpen ? _jsx(IconChevronUp, { size: 14 }) : _jsx(IconChevronDown, { size: 14 }) })] }), contextOpen ? _jsxs("div", { className: css.contextFields, children: [_jsxs("label", { children: [t('composer.goal'), _jsx("input", { className: css.input, value: goal, onChange: event => { setGoal(event.target.value); }, placeholder: t('composer.goalPlaceholder') })] }), _jsxs("label", { children: [t('composer.depth'), _jsxs("select", { className: css.input, value: depth, onChange: event => { setDepth(event.target.value); }, children: [_jsx("option", { value: "quick", children: t('depth.quick') }), _jsx("option", { value: "standard", children: t('depth.standard') }), _jsx("option", { value: "deep", children: t('depth.deep') })] })] }), _jsxs("label", { children: [t('composer.constraints'), _jsx("textarea", { className: css.textareaSmall, value: constraints, onChange: event => { setConstraints(event.target.value); }, placeholder: t('composer.constraintsPlaceholder') })] }), _jsxs("label", { children: [t('composer.seed'), _jsx("textarea", { className: css.textareaSmall, value: seedText, onChange: event => { setSeedText(event.target.value); }, placeholder: t('composer.seedPlaceholder') })] })] }) : null] }), error === null ? null : _jsx("div", { className: css.modalError, role: "alert", children: error })] }), _jsxs("div", { className: css.modalFooter, children: [_jsx("span", { children: t('composer.footer') }), _jsxs("div", { children: [_jsx("button", { className: css.modalCancelButton, type: "button", disabled: busy, onClick: onClose, children: t('action.cancel') }), _jsxs("button", { className: css.modalSubmitButton, type: "submit", disabled: busy || question.trim() === '', children: [busy ? _jsx(IconLoading, { className: css.spinner, size: 14 }) : _jsx(IconBolt, { size: 14 }), busy ? t('action.creating') : t('action.createPlan')] })] })] })] }) });
}
function DeleteConfirmDialog({ pending, busy, t, onCancel, onConfirm }) {
    const [, title] = splitEmoji(pending.title);
    const name = title || pending.title;
    return _jsx("div", { className: css.confirmBackdrop, role: "presentation", onClick: () => { if (!busy)
            onCancel(); }, children: _jsxs("div", { className: css.confirmCard, role: "dialog", "aria-modal": "true", "aria-labelledby": "delete-research-title", onClick: event => { event.stopPropagation(); }, children: [_jsx("span", { className: css.confirmMark, "aria-hidden": "true" }), _jsx("h3", { id: "delete-research-title", children: t('delete.title') }), _jsx("p", { children: t('delete.body', { title: name }) }), _jsxs("div", { className: css.confirmActions, children: [_jsx("button", { className: css.confirmCancel, type: "button", disabled: busy, onClick: onCancel, children: t('action.cancel') }), _jsxs("button", { className: css.confirmDelete, type: "button", disabled: busy, onClick: onConfirm, children: [busy ? _jsx(IconLoading, { className: css.spinner, size: 14 }) : null, t('delete.confirm')] })] })] }) });
}
function ResearchWorkspace({ project, api, t, onChange, onBack, onDelete, error, setError }) {
    const [focus, setFocus] = useState(stepFor(project));
    const [goal, setGoal] = useState(project.goal);
    const [questions, setQuestions] = useState(() => editablePlan(project));
    const [busy, setBusy] = useState(false);
    const prevPhase = useRef(project.phase);
    useEffect(() => {
        setGoal(project.goal);
        setQuestions(editablePlan(project));
        const from = prevPhase.current;
        prevPhase.current = project.phase;
        setFocus(current => {
            const target = stepFor(project);
            if (from !== project.phase && target === 'investigate' && current === 'plan')
                return 'investigate';
            if (from !== project.phase && target === 'report' && current !== 'report')
                return 'report';
            return reachableStep(project, current) ? current : target;
        });
    }, [project.phase, project.goal, project.id, project.updatedAt]);
    const seenUpdatedAt = useRef(project.updatedAt);
    seenUpdatedAt.current = project.updatedAt;
    const applyLatest = useCallback((latest) => {
        if (latest.id !== project.id || latest.updatedAt === seenUpdatedAt.current)
            return;
        onChange(latest);
    }, [onChange, project.id]);
    useEffect(() => {
        let active = true;
        const unsubscribe = api.subscribeProgress(latest => {
            if (active)
                applyLatest(latest);
        });
        return () => { active = false; unsubscribe(); };
    }, [api.subscribeProgress, applyLatest]);
    useEffect(() => {
        if (project.runState !== 'running')
            return;
        let active = true;
        let inFlight = false;
        const sync = () => {
            if (!active || inFlight)
                return;
            inFlight = true;
            void api.get(project.id).then(latest => {
                if (active && latest !== null)
                    applyLatest(latest);
            }).finally(() => { inFlight = false; });
        };
        sync();
        const timer = window.setInterval(sync, 2500);
        return () => { active = false; window.clearInterval(timer); };
    }, [api, applyLatest, project.id, project.runState]);
    const run = useCallback(async (operation) => {
        setBusy(true);
        setError(null);
        try {
            onChange(await operation());
        }
        catch (cause) {
            setError(messageOf(cause));
        }
        finally {
            setBusy(false);
        }
    }, [onChange, setError]);
    // Constraints are collected once in the composer context and are never edited here.
    const planRequest = useCallback(() => ({
        id: project.id,
        goal: goal.trim(),
        constraints: project.constraints,
        depth: project.depth,
        questions: questions
            .map(question => ({ ...question, text: question.text.trim(), criteria: question.criteria.map(item => item.trim()).filter(Boolean) }))
            .filter(question => question.text !== '' && question.criteria.length > 0),
    }), [goal, project.constraints, project.depth, project.id, questions]);
    const savePlan = useCallback(() => { void run(() => api.updatePlan(planRequest())); }, [api, planRequest, run]);
    const confirmAndStart = useCallback(async () => {
        if (busy)
            return;
        setBusy(true);
        setError(null);
        try {
            const saved = await api.updatePlan(planRequest());
            onChange(await api.confirmPlan(saved.id));
            setFocus('investigate');
        }
        catch (cause) {
            setError(messageOf(cause));
        }
        finally {
            setBusy(false);
        }
    }, [api, busy, onChange, planRequest, setError]);
    const running = project.runState === 'running';
    const paused = project.runState === 'paused';
    const canContinue = paused && ['planning', 'investigating', 'incomplete', 'writing', 'aborted', 'failed'].includes(project.phase);
    const canWrite = project.planConfirmed && !running && ['ready_for_report', 'writing', 'done', 'incomplete', 'investigating'].includes(project.phase);
    const stopRun = useCallback(() => { void run(() => api.fail(project.id, t('investigate.stopReason'), true)); }, [api, project.id, run, t]);
    const resumeRun = useCallback(() => { void run(() => api.resume(project.id)); }, [api, project.id, run]);
    const rewriteReport = useCallback(() => {
        void run(async () => {
            const next = await api.writeReport(project.id);
            setFocus('report');
            return next;
        });
    }, [api, project.id, run]);
    const activeStep = reachableStep(project, focus) ? focus : stepFor(project);
    const steps = [['plan', 'stepper.plan'], ['investigate', 'stepper.investigate'], ['report', 'stepper.report']];
    return _jsxs("div", { className: css.workspace, children: [_jsxs("header", { className: css.workspaceHeader, children: [_jsxs("button", { className: css.backButton, type: "button", onClick: onBack, children: [_jsx(IconArrowLeft, { size: 15 }), t('workspace.back')] }), _jsxs("div", { className: css.projectHeading, children: [_jsx("p", { className: css.eyebrow, children: "RESEARCH PROJECT" }), _jsx("h2", { children: project.title })] }), _jsxs("div", { className: css.headerActions, children: [_jsx("span", { className: css.phase, "data-phase": paused ? 'aborted' : project.phase, children: phaseLabel(project, t) }), running ? _jsx("button", { className: css.stopButton, type: "button", disabled: busy, onClick: stopRun, children: t('investigate.stop') }) : null, canContinue ? _jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: resumeRun, children: project.planConfirmed ? t('investigate.continue') : t('plan.retry') }) : null, canWrite && (project.phase === 'ready_for_report' || project.phase === 'writing' || project.phase === 'done' || project.phase === 'incomplete') ? _jsx("button", { className: css.primaryButton, type: "button", disabled: busy, onClick: rewriteReport, children: project.report ? t('report.retry') : t('investigate.writeReport') }) : null, _jsx("button", { className: css.deleteText, type: "button", onClick: onDelete, children: t('workspace.delete') })] })] }), _jsx("div", { className: css.progressBar, children: _jsx("nav", { className: css.stepper, children: steps.map(([id, key]) => {
                        const reachable = reachableStep(project, id);
                        return _jsx("button", { type: "button", disabled: !reachable, "data-active": activeStep === id, onClick: () => { setFocus(id); }, children: t(key) }, id);
                    }) }) }), error === null ? null : _jsx("div", { className: css.error, children: error }), _jsxs("div", { className: css.detailBody, children: [_jsx("span", { "data-deepresearch-view": "", hidden: true }), activeStep !== 'plan' ? null : _jsx(PlanStep, { project: project, t: t, busy: busy, goal: goal, setGoal: setGoal, questions: questions, setQuestions: setQuestions, onSave: savePlan, onConfirm: () => { void confirmAndStart(); }, onRetry: resumeRun }), activeStep !== 'investigate' ? null : _jsx(InvestigatePane, { project: project, t: t, busy: busy, onStop: stopRun, onContinue: resumeRun, onWrite: rewriteReport }), activeStep !== 'report' ? null : _jsx(ReportPane, { project: project, t: t, busy: busy, onRewrite: rewriteReport })] })] });
}
/** Plan step: waiting shell, planner failure, or the reviewable plan itself. */
function PlanStep({ project, t, busy, goal, setGoal, questions, setQuestions, onSave, onConfirm, onRetry }) {
    if (project.phase === 'planning' && project.questions.length === 0) {
        const stopped = project.runState !== 'running';
        return _jsx("section", { className: css.planPane, children: _jsxs("div", { className: css.planningState, children: [_jsx("span", { className: css.planningIcon, "aria-hidden": "true", children: stopped ? _jsx(IconTarget, { size: 22 }) : _jsx(IconLoading, { className: css.spinner, size: 22 }) }), _jsxs("div", { children: [_jsx("h3", { children: stopped ? t('plan.stopped') : t('phase.planning') }), _jsx("p", { children: stopped ? t('plan.stoppedHint') : t('plan.subtitle') }), stopped ? _jsx("button", { className: css.primaryButton, type: "button", disabled: busy, onClick: onRetry, children: t('plan.retry') }) : null] })] }) });
    }
    if (project.phase === 'failed' && !project.planConfirmed && project.questions.length === 0) {
        return _jsx("section", { className: css.planPane, children: _jsxs("div", { className: css.planFailure, role: "alert", children: [_jsx("h3", { children: t('plan.failedTitle') }), _jsx("p", { children: t('plan.failedHint') }), project.limitations.map(item => _jsx("code", { children: item }, item))] }) });
    }
    const locked = project.planConfirmed || busy;
    const updateQuestion = (index, patch) => {
        setQuestions(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
    };
    return _jsxs("section", { className: css.planPane, children: [_jsxs("div", { className: css.sectionHeader, children: [_jsxs("div", { children: [_jsx("p", { className: css.planEyebrow, children: t('plan.title') }), _jsx("h3", { className: css.planQuestionTitle, children: project.question }), _jsx("p", { children: t('plan.subtitle') })] }), _jsxs("div", { className: css.headerActions, children: [_jsx("span", { className: css.planDepth, children: `${t('composer.depth')} · ${depthLabel(project.depth, t)}` }), project.planConfirmed
                                ? _jsxs("span", { className: css.confirmed, children: [_jsx(IconCheck, { size: 13 }), t('plan.confirmed')] })
                                : _jsxs(_Fragment, { children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: onSave, children: t('action.saveChanges') }), _jsx("button", { className: css.primaryButton, type: "button", disabled: busy || questions.length === 0, onClick: onConfirm, children: t('action.confirmStart') })] })] })] }), _jsxs("label", { className: css.goalBlock, children: [_jsx("span", { children: t('plan.goal') }), _jsx("textarea", { value: goal, disabled: locked, onChange: event => { setGoal(event.target.value); } })] }), _jsxs("div", { className: css.planList, children: [_jsx("span", { className: css.planListLabel, children: t('plan.criteria') }), questions.map((question, index) => {
                        const criteria = question.criteria.filter(item => item.trim() !== '');
                        const deps = question.dependsOn ?? [];
                        return _jsxs("section", { className: css.planQuestion, children: [_jsx("span", { children: ordinal(index) }), _jsxs("div", { children: [project.planConfirmed
                                            ? _jsx("h4", { children: question.text })
                                            : _jsx("textarea", { value: question.text, disabled: busy, onChange: event => { updateQuestion(index, { text: event.target.value }); } }), project.planConfirmed
                                            ? _jsx("ul", { className: css.criteriaList, children: criteria.map((item, itemIndex) => _jsx("li", { children: item }, `${index}-${itemIndex}`)) })
                                            : _jsxs("label", { children: [t('plan.criteria'), _jsx("textarea", { value: question.criteria.join('\n'), disabled: busy, onChange: event => { updateQuestion(index, { criteria: event.target.value.split('\n') }); } })] }), deps.length === 0 ? null : _jsxs("div", { className: css.depBlock, children: [_jsx("span", { className: css.depLabel, children: t('plan.dependsOn') }), _jsx("div", { className: css.depChips, children: deps.map(dep => _jsx("span", { className: css.depChip, children: t('plan.dependsOnChip', { label: formatDepLabel(dep, questions[dep]?.text ?? '') }) }, `${index}-${dep}`)) }), _jsx("small", { className: css.depHint, children: t('plan.dependsOnHint') })] })] })] }, `${project.id}-${index}`);
                    })] })] });
}
/** Investigate step: timeline first, then questions + limitations, then evidence. */
function InvestigatePane({ project, t, busy, onStop, onContinue, onWrite }) {
    const indexOf = useMemo(() => new Map(project.questions.map((question, index) => [question.id, index])), [project.questions]);
    const scouts = useMemo(() => boardScouts(project), [project]);
    const scoutOf = useMemo(() => new Map(scouts.map(scout => [scout.questionId, scout])), [scouts]);
    const settledQuestions = project.questions.filter(item => isSettledQuestion(item.status)).length;
    const settledScouts = scouts.filter(item => item.status === 'done' || item.status === 'partial' || item.status === 'blocked').length;
    const accepted = project.evidence.filter(item => item.status !== 'candidate' && item.status !== 'rejected').length;
    const limitations = boardLimitations(project, t, project.phase === 'investigating');
    return _jsxs("section", { className: css.investigatePane, children: [_jsxs("header", { className: css.questionHeader, children: [_jsx("span", { children: t('composer.question') }), _jsx("h3", { children: project.question }), project.goal === '' ? null : _jsx("p", { children: project.goal })] }), project.phase === 'investigating' && project.runState === 'running' ? _jsxs("div", { className: css.runningBanner, role: "status", children: [_jsx(IconLoading, { className: css.spinner, size: 16 }), _jsx("span", { children: t('investigate.running') }), _jsx("button", { className: css.stopButton, type: "button", disabled: busy, onClick: onStop, children: t('investigate.stop') })] }) : null, project.runState === 'paused' && ['investigating', 'incomplete', 'writing', 'aborted'].includes(project.phase) ? _jsxs("div", { className: css.pausedBanner, role: "status", children: [_jsx(IconTarget, { size: 15 }), _jsxs("div", { children: [_jsx("strong", { children: t('phase.aborted') }), _jsx("p", { children: t('investigate.pausedHint') })] }), _jsxs("div", { className: css.bannerActions, children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: onContinue, children: t('investigate.continue') }), project.questions.every(item => isSettledQuestion(item.status)) ? _jsx("button", { className: css.primaryButton, type: "button", disabled: busy, onClick: onWrite, children: t('investigate.writeReport') }) : null] })] }) : null, project.phase === 'ready_for_report' && project.runState !== 'running' ? _jsxs("div", { className: css.readyBanner, role: "status", children: [_jsx(IconCheck, { size: 15 }), _jsxs("div", { children: [_jsx("strong", { children: t('investigate.readyTitle') }), _jsx("p", { children: t('investigate.readyHint') })] }), _jsx("button", { className: css.primaryButton, type: "button", disabled: busy, onClick: onWrite, children: t('investigate.writeReport') })] }) : null, project.phase === 'incomplete' && project.runState !== 'paused' ? _jsxs("div", { className: css.incompleteBanner, role: "status", children: [_jsx(IconTarget, { size: 15 }), _jsxs("div", { children: [_jsx("strong", { children: t('investigate.incompleteTitle') }), _jsx("p", { children: t('investigate.incompleteHint') })] })] }) : null, _jsxs("div", { className: css.metrics, children: [_jsx(Metric, { label: t('metric.subQuestions'), value: `${settledQuestions}/${project.questions.length}` }), _jsx(Metric, { label: t('metric.evidence'), value: String(accepted) }), _jsx(Metric, { label: t('investigate.scouts'), value: `${settledScouts}/${scouts.length}` })] }), _jsxs("section", { className: css.timeline, children: [_jsx("div", { className: css.sectionHeader, children: _jsxs("div", { children: [_jsx("h3", { children: t('investigate.title') }), _jsx("p", { children: t('investigate.subtitle') })] }) }), scouts.map(scout => _jsx(ScoutCard, { project: project, scout: scout, indexOf: indexOf, t: t }, scout.questionId))] }), _jsxs("div", { className: css.boardGrid, children: [_jsxs("div", { className: css.questions, children: [_jsxs("h4", { className: css.boardHeading, children: [t('investigate.questions'), " ", _jsx("span", { children: project.questions.length })] }), project.questions.map((question, index) => _jsx(QuestionCard, { project: project, question: question, index: index, indexOf: indexOf, scout: scoutOf.get(question.id), t: t }, question.id))] }), _jsx(LimitationsBoard, { items: limitations, t: t, always: true })] }), _jsxs("section", { className: css.evidencePane, children: [_jsxs("h4", { className: css.boardHeading, children: [t('evidence.title'), " ", _jsx("span", { children: project.evidence.length })] }), project.evidence.length === 0
                        ? _jsxs("div", { className: css.evidenceEmpty, children: [_jsx("span", { children: _jsx(IconTarget, { size: 17 }) }), _jsx("p", { children: t('evidence.empty') })] })
                        : _jsx("div", { className: css.evidenceGrid, children: project.evidence.map(item => _jsx(EvidenceCard, { evidence: item, t: t }, item.id)) })] })] });
}
function QuestionCard({ project, question, index, indexOf, scout, t }) {
    const deps = resolveIndexes(question.dependsOn, indexOf);
    const waiting = resolveIndexes(scout?.waitingOn ?? [], indexOf);
    const gaps = question.gaps ?? [];
    const label = (at) => formatDepLabel(at, project.questions[at]?.text ?? '');
    const waitingOnDeps = waiting.length > 0;
    const queued = !waitingOnDeps && scout?.status === 'waiting';
    return _jsx("article", { className: css.questionCard, "data-status": waitingOnDeps ? 'waiting' : question.status, "data-live": question.status === 'running' || undefined, children: _jsxs("div", { className: css.questionTitle, children: [_jsx("span", { children: ordinal(index) }), _jsxs("div", { children: [_jsx("h4", { children: question.text }), deps.length === 0 ? null : _jsx("div", { className: css.depChips, children: deps.map(at => _jsx("span", { className: css.depChip, children: t('plan.dependsOnChip', { label: label(at) }) }, at)) }), waiting.length === 0 ? null : _jsx("p", { className: css.waitingLine, children: t('investigate.waitingOn', { list: waiting.map(label).join('、') }) }), gaps.length === 0 ? null : _jsx("p", { className: css.gapLine, children: `${t('investigate.gaps')}: ${gaps.join(' · ')}` })] }), _jsx("strong", { "data-status": waitingOnDeps ? 'waiting' : queued ? 'pending' : question.status, children: waitingOnDeps ? t('investigate.waitingStatus') : queued ? t('investigate.queued') : statusLabel(question.status, t) })] }) });
}
function ScoutCard({ project, scout, indexOf, t }) {
    const at = indexOf.get(scout.questionId);
    const question = at === undefined ? undefined : project.questions[at];
    const title = question?.text ?? String(scout.questionId);
    const waiting = scout.status === 'waiting';
    const verifying = scout.status === 'verifying' || scout.role === 'evaluator';
    const live = scout.status === 'running' || verifying;
    const failed = scout.status === 'blocked';
    const partial = scout.status === 'partial';
    const accepted = project.evidence.filter(item => item.questionId === scout.questionId && item.status !== 'candidate' && item.status !== 'rejected');
    const activity = scout.activity.trim() !== ''
        ? scout.activity
        : verifying
            ? t('investigate.evaluating')
            : waiting
                ? (scout.waitingOn.length > 0 ? t('investigate.waitingOn', { list: resolveIndexes(scout.waitingOn, indexOf).map(item => formatDepLabel(item, project.questions[item]?.text ?? '')).join('、') }) : t('investigate.queuedHint'))
                : live
                    ? (scout.activeCriterionText || t('investigate.running'))
                    : '';
    const scoutDraft = readableDraft(scout.scoutDraft);
    const evaluatorDraft = readableDraft(scout.evaluatorDraft);
    const criterionLabel = clipLabel(scout.activeCriterionText, 36);
    return _jsxs("details", { className: css.scoutCard, "data-status": scout.status, "data-role": scout.role, "data-live": live || undefined, open: live || waiting || failed || undefined, children: [_jsxs("summary", { className: css.scoutSummary, children: [_jsx("span", { className: css.scoutIcon, "data-status": waiting ? 'waiting' : live ? 'running' : failed || partial ? scout.status : 'done', children: live ? _jsx(IconLoading, { className: css.spinner, size: 14 }) : failed || partial ? _jsx(IconTarget, { size: 14 }) : waiting ? _jsx(IconTarget, { size: 14 }) : _jsx(IconCheck, { size: 14 }) }), _jsxs("span", { className: css.scoutSummaryBody, children: [_jsx("strong", { children: title }), _jsxs("span", { className: css.scoutMetaRow, children: [_jsx("span", { className: css.scoutChip, "data-kind": verifying ? 'verify' : 'role', children: verifying ? t('investigate.verifying') : t('investigate.scouts') }), _jsx("span", { className: css.scoutChip, children: t('investigate.toolsUsed', { used: scout.toolsUsed, cap: scout.toolsCap || 10 }) }), _jsx("span", { className: css.scoutChip, children: t('investigate.evidenceCount', { count: accepted.length }) }), criterionLabel === '' || !live ? null : _jsx("span", { className: css.scoutChip, "data-kind": "criterion", children: criterionLabel })] })] }), _jsx("span", { className: css.scoutStatus, "data-live": live || undefined, children: scoutStatusLabel(scout, t) }), _jsx(IconChevronDown, { size: 14 })] }), _jsxs("div", { className: css.scoutBody, children: [activity === '' ? null : _jsxs("p", { className: css.scoutActivity, "data-live": live || undefined, children: [live ? _jsx(IconLoading, { className: css.spinner, size: 12 }) : waiting ? _jsx(IconTarget, { size: 12 }) : null, _jsx("span", { children: activity })] }), question === undefined || question.criteria.length === 0 ? null : _jsx(CriterionList, { criteria: question.criteria, scout: scout, t: t }), (scout.tools ?? []).length === 0 ? null : _jsx("ul", { className: css.toolList, children: scout.tools.map((tool, index) => _jsxs("li", { "data-status": tool.status, children: [_jsx("b", { children: toolLabel(tool.name, t) }), _jsx("span", { children: tool.detail })] }, `${tool.name}-${index}`)) }), accepted.length === 0 ? null : _jsx("div", { className: css.scoutEvidence, children: accepted.slice(0, 8).map(item => _jsx(EvidenceCard, { evidence: item, t: t }, item.id)) }), scout.dependencySummary === '' ? null : _jsxs("details", { className: css.handoff, open: waiting || undefined, children: [_jsx("summary", { children: t('investigate.dependencySummary') }), _jsx("pre", { children: scout.dependencySummary })] }), scoutDraft === '' ? null : _jsxs("details", { className: css.handoff, children: [_jsx("summary", { children: t('investigate.scoutDraft') }), _jsx("pre", { children: scoutDraft })] }), evaluatorDraft === '' ? null : _jsxs("details", { className: css.handoff, children: [_jsx("summary", { children: t('investigate.evaluatorDraft') }), _jsx("pre", { children: evaluatorDraft })] }), scout.handoff === '' ? null : _jsxs("details", { className: css.handoff, children: [_jsx("summary", { children: t('investigate.handoff') }), _jsx("pre", { children: scout.handoff })] })] })] });
}
function CriterionList({ criteria, scout, t }) {
    const live = scout?.status === 'running' || scout?.status === 'verifying';
    const verifying = scout?.status === 'verifying' || scout?.role === 'evaluator';
    const cap = Math.max(1, scout?.toolsCap || 10);
    if (criteria.length === 0)
        return null;
    return _jsxs("div", { className: css.coverage, children: [_jsx("h5", { children: t('investigate.coverage') }), _jsx("ul", { className: css.coverageList, children: criteria.map(criterion => {
                    const active = Boolean(live && scout !== undefined && scout.activeCriterionId === criterion.id);
                    const used = active && scout !== undefined ? scout.toolsUsed : (criterion.toolCount ?? 0);
                    const atCap = used >= cap;
                    const status = active && verifying ? t('investigate.verifying') : coverageLabel(criterion.status, t);
                    const verification = verificationLabel(criterion.verification, t);
                    return _jsxs("li", { className: css.coverageItem, "data-status": criterion.status, "data-active": active || undefined, "data-verify": criterion.verification || undefined, children: [_jsxs("div", { className: css.coverageHead, children: [_jsx("b", { children: criterion.text }), _jsxs("span", { children: [active ? `${t('investigate.activeNow')} · ` : '', status, verification === '' ? '' : ` · ${verification}`, ` · ${t('investigate.toolsUsed', { used, cap })}`, atCap ? ` · ${t('investigate.capReached')}` : ''] })] }), criterion.summary === '' ? null : _jsx("p", { children: `${t('investigate.summary')}: ${criterion.summary}` }), criterion.warning === '' ? null : _jsx("em", { "data-tone": "warning", children: `${t('investigate.warning')}: ${criterion.warning}` }), criterion.gap === '' ? null : _jsx("em", { "data-tone": "gap", children: `${t('investigate.gaps')}: ${criterion.gap}` })] }, criterion.id);
                }) })] });
}
function EvidenceCard({ evidence, t }) {
    const url = primaryEvidenceUrl(evidence);
    const host = sourceHostname(url);
    return _jsxs("article", { className: css.evidenceCard, "data-status": evidence.status, children: [_jsxs("div", { children: [_jsx("span", { "data-confidence": evidence.confidence, children: confidenceLabel(evidence.confidence, t) }), host === '' ? null : _jsx("span", { title: url, children: host })] }), _jsx("p", { children: evidence.claim }), url === '' ? null : _jsxs("a", { href: url, target: "_blank", rel: "noreferrer", title: url, children: [_jsx(IconExternalLink, { size: 12 }), _jsx("span", { children: host || url })] })] });
}
function ReportPane({ project, t, busy, onRewrite }) {
    const accepted = project.evidence.filter(item => item.status !== 'candidate' && item.status !== 'rejected');
    const writing = project.phase === 'writing' && project.runState === 'running';
    return _jsxs("section", { className: css.reportPane, children: [_jsxs("div", { className: css.sectionHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: t('report.title') }), _jsx("p", { children: t('report.subtitle') })] }), project.planConfirmed && !writing ? _jsx("button", { className: css.primaryButton, type: "button", disabled: busy, onClick: onRewrite, children: project.report ? t('report.retry') : t('investigate.writeReport') }) : null] }), project.report !== null
                ? _jsx("article", { className: css.reportDocument, children: _jsx(MarkdownText, { text: project.report, streaming: writing }) })
                : writing
                    ? _jsxs("div", { className: css.reportPending, role: "status", children: [_jsx(IconLoading, { className: css.spinner, size: 16 }), _jsx("span", { children: t('report.writing') })] })
                    : _jsx("div", { className: css.reportPending, children: t('report.empty') }), accepted.length === 0 ? null : _jsxs("section", { className: css.evidencePane, children: [_jsxs("h4", { className: css.boardHeading, children: [t('evidence.sourcesTitle'), " ", _jsx("span", { children: accepted.length })] }), _jsx("div", { className: css.evidenceGrid, children: accepted.map(item => _jsx(EvidenceCard, { evidence: item, t: t }, item.id)) })] })] });
}
function LimitationsBoard({ items, t, always }) {
    if (!always && items.length === 0)
        return null;
    return _jsxs("section", { className: css.limitationsBoard, children: [_jsxs("h4", { children: [t('report.limitations'), items.length === 0 ? null : _jsx("span", { children: items.length })] }), items.length === 0
                ? _jsx("p", { className: css.limitationsEmpty, children: t('report.limitationsEmpty') })
                : _jsx("ul", { className: css.limitationList, children: items.map(item => _jsxs("li", { className: css.limitationItem, "data-status": item.status || undefined, children: [_jsxs("div", { className: css.limitationHead, children: [item.ref === '' ? null : _jsx("span", { children: item.ref }), item.status === '' ? null : _jsx("b", { children: coverageLabel(item.status, t) })] }), _jsx("p", { children: item.text })] }, item.key)) })] });
}
function Metric({ label, value }) { return _jsxs("div", { children: [_jsx("span", { children: label }), _jsx("strong", { children: value })] }); }
const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a'];
/** Render a dependency reference as `01 · question text`, clipped to `max` characters. */
function formatDepLabel(index, text, max = 42) {
    const number = ordinal(index);
    const clipped = clipLabel(text, max);
    return clipped === '' ? number : `${number} · ${clipped}`;
}
function clipLabel(text, max) {
    const characters = Array.from(text.trim());
    if (characters.length === 0)
        return '';
    return characters.length > max ? `${characters.slice(0, max - 1).join('')}…` : characters.join('');
}
function readableDraft(text) {
    const value = text.trim();
    if (value === '')
        return '';
    if (/^(Search|Fetch|Read artifact|Evaluator read)\b/i.test(value))
        return '';
    if (value.startsWith('{') || value.startsWith('['))
        return '';
    return value;
}
function toolLabel(name, t) {
    if (name === 'research_web_search')
        return t('investigate.toolSearch');
    if (name === 'research_web_fetch')
        return t('investigate.toolFetch');
    if (name === 'read_artifact')
        return t('investigate.toolRead');
    return name;
}
function isSettledQuestion(status) {
    return status === 'covered' || status === 'partial' || status === 'blocked';
}
function limitationFallback(status, t) {
    if (status === 'partial')
        return t('limitation.partialFallback');
    if (status === 'blocked')
        return t('limitation.blockedFallback');
    if (status === 'conflicted')
        return t('limitation.conflictedFallback');
    return t('limitation.missingFallback');
}
function boardLimitations(project, t, live) {
    const rows = [];
    for (const [index, question] of project.questions.entries()) {
        for (const criterion of question.criteria) {
            if (criterion.status === 'covered')
                continue;
            const note = [criterion.gap, criterion.warning].map(item => item.trim()).filter(Boolean).join(' ');
            if (criterion.status === 'missing' && live && note === '')
                continue;
            const text = note || limitationFallback(criterion.status, t);
            rows.push({
                key: `${question.id}:${criterion.id}`,
                status: criterion.status,
                ref: `${formatDepLabel(index, question.text, 36)} · ${clipLabel(criterion.text, 28)}`,
                text,
            });
        }
    }
    for (const [index, item] of project.limitations.entries()) {
        const text = item.trim();
        if (!text || rows.some(row => row.text === text || text.endsWith(row.text)))
            continue;
        rows.push({ key: `note:${index}:${text}`, status: '', ref: '', text });
    }
    return rows;
}
function boardScouts(project) {
    const live = new Map((project.progress?.scouts ?? []).map(scout => [scout.questionId, scout]));
    return project.questions.map(question => {
        const existing = live.get(question.id);
        if (existing !== undefined)
            return existing;
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
        };
    });
}
function ordinal(index) { return String(index + 1).padStart(2, '0'); }
function resolveIndexes(ids, indexOf) { return ids.flatMap(id => { const at = indexOf.get(id); return at === undefined ? [] : [at]; }); }
function editablePlan(project) { return project.questions.map(question => ({ text: question.text, criteria: question.criteria.map(item => item.text), dependsOn: question.dependsOn.map(id => project.questions.findIndex(candidate => candidate.id === id)).filter(index => index >= 0) })); }
function stepFor(project) { return ['planning', 'awaiting_plan_confirm'].includes(project.phase) || ['failed', 'aborted'].includes(project.phase) && !project.planConfirmed ? 'plan' : ['writing', 'done'].includes(project.phase) ? 'report' : 'investigate'; }
function reachableStep(project, step) {
    if (project.planConfirmed && ['done', 'incomplete', 'failed', 'aborted', 'writing', 'ready_for_report'].includes(project.phase))
        return true;
    const order = ['plan', 'investigate', 'report'];
    const unlocked = project.phase === 'ready_for_report' ? 'investigate' : stepFor(project);
    return order.indexOf(step) <= order.indexOf(unlocked);
}
function depthLabel(depth, t) { return t({ quick: 'depth.quick', standard: 'depth.standard', deep: 'depth.deep' }[depth]); }
function phaseLabel(project, t) {
    if (project.runState === 'paused')
        return t('phase.aborted');
    return t({ planning: 'phase.planning', awaiting_plan_confirm: 'phase.awaitingPlanConfirm', investigating: 'phase.investigating', ready_for_report: 'phase.readyForReport', incomplete: 'phase.incomplete', writing: 'phase.writing', done: 'phase.done', failed: 'phase.failed', aborted: 'phase.aborted' }[project.phase]);
}
function statusLabel(status, t) { return t({ pending: 'status.pending', running: 'status.running', covered: 'status.covered', partial: 'status.partial', blocked: 'status.blocked', failed: 'status.failed' }[status]); }
function scoutStatusLabel(scout, t) {
    if (scout.status === 'waiting' && scout.waitingOn.length === 0)
        return t('investigate.queued');
    return t({ waiting: 'investigate.waitingStatus', running: 'status.running', verifying: 'investigate.verifying', done: 'status.covered', partial: 'status.partial', blocked: 'status.blocked' }[scout.status]);
}
function coverageLabel(status, t) { return t((`coverage.${status}`)); }
function confidenceLabel(value, t) {
    return t(value === 'high' ? 'confidence.high' : value === 'low' ? 'confidence.low' : 'confidence.medium');
}
function primaryEvidenceUrl(evidence) {
    const seen = new Set();
    for (const source of evidence.sources ?? []) {
        const url = source.url.trim();
        if (url === '' || seen.has(url))
            continue;
        seen.add(url);
        return url;
    }
    return evidence.url?.trim() ?? '';
}
function sourceHostname(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    }
    catch {
        return url.replace(/^https?:\/\//, '').split('/')[0] ?? '';
    }
}
function verificationLabel(value, t) { return value === 'PASS' ? t('verify.pass') : value === 'WARNING' ? t('verify.warning') : value === 'FAIL' ? t('verify.fail') : ''; }
function splitEmoji(value) { const first = Array.from(value.trim())[0] ?? ''; return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value]; }
function formatDate(value) { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value); }
function messageOf(value) { return value instanceof Error ? value.message : String(value); }
//# sourceMappingURL=ResearchView.js.map