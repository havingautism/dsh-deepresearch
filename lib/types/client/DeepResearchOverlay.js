import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Frame-wide overlay hosting the Deep Research library and workspace. */
import { Component, useSyncExternalStore } from 'react';
import { ResearchView } from "./ResearchView.js";
import css from './overlay.module.css';
/** Keep render failures inside the overlay instead of abdicating the shell slot. */
class ResearchViewCrashBoundary extends Component {
    state = { error: null };
    static getDerivedStateFromError(error) { return { error }; }
    render() {
        if (this.state.error === null)
            return this.props.children;
        return _jsxs("div", { className: css.crash, role: "alert", children: [_jsx("h3", { children: this.props.t('overlay.crashTitle') }), _jsx("p", { children: this.props.t('overlay.crashHint') }), _jsx("code", { children: this.state.error.message }), _jsx("button", { type: "button", onClick: () => { this.setState({ error: null }); this.props.onReset(); }, children: this.props.t('overlay.crashBack') })] });
    }
}
/** Render the research workspace when the sidebar entry opens the overlay. */
export function DeepResearchOverlay({ t, ...face }) {
    const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen);
    const projectId = useSyncExternalStore(face.store.subscribe, face.store.getProjectId);
    if (!open)
        return null;
    return (_jsx("div", { className: css.overlay, "data-deepresearch-overlay": true, role: "dialog", "aria-modal": "true", "aria-label": t('view.deepResearch'), children: _jsx(ResearchViewCrashBoundary, { t: t, onReset: () => { face.store.setProjectId(null); }, children: _jsx(ResearchView, { t: t, ...face.api, projectId: projectId, onSelectProject: id => { face.store.setProjectId(id); }, onClose: () => { face.store.setOpen(false); } }) }) }));
}
//# sourceMappingURL=DeepResearchOverlay.js.map