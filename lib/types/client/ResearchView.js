import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Codemini-aligned Deep Research library and evidence workspace. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import css from './views.module.css';
/** Render the research library, editable plan, investigation evidence, and report. */
export function ResearchView({ t, ...api }) {
    const [projects, setProjects] = useState([]);
    const [selected, setSelected] = useState(null);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sort, setSort] = useState('recent');
    const [composerOpen, setComposerOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const refresh = useCallback(async (nextQuery) => { setError(null); try {
        const next = await api.list(nextQuery);
        setProjects(next);
        setSelected(current => { if (current === null)
            return null; const listed = next.find(item => item.id === current.id); return listed !== undefined && listed.updatedAt >= current.updatedAt ? listed : current; });
    }
    catch (cause) {
        setError(messageOf(cause));
    } }, [api]);
    useEffect(() => {
        const timer = window.setTimeout(() => { void refresh(query); }, query === '' ? 0 : 250);
        return () => { window.clearTimeout(timer); };
    }, [query, refresh]);
    const visible = useMemo(() => {
        const phaseMatch = (phase) => filter === 'all' || filter === 'planning' && ['planning', 'awaiting_plan_confirm'].includes(phase) || filter === 'investigating' && ['investigating', 'ready_for_report', 'writing'].includes(phase) || filter === 'done' && ['done', 'incomplete'].includes(phase);
        const filtered = projects.filter(project => phaseMatch(project.phase));
        return sort === 'title' ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt);
    }, [filter, projects, sort]);
    const updateSelected = useCallback((project) => { setSelected(project); setProjects(current => current.map(item => item.id === project.id ? project : item)); }, []);
    if (selected !== null)
        return _jsx(ResearchWorkspace, { project: selected, api: api, t: t, onChange: updateSelected, onBack: () => { setSelected(null); }, onDelete: async () => { await api.delete(selected.id); setSelected(null); await refresh(query); }, error: error, setError: setError });
    const filters = [['all', 'filter.all'], ['planning', 'filter.planning'], ['investigating', 'filter.investigating'], ['done', 'filter.done']];
    return _jsxs("div", { className: css.shell, "data-conversation-composer-overlay": "", children: [_jsxs("div", { className: css.content, children: [_jsxs("div", { className: css.toolbar, children: [_jsx("div", { className: css.filters, "aria-label": t('library.filterAria'), children: filters.map(([id, key]) => _jsx("button", { className: filter === id ? css.activeChip : css.chip, type: "button", "aria-current": filter === id ? 'page' : undefined, onClick: () => { setFilter(id); }, children: t(key) }, id)) }), _jsxs("div", { className: css.toolbarActions, children: [_jsx("input", { className: css.search, value: query, onChange: event => { setQuery(event.target.value); }, placeholder: t('toolbar.search'), "aria-label": t('toolbar.searchAria') }), _jsxs("select", { className: css.select, value: sort, onChange: event => { setSort(event.target.value); }, "aria-label": t('toolbar.sortAria'), children: [_jsx("option", { value: "recent", children: t('toolbar.sortRecent') }), _jsx("option", { value: "title", children: t('toolbar.sortTitle') })] }), _jsxs("div", { className: css.viewToggle, children: [_jsx("button", { className: css.iconButton, type: "button", "aria-label": t('toolbar.gridView'), "aria-pressed": viewMode === 'grid', "data-active": viewMode === 'grid', onClick: () => { setViewMode('grid'); }, children: "\u25A6" }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": t('toolbar.listView'), "aria-pressed": viewMode === 'list', "data-active": viewMode === 'list', onClick: () => { setViewMode('list'); }, children: "\u2637" })] }), _jsx("button", { className: css.primaryButton, type: "button", onClick: () => { setError(null); setComposerOpen(true); }, children: t('action.start') })] })] }), _jsxs("section", { className: css.library, children: [_jsx("header", { className: css.libraryTitle, children: _jsxs("div", { children: [_jsx("h2", { children: t('library.title') }), _jsx("p", { children: t('library.projectCount', { count: visible.length }) })] }) }), error === null || composerOpen ? null : _jsx("div", { className: css.error, role: "alert", children: error }), visible.length === 0 ? _jsxs("div", { className: css.emptyState, children: [_jsx("span", { "aria-hidden": "true", children: "\u26A1" }), _jsx("strong", { children: query === '' ? t('empty.none') : t('empty.noMatch') }), _jsx("p", { children: query === '' ? t('empty.hintStart') : t('empty.hintNoMatch') }), query === '' ? _jsx("button", { className: css.primaryButton, type: "button", onClick: () => { setComposerOpen(true); }, children: t('action.start') }) : null] }) : _jsxs("div", { className: viewMode === 'grid' ? css.projectGrid : css.projectList, children: [viewMode === 'grid' ? _jsxs("button", { className: css.createCard, type: "button", onClick: () => { setComposerOpen(true); }, children: [_jsx("span", { children: "\uFF0B" }), _jsx("strong", { children: t('action.startShort') })] }) : null, visible.map((project, index) => _jsx(ProjectCard, { project: project, index: index, list: viewMode === 'list', t: t, onOpen: () => { setSelected(project); }, onDelete: () => { void api.delete(project.id).then(() => refresh(query), cause => { setError(messageOf(cause)); }); } }, project.id))] })] })] }), composerOpen ? _jsx(ResearchComposer, { busy: busy, error: error, setBusy: setBusy, t: t, onClose: () => { if (!busy)
                    setComposerOpen(false); }, onCreate: async (request) => { const project = await api.start(request); setComposerOpen(false); await refresh(query); setSelected(project); }, setError: setError }) : null] });
}
function ProjectCard({ project, index, list, t, onOpen, onDelete }) { const [emoji, title] = splitEmoji(project.title); return _jsxs("article", { className: css.projectCard, "data-list": list || undefined, style: { '--card-tint': CARD_TONES[index % CARD_TONES.length] }, children: [_jsx("button", { className: css.cardOpen, type: "button", onClick: onOpen, "aria-label": t('card.openAria', { title: project.title }) }), _jsx("div", { className: css.cardEmoji, children: emoji || '⚡' }), _jsxs("div", { className: css.cardInfo, children: [_jsx("h3", { children: title }), _jsx("p", { children: project.goal || project.question }), _jsxs("div", { children: [_jsx("span", { className: css.phase, "data-phase": project.phase, children: phaseLabel(project.phase, t) }), _jsx("span", { children: t('card.evidence', { count: project.evidence.length, date: formatDate(project.updatedAt) }) })] })] }), _jsx("button", { className: css.deleteButton, type: "button", onClick: event => { event.stopPropagation(); onDelete(); }, children: "\u00D7" })] }); }
function ResearchComposer({ busy, error, setBusy, t, onClose, onCreate, setError }) {
    const [question, setQuestion] = useState('');
    const [goal, setGoal] = useState('');
    const [constraints, setConstraints] = useState('');
    const [seedText, setSeedText] = useState('');
    const [depth, setDepth] = useState('standard');
    const [contextOpen, setContextOpen] = useState(false);
    const contextCount = [goal, constraints, seedText].filter(value => value.trim() !== '').length;
    const submit = (event) => { event.preventDefault(); const trimmed = question.trim(); if (busy || trimmed === '')
        return; setBusy(true); setError(null); void onCreate({ question: trimmed, goal: goal.trim(), constraints: constraints.trim(), seedText: seedText.trim(), depth, questions: initialPlan(trimmed, t) }).catch(cause => { setError(messageOf(cause)); }).finally(() => { setBusy(false); }); };
    return _jsx("div", { className: css.modalBackdrop, role: "presentation", children: _jsxs("form", { className: css.modal, role: "dialog", "aria-modal": "true", "aria-labelledby": "new-research-title", onSubmit: submit, children: [_jsxs("div", { className: css.modalHeader, children: [_jsxs("div", { className: css.modalHeading, children: [_jsx("span", { "aria-hidden": "true", children: "\u26A1" }), _jsxs("div", { children: [_jsx("h3", { id: "new-research-title", children: t('composer.title') }), _jsx("p", { children: t('composer.subtitle') })] })] }), _jsx("button", { className: css.iconButton, type: "button", "aria-label": t('composer.closeAria'), disabled: busy, onClick: onClose, children: "\u00D7" })] }), _jsxs("div", { className: css.modalBody, children: [_jsxs("label", { className: css.fieldLabel, children: [_jsxs("span", { children: [t('composer.question'), " ", _jsx("b", { children: t('composer.required') })] }), _jsx("textarea", { autoFocus: true, className: css.questionInput, value: question, onChange: event => { setQuestion(event.target.value); }, placeholder: t('composer.questionPlaceholder') })] }), _jsxs("div", { className: css.contextCard, children: [_jsxs("button", { type: "button", "aria-expanded": contextOpen, onClick: () => { setContextOpen(value => !value); }, children: [_jsx("span", { children: "\u25CE" }), _jsxs("span", { children: [_jsxs("strong", { children: [t('composer.context'), contextCount === 0 ? '' : t('composer.contextCount', { count: contextCount })] }), _jsx("small", { children: t('composer.contextHint') })] }), _jsx("b", { children: contextOpen ? '⌃' : '⌄' })] }), contextOpen ? _jsxs("div", { className: css.contextFields, children: [_jsxs("label", { children: [t('composer.goal'), _jsx("input", { className: css.input, value: goal, onChange: event => { setGoal(event.target.value); }, placeholder: t('composer.goalPlaceholder') })] }), _jsxs("label", { children: [t('composer.depth'), _jsxs("select", { className: css.input, value: depth, onChange: event => { setDepth(event.target.value); }, children: [_jsx("option", { value: "quick", children: t('depth.quick') }), _jsx("option", { value: "standard", children: t('depth.standard') }), _jsx("option", { value: "deep", children: t('depth.deep') })] })] }), _jsxs("label", { children: [t('composer.constraints'), _jsx("textarea", { className: css.textareaSmall, value: constraints, onChange: event => { setConstraints(event.target.value); }, placeholder: t('composer.constraintsPlaceholder') })] }), _jsxs("label", { children: [t('composer.seed'), _jsx("textarea", { className: css.textareaSmall, value: seedText, onChange: event => { setSeedText(event.target.value); }, placeholder: t('composer.seedPlaceholder') })] })] }) : null] }), error === null ? null : _jsx("div", { className: css.modalError, role: "alert", children: error })] }), _jsxs("div", { className: css.modalFooter, children: [_jsx("span", { children: t('composer.footer') }), _jsxs("div", { children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: onClose, children: t('action.cancel') }), _jsx("button", { className: css.primaryButton, type: "submit", disabled: busy || question.trim() === '', children: busy ? t('action.creating') : t('action.createPlan') })] })] })] }) });
}
function ResearchWorkspace({ project, api, t, onChange, onBack, onDelete, error, setError }) {
    const [focus, setFocus] = useState(stepFor(project.phase));
    const [goal, setGoal] = useState(project.goal);
    const [constraints, setConstraints] = useState(project.constraints);
    const [plan, setPlan] = useState(formatPlan(project));
    const [report, setReport] = useState(project.report ?? '');
    const [limitations, setLimitations] = useState(project.limitations.join('\n'));
    const [busy, setBusy] = useState(false);
    useEffect(() => { setFocus(stepFor(project.phase)); setGoal(project.goal); setConstraints(project.constraints); setPlan(formatPlan(project)); setReport(project.report ?? ''); setLimitations(project.limitations.join('\n')); }, [project]);
    useEffect(() => {
        if (!['investigating', 'ready_for_report', 'writing'].includes(project.phase))
            return;
        let active = true;
        const refresh = async () => {
            try {
                const latest = await api.get(project.id);
                if (active && latest !== null && latest.updatedAt !== project.updatedAt)
                    onChange(latest);
            }
            catch (cause) {
                if (active)
                    setError(messageOf(cause));
            }
        };
        const timer = window.setInterval(() => { void refresh(); }, 1_000);
        void refresh();
        return () => { active = false; window.clearInterval(timer); };
    }, [api.get, onChange, project.id, project.phase, project.updatedAt, setError]);
    const action = async (operation) => { setBusy(true); setError(null); try {
        onChange(await operation());
    }
    catch (cause) {
        setError(messageOf(cause));
    }
    finally {
        setBusy(false);
    } };
    const planRequest = () => ({ id: project.id, goal, constraints, depth: project.depth, questions: parsePlan(plan) });
    const savePlan = () => { void action(() => api.updatePlan(planRequest())); };
    const confirmAndStart = async () => {
        if (busy)
            return;
        setBusy(true);
        setError(null);
        try {
            const saved = await api.updatePlan(planRequest());
            const confirmed = await api.confirmPlan(saved.id);
            onChange(confirmed);
            api.inputActions.setDraft(investigationPrompt(confirmed));
            api.inputActions.submit();
        }
        catch (cause) {
            setError(messageOf(cause));
        }
        finally {
            setBusy(false);
        }
    };
    const complete = (partial) => { void action(() => api.complete({ id: project.id, report, limitations: limitations.split('\n').map(value => value.trim()).filter(Boolean), partial })); };
    const activeStep = reachableStep(project.phase, focus) ? focus : stepFor(project.phase);
    return _jsxs("div", { className: css.workspace, "data-conversation-composer-overlay": "", children: [_jsxs("header", { className: css.workspaceHeader, children: [_jsx("button", { className: css.backButton, type: "button", onClick: onBack, children: t('workspace.back') }), _jsxs("div", { className: css.projectHeading, children: [_jsx("p", { className: css.eyebrow, children: "RESEARCH PROJECT" }), _jsx("h2", { children: project.title })] }), _jsxs("div", { className: css.headerActions, children: [_jsx("span", { className: css.phase, "data-phase": project.phase, children: phaseLabel(project.phase, t) }), _jsx("button", { className: css.deleteText, type: "button", onClick: () => { void onDelete(); }, children: t('workspace.delete') })] })] }), _jsx("div", { className: css.progressBar, children: _jsx("nav", { className: css.stepper, children: [['plan', 'stepper.plan'], ['investigate', 'stepper.investigate'], ['report', 'stepper.report']].map(([id, key]) => { const reachable = reachableStep(project.phase, id); return _jsx("button", { type: "button", disabled: !reachable, "data-active": activeStep === id, onClick: () => { setFocus(id); }, children: t(key) }, id); }) }) }), error === null ? null : _jsx("div", { className: css.error, children: error }), _jsxs("div", { className: css.detailBody, children: [activeStep === 'plan' ? _jsxs("section", { className: css.planPane, children: [_jsxs("div", { className: css.sectionHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: t('plan.title') }), _jsx("p", { children: t('plan.subtitle') })] }), _jsx("div", { className: css.headerActions, children: project.planConfirmed ? _jsx("span", { className: css.confirmed, children: t('plan.confirmed') }) : _jsxs(_Fragment, { children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: savePlan, children: t('action.saveChanges') }), _jsx("button", { className: css.primaryButton, type: "button", disabled: busy, onClick: () => { void confirmAndStart(); }, children: t('action.confirmStart') })] }) })] }), _jsxs("div", { className: css.formGrid, children: [_jsxs("label", { children: [t('plan.goal'), _jsx("textarea", { value: goal, onChange: event => { setGoal(event.target.value); }, disabled: project.planConfirmed || busy })] }), _jsxs("label", { children: [t('plan.constraints'), _jsx("textarea", { value: constraints, onChange: event => { setConstraints(event.target.value); }, disabled: project.planConfirmed || busy })] })] }), _jsx("label", { className: css.fieldLabel, children: t('plan.criteria') }), _jsx("textarea", { className: css.planEditorLarge, value: plan, onChange: event => { setPlan(event.target.value); }, disabled: project.planConfirmed || busy })] }) : null, activeStep === 'investigate' ? _jsxs("section", { className: css.investigatePane, children: [_jsxs("header", { className: css.questionHeader, children: [_jsx("span", { children: t('composer.question') }), _jsx("h3", { children: project.question }), project.goal ? _jsx("p", { children: project.goal }) : null] }), _jsxs("div", { className: css.metrics, children: [_jsx(Metric, { label: t('metric.subQuestions'), value: `${project.questions.filter(q => ['covered', 'partial', 'blocked'].includes(q.status)).length}/${project.questions.length}` }), _jsx(Metric, { label: t('metric.evidence'), value: String(project.evidence.length) }), _jsx(Metric, { label: t('metric.searchBudget'), value: `${project.budget.searchesUsed}/${project.budget.maxSearches}` })] }), _jsxs("div", { className: css.sectionHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: t('investigate.title') }), _jsx("p", { children: t('investigate.subtitle') })] }), project.phase === 'investigating' ? _jsx("button", { className: css.stopButton, type: "button", disabled: busy, onClick: () => { void action(() => api.fail(project.id, t('investigate.stopReason'), true)); }, children: t('investigate.stop') }) : null] }), _jsxs("div", { className: css.boardGrid, children: [_jsx("div", { className: css.questions, children: project.questions.map((question, index) => _jsxs("article", { className: css.questionCard, children: [_jsxs("div", { className: css.questionTitle, children: [_jsx("span", { children: String(index + 1).padStart(2, '0') }), _jsxs("div", { children: [_jsx("h4", { children: question.text }), _jsx("strong", { "data-status": question.status, children: statusLabel(question.status, t) })] })] }), question.dependsOn.length > 0 ? _jsx("p", { children: t('investigate.dependsOn', { count: question.dependsOn.length }) }) : null, _jsx("ul", { children: question.criteria.map(criterion => _jsxs("li", { "data-status": criterion.status, children: [_jsx("span", { children: criterion.status === 'covered' ? '✓' : '○' }), _jsxs("div", { children: [_jsx("b", { children: criterion.text }), criterion.summary ? _jsx("p", { children: criterion.summary }) : null, criterion.gap ? _jsx("em", { children: criterion.gap }) : null] })] }, criterion.id)) })] }, question.id)) }), _jsxs("aside", { className: css.evidencePane, children: [_jsxs("h3", { children: [t('evidence.title'), " ", _jsx("span", { children: project.evidence.length })] }), project.evidence.length === 0 ? _jsxs("div", { className: css.evidenceEmpty, children: [_jsx("span", { children: "\u25CE" }), _jsx("p", { children: t('evidence.empty') })] }) : project.evidence.map(item => _jsxs("article", { className: css.evidenceCard, children: [_jsxs("div", { children: [_jsx("strong", { children: item.source }), _jsx("span", { "data-confidence": item.confidence, children: item.confidence })] }), _jsx("p", { children: item.claim }), item.snippet ? _jsx("blockquote", { children: item.snippet }) : null, item.url === null ? null : _jsx("a", { href: item.url, target: "_blank", rel: "noreferrer", children: t('evidence.open') })] }, item.id))] })] })] }) : null, activeStep === 'report' ? _jsxs("section", { className: css.reportPane, children: [_jsxs("div", { className: css.sectionHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: t('report.title') }), _jsx("p", { children: t('report.subtitle') })] }), _jsxs("div", { className: css.headerActions, children: [_jsx("button", { className: css.secondaryButton, type: "button", disabled: busy, onClick: () => { complete(true); }, children: t('action.savePartial') }), _jsx("button", { className: css.primaryButton, type: "button", disabled: busy, onClick: () => { complete(false); }, children: t('action.complete') })] })] }), _jsx("textarea", { className: css.reportEditor, value: report, onChange: event => { setReport(event.target.value); }, placeholder: t('report.placeholder') }), _jsx("label", { className: css.fieldLabel, children: t('report.limitations') }), _jsx("textarea", { className: css.limitationsEditor, value: limitations, onChange: event => { setLimitations(event.target.value); }, placeholder: t('report.limitationsPlaceholder') })] }) : null] })] });
}
function Metric({ label, value }) { return _jsxs("div", { children: [_jsx("span", { children: label }), _jsx("strong", { children: value })] }); }
const CARD_TONES = ['#5b8def', '#3d9b8f', '#c27a4a', '#8b6bc9', '#4a9b6e', '#b85c7a'];
function initialPlan(question, t) {
    return [
        { text: t('planTemplate.define', { question }), criteria: [t('planTemplate.defineCriteria')] },
        { text: t('planTemplate.search'), criteria: [t('planTemplate.searchCriteria')] },
        { text: t('planTemplate.crossValidate'), criteria: [t('planTemplate.crossValidateCriteria')], dependsOn: [1] },
        { text: t('planTemplate.synthesize'), criteria: [t('planTemplate.synthesizeCriteria')], dependsOn: [0, 2] },
    ];
}
function parsePlan(value) { return value.split('\n').map(line => line.trim()).filter(Boolean).map(line => { const [text = '', criteria = ''] = line.split('|', 2); return { text: text.trim(), criteria: criteria.split(';').map(item => item.trim()).filter(Boolean) }; }).filter(item => item.text !== '' && item.criteria.length > 0); }
function formatPlan(project) { return project.questions.map(question => `${question.text} | ${question.criteria.map(item => item.text).join('; ')}`).join('\n'); }
function stepFor(phase) { return ['planning', 'awaiting_plan_confirm'].includes(phase) ? 'plan' : ['writing', 'done'].includes(phase) ? 'report' : 'investigate'; }
function reachableStep(phase, step) { const order = ['plan', 'investigate', 'report']; const unlocked = phase === 'ready_for_report' ? 'investigate' : stepFor(phase); return order.indexOf(step) <= order.indexOf(unlocked); }
function investigationPrompt(project) {
    const questions = project.questions.map((question, index) => {
        const criteria = question.criteria.map(criterion => `  - [${criterion.id}] ${criterion.text}`).join('\n');
        return `${index + 1}. [${question.id}] ${question.text}\n${criteria}`;
    }).join('\n');
    return `Continue the confirmed Deep Research project below and complete it autonomously.\n\nProject ID: ${project.id}\nQuestion: ${project.question}\nGoal: ${project.goal || '(not specified)'}\nConstraints: ${project.constraints || '(none)'}\nExisting material: ${project.seedText || '(none)'}\n\nPlan:\n${questions}\n\nUse Web search/fetch and subagents when useful. For every material claim, call deep_research_add_evidence with this exact project ID, the matching question ID, criterion IDs, source, URL, claim, and confidence. After reviewing the evidence, call deep_research_update_coverage for every question. When the investigation is complete, write a source-cited Markdown report and call deep_research_complete. Do not create a new research project, do not invent sources, and state unresolved limitations explicitly.`;
}
function phaseLabel(phase, t) { return t({ planning: 'phase.planning', awaiting_plan_confirm: 'phase.awaitingPlanConfirm', investigating: 'phase.investigating', ready_for_report: 'phase.readyForReport', incomplete: 'phase.incomplete', writing: 'phase.writing', done: 'phase.done', failed: 'phase.failed', aborted: 'phase.aborted' }[phase]); }
function statusLabel(status, t) { return t({ pending: 'status.pending', running: 'status.running', covered: 'status.covered', partial: 'status.partial', blocked: 'status.blocked', failed: 'status.failed' }[status]); }
function splitEmoji(value) { const first = Array.from(value.trim())[0] ?? ''; return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ['', value]; }
function formatDate(value) { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(value); }
function messageOf(value) { return value instanceof Error ? value.message : String(value); }
//# sourceMappingURL=ResearchView.js.map