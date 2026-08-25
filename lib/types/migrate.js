/** On-disk deepresearch storage unit upgrades before the domain opens. */
import { open, rename, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { deepResearchDomainSpec, researchProjectSchema } from "./spec.js";
export const DEEPRESEARCH_UNIT_NAME = deepResearchDomainSpec.name;
const EMPTY_PROGRESS = { running: 0, waiting: 0, scouts: [] };
/** Default JSON unit path used by the web profile (`dshHomePath('storages')`). */
export function defaultDeepResearchUnitPath(env = process.env) {
    return resolveDeepResearchUnitPath(undefined, env);
}
/** Resolve the on-disk unit file, optionally overriding the storages directory (tests). */
export function resolveDeepResearchUnitPath(storageRoot, env = process.env) {
    if (storageRoot !== undefined && storageRoot !== '') {
        return join(storageRoot, `${DEEPRESEARCH_UNIT_NAME}.json`);
    }
    const configured = env.DSH_HOME?.trim();
    const home = configured === undefined || configured === ''
        ? join(homedir(), '.dsh')
        : configured.startsWith('~')
            ? join(homedir(), configured.slice(1))
            : configured;
    return join(home, 'storages', `${DEEPRESEARCH_UNIT_NAME}.json`);
}
/** Default SQLite file used when the domain is routed to the sqlite backend. */
export function defaultDeepResearchSqlitePath(env = process.env) {
    return resolveDeepResearchUnitPath(undefined, env).replace(/\.json$/u, '.sqlite');
}
/**
 * Upgrade a stored deepresearch JSON unit up to the current domain version.
 * @param path - Absolute unit file path.
 * @param targetVersion - Expected domain version after migration.
 * @returns true when the file was rewritten.
 */
export async function migrateDeepResearchUnitFile(path, targetVersion = deepResearchDomainSpec.version) {
    let text;
    try {
        text = await readFileUtf8(path);
    }
    catch (error) {
        if (error.code === 'ENOENT')
            return false;
        throw error;
    }
    const document = parseRawUnit(text, path);
    if (document.unit.version >= targetVersion)
        return false;
    let current = document;
    while (current.unit.version < targetVersion) {
        if (current.unit.version === 2 && targetVersion >= 3)
            current = migrateV2ToV3(current);
        else
            throw new Error(`deepresearch: unsupported storage migration from v${current.unit.version} to v${targetVersion}`);
    }
    await writeAtomic(path, serializeRawUnit(current));
    return true;
}
/**
 * Copy leftover JSON projects into an empty domain table (JSON → SQLite cutover).
 * @param path - Migrated JSON unit path.
 * @param table - Opened projects table.
 * @returns number of imported projects.
 */
export async function importJsonProjectsIfEmpty(path, table) {
    if ([...table.entries()].length > 0)
        return 0;
    let text;
    try {
        text = await readFileUtf8(path);
    }
    catch (error) {
        if (error.code === 'ENOENT')
            return 0;
        throw error;
    }
    const document = parseRawUnit(text, path);
    const projects = document.tables.projects ?? {};
    let imported = 0;
    for (const raw of Object.values(projects)) {
        const project = researchProjectSchema.parse(raw);
        await table.put(project.id, project);
        imported += 1;
    }
    return imported;
}
function parseRawUnit(text, path) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (error) {
        throw new Error(`deepresearch: storage unit at ${path} is not valid JSON`, { cause: error });
    }
    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error(`deepresearch: storage unit at ${path} is not a JSON object`);
    }
    const { unit, global, tables } = parsed;
    if (typeof unit !== 'object' || unit === null ||
        unit.name !== DEEPRESEARCH_UNIT_NAME ||
        typeof unit.version !== 'number') {
        throw new Error(`deepresearch: storage unit at ${path} has a missing or foreign unit header`);
    }
    if (typeof tables !== 'object' || tables === null || Array.isArray(tables)) {
        throw new Error(`deepresearch: storage unit at ${path} has invalid tables`);
    }
    return {
        unit: {
            name: DEEPRESEARCH_UNIT_NAME,
            version: unit.version,
        },
        global: global ?? null,
        tables: tables,
    };
}
function migrateV2ToV3(document) {
    const projects = document.tables.projects ?? {};
    const migrated = {};
    for (const [key, raw] of Object.entries(projects)) {
        if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
            migrated[key] = raw;
            continue;
        }
        migrated[key] = migrateProjectV2ToV3(raw);
    }
    return {
        unit: { name: DEEPRESEARCH_UNIT_NAME, version: 3 },
        global: document.global,
        tables: { ...document.tables, projects: migrated },
    };
}
function migrateProjectV2ToV3(project) {
    const phase = typeof project.phase === 'string' ? project.phase : 'planning';
    const planConfirmed = project.planConfirmed === true;
    let runState = project.runState;
    let nextPhase = phase;
    if (runState !== 'idle' && runState !== 'running' && runState !== 'paused') {
        if (phase === 'aborted') {
            runState = 'paused';
            nextPhase = planConfirmed ? 'investigating' : 'planning';
        }
        else if (phase === 'done' || phase === 'failed' || phase === 'incomplete') {
            runState = 'idle';
        }
        else {
            runState = 'idle';
        }
    }
    return {
        ...project,
        phase: nextPhase,
        runState,
        progress: project.progress ?? EMPTY_PROGRESS,
    };
}
function serializeRawUnit(document) {
    return `${JSON.stringify({
        unit: document.unit,
        global: document.global,
        tables: document.tables,
    }, null, 2)}\n`;
}
async function readFileUtf8(path) {
    const handle = await open(path, 'r');
    try {
        return await handle.readFile('utf8');
    }
    finally {
        await handle.close();
    }
}
async function writeAtomic(path, data) {
    const tmp = join(dirname(path), `.${randomUUID()}.tmp`);
    try {
        const handle = await open(tmp, 'wx', 0o600);
        try {
            await handle.writeFile(data, 'utf8');
            await handle.sync();
        }
        finally {
            await handle.close();
        }
        await rename(tmp, path);
    }
    catch (error) {
        await rm(tmp, { force: true });
        throw error;
    }
}
//# sourceMappingURL=migrate.js.map