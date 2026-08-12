import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Durable research board panel. */
import { useCallback, useEffect, useState } from 'react';
import css from './views.module.css';
/** Render project creation, phase summaries, evidence, and reports. */
export function ResearchView({ list, start }) {
    const [projects, setProjects] = useState([]);
    const [query, setQuery] = useState('');
    const [question, setQuestion] = useState('');
    const [depth, setDepth] = useState('standard');
    const [plan, setPlan] = useState('界定问题\n检索权威来源\n交叉验证关键结论\n综合报告与不确定性');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const refresh = useCallback(async (nextQuery) => {
        setError(null);
        try {
            setProjects(await list(nextQuery));
        }
        catch (cause) {
            setError(messageOf(cause));
        }
    }, [list]);
    useEffect(() => { void refresh(''); }, [refresh]);
    const submit = (event) => {
        event.preventDefault();
        const steps = plan.split('\n').map(step => step.trim()).filter(step => step !== '');
        if (busy || question.trim() === '' || steps.length === 0)
            return;
        setBusy(true);
        setError(null);
        void start({ question, depth, plan: steps }).then(() => {
            setQuestion('');
            setBusy(false);
            void refresh(query);
        }, (cause) => {
            setError(messageOf(cause));
            setBusy(false);
        });
    };
    return (_jsxs("div", { className: css.shell, "data-conversation-composer-overlay": "", children: [_jsxs("header", { className: css.hero, children: [_jsxs("div", { children: [_jsx("p", { className: css.eyebrow, children: "DEEP RESEARCH" }), _jsx("h2", { className: css.heading, children: "\u6DF1\u5EA6\u7814\u7A76" }), _jsx("p", { className: css.subtitle, children: "\u5148\u8BA1\u5212\uFF0C\u518D\u8C03\u67E5\uFF1B\u8BC1\u636E\u3001\u6765\u6E90\u548C\u62A5\u544A\u6301\u7EED\u7559\u6863\u3002" })] }), _jsxs("div", { className: css.searchGroup, children: [_jsx("input", { className: css.input, value: query, onChange: (event) => { setQuery(event.target.value); }, placeholder: "\u641C\u7D22\u7814\u7A76\u95EE\u9898\u6216\u62A5\u544A" }), _jsx("button", { className: css.secondaryButton, type: "button", onClick: () => { void refresh(query); }, children: "\u641C\u7D22" })] })] }), _jsxs("div", { className: css.columns, children: [_jsxs("form", { className: css.editor, onSubmit: submit, children: [_jsx("div", { className: css.sectionTitle, children: "\u53D1\u8D77\u7814\u7A76" }), _jsx("textarea", { className: css.question, value: question, onChange: (event) => { setQuestion(event.target.value); }, placeholder: "\u8981\u6DF1\u5165\u7814\u7A76\u4EC0\u4E48\uFF1F" }), _jsxs("select", { className: css.input, value: depth, onChange: (event) => { setDepth(event.target.value); }, children: [_jsx("option", { value: "quick", children: "\u5FEB\u901F" }), _jsx("option", { value: "standard", children: "\u6807\u51C6" }), _jsx("option", { value: "deep", children: "\u6DF1\u5165" })] }), _jsx("textarea", { className: css.plan, value: plan, onChange: (event) => { setPlan(event.target.value); }, "aria-label": "\u7814\u7A76\u8BA1\u5212\uFF0C\u6BCF\u884C\u4E00\u6B65" }), _jsx("button", { className: css.primaryButton, type: "submit", disabled: busy, children: busy ? '创建中…' : '创建研究计划' }), _jsx("p", { className: css.hint, children: "\u521B\u5EFA\u540E\uFF0C\u8BA9\u6A21\u578B\u6309\u8BA1\u5212\u4F7F\u7528 Web / subagent \u8C03\u7814\u5E76\u5199\u5165\u8BC1\u636E\u3002" }), error === null ? null : _jsx("div", { className: css.error, role: "alert", children: error })] }), _jsxs("section", { className: css.library, "aria-label": "\u7814\u7A76\u9879\u76EE", children: [_jsxs("div", { className: css.sectionTitle, children: ["\u7814\u7A76\u770B\u677F ", _jsx("span", { className: css.count, children: projects.length })] }), projects.length === 0 ? _jsx("div", { className: css.empty, children: "\u6682\u65E0\u7814\u7A76\u9879\u76EE\u3002" }) : null, _jsx("div", { className: css.cardGrid, children: projects.map(project => (_jsxs("article", { className: css.card, children: [_jsxs("div", { className: css.cardHeader, children: [_jsx("span", { className: css.phase, "data-phase": project.phase, children: phaseLabel(project.phase) }), _jsxs("span", { className: css.meta, children: [project.depth, " \u00B7 ", project.evidence.length, " \u6761\u8BC1\u636E"] })] }), _jsx("h3", { className: css.cardTitle, children: project.question }), _jsx("ol", { className: css.steps, children: project.plan.map(step => _jsx("li", { children: step }, step)) }), project.report === null ? null : (_jsxs("details", { className: css.report, children: [_jsx("summary", { children: "\u67E5\u770B\u6700\u7EC8\u62A5\u544A" }), _jsx("p", { children: project.report })] }))] }, project.id))) })] })] })] }));
}
function phaseLabel(phase) {
    switch (phase) {
        case 'planning': return '计划中';
        case 'researching': return '调查中';
        case 'synthesizing': return '综合中';
        case 'complete': return '已完成';
    }
}
function messageOf(value) {
    return value instanceof Error ? value.message : String(value);
}
//# sourceMappingURL=ResearchView.js.map