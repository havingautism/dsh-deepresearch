import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Sidebar foot control that opens the global Deep Research workspace. */
import { useSyncExternalStore } from 'react';
import { IconSparkle16 as IconBolt } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './sidebar-entry.module.css';
/** Render the sidebar launch button for the frame-wide research overlay. */
export function DeepResearchSidebarEntry({ wide, t, ...face }) {
    const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen);
    return (_jsx("div", { className: wide ? css.layer : `${css.layer} ${css.rail}`, children: _jsxs("button", { type: "button", className: css.badge, "data-active": open || undefined, "aria-pressed": open, "aria-label": t('view.deepResearch'), onClick: () => { face.store.setOpen(!open); }, children: [_jsx(IconBolt, { size: 16 }), wide ? _jsx("span", { className: css.badgeLabel, children: t('view.deepResearch') }) : null] }) }));
}
//# sourceMappingURL=DeepResearchSidebarEntry.js.map