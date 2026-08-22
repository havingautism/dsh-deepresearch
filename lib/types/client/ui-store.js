/** Root-scoped open/close state for the sidebar-launched research overlay. */
/** Create one overlay store shared by the sidebar entry and shell overlay. */
export function createDeepResearchUiStore() {
    let open = false;
    const listeners = new Set();
    return {
        getOpen: () => open,
        setOpen: (next) => {
            if (open === next)
                return;
            open = next;
            for (const listener of listeners)
                listener();
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => { listeners.delete(listener); };
        },
    };
}
//# sourceMappingURL=ui-store.js.map