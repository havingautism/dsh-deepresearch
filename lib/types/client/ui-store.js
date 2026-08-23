/** Root-scoped overlay route: open/close plus the selected project, synced to the URL hash. */
const HASH_ROOT = '#deepresearch';
/** Parse `#deepresearch` and `#deepresearch/<id>` from the current location. */
export function readDeepResearchRoute(hash = typeof window === 'undefined' ? '' : window.location.hash) {
    if (hash === HASH_ROOT || hash === `${HASH_ROOT}/`)
        return { open: true, projectId: null };
    if (hash.startsWith(`${HASH_ROOT}/`)) {
        const projectId = decodeURIComponent(hash.slice(HASH_ROOT.length + 1));
        return { open: true, projectId: projectId === '' ? null : projectId };
    }
    return { open: false, projectId: null };
}
function hashFor(route) {
    if (!route.open)
        return '';
    return route.projectId === null ? HASH_ROOT : `${HASH_ROOT}/${encodeURIComponent(route.projectId)}`;
}
function writeHash(route, mode) {
    if (typeof window === 'undefined')
        return;
    const next = hashFor(route);
    if (window.location.hash === next)
        return;
    const url = `${window.location.pathname}${window.location.search}${next}`;
    if (mode === 'push')
        window.history.pushState(null, '', url);
    else
        window.history.replaceState(null, '', url);
}
/** Prefer the project id encoded in the current hash when the overlay is being opened. */
function projectIdFromHashOrCurrent(current) {
    const routed = readDeepResearchRoute();
    return routed.open ? routed.projectId : current;
}
/** Create one overlay store shared by the sidebar entry and shell overlay. */
export function createDeepResearchUiStore() {
    const initial = readDeepResearchRoute();
    let open = initial.open;
    let projectId = initial.projectId;
    const listeners = new Set();
    let writing = false;
    const emit = () => { for (const listener of listeners)
        listener(); };
    const applyRoute = (next, mode) => {
        const changed = open !== next.open || projectId !== next.projectId;
        open = next.open;
        projectId = next.open ? next.projectId : null;
        if (mode !== 'silent') {
            writing = true;
            writeHash({ open, projectId }, mode);
            writing = false;
        }
        if (changed)
            emit();
    };
    if (typeof window !== 'undefined') {
        const syncFromLocation = () => {
            if (writing)
                return;
            applyRoute(readDeepResearchRoute(), 'silent');
        };
        window.addEventListener('popstate', syncFromLocation);
        window.addEventListener('hashchange', syncFromLocation);
    }
    return {
        getOpen: () => open,
        getProjectId: () => projectId,
        setOpen: (next) => {
            if (!next) {
                if (!open)
                    return;
                applyRoute({ open: false, projectId: null }, 'push');
                return;
            }
            const nextProjectId = projectIdFromHashOrCurrent(projectId);
            if (open && nextProjectId === projectId)
                return;
            applyRoute({ open: true, projectId: nextProjectId }, open ? 'replace' : 'push');
        },
        setProjectId: (id) => {
            if (open && id === projectId)
                return;
            applyRoute({ open: true, projectId: id }, 'push');
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => { listeners.delete(listener); };
        },
    };
}
//# sourceMappingURL=ui-store.js.map