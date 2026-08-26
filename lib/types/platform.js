/** Mount shared DSH sqlite/fetch once, then route this plugin's domain onto them. */
import { join } from 'node:path';
import * as StorageSqlite from '@deepseek-ai/dsh-storage-sqlite';
import * as WebFetchHttp from '@deepseek-ai/dsh-web-fetch-http';
import { defaultDeepResearchSqlitePath } from "./migrate.js";
function sqliteMounted(ctx) {
    return ctx.storage.backend.names().includes('sqlite');
}
function canMountHttpFetch(ctx) {
    const web = ctx.get('web');
    return web !== undefined && typeof web.registerFetchProvider === 'function';
}
function isAlreadyMountedError(error) {
    const text = error instanceof Error ? `${error.name} ${error.message}` : String(error);
    return /already registered|duplicate-backend|WEB_DUPLICATE_PROVIDER/i.test(text);
}
/** Sqlite file for this plugin when it is the one that mounts the backend. */
export function sqlitePathFor(config, env = process.env) {
    const root = config.storageRoot?.trim();
    if (root !== undefined && root !== '')
        return join(root, 'deepresearch.sqlite');
    return defaultDeepResearchSqlitePath(env);
}
/** Register the sqlite backend when the host has not already done so. */
export async function ensureSqliteBackend(ctx, path) {
    if (sqliteMounted(ctx))
        return;
    try {
        await ctx.plugin(StorageSqlite, { path });
    }
    catch (error) {
        if (sqliteMounted(ctx) || isAlreadyMountedError(error))
            return;
        throw error;
    }
}
/** Register the HTTP fetch provider when `ctx.web` exists and has none. */
export async function ensureHttpFetchProvider(ctx) {
    if (!canMountHttpFetch(ctx))
        return;
    try {
        await ctx.plugin(WebFetchHttp);
    }
    catch (error) {
        if (isAlreadyMountedError(error))
            return;
        throw error;
    }
}
/** Send one storage-domain name to sqlite without replacing other routes. */
export function routeDomainToSqlite(ctx, domain) {
    const facility = ctx.storageDomain;
    const routes = facility.config.routes ?? (facility.config.routes = {});
    routes[domain] = 'sqlite';
}
/** Ensure sqlite/fetch exist, then route this plugin's domain to sqlite. */
export async function ensurePluginPlatform(ctx, options) {
    await ensureSqliteBackend(ctx, options.sqlitePath);
    routeDomainToSqlite(ctx, options.domain);
    await ensureHttpFetchProvider(ctx);
}
//# sourceMappingURL=platform.js.map