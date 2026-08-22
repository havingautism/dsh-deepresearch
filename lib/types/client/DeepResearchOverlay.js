import { jsx as _jsx } from "react/jsx-runtime";
/** Frame-wide overlay hosting the Deep Research library and workspace. */
import { useSyncExternalStore } from 'react';
import { ResearchView } from "./ResearchView.js";
import css from './overlay.module.css';
/** Render the research workspace when the sidebar entry opens the overlay. */
export function DeepResearchOverlay({ t, ...face }) {
    const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen);
    if (!open)
        return null;
    return (_jsx("div", { className: css.overlay, "data-deepresearch-overlay": true, role: "dialog", "aria-modal": "true", "aria-label": t('view.deepResearch'), children: _jsx(ResearchView, { t: t, ...face.api }) }));
}
//# sourceMappingURL=DeepResearchOverlay.js.map