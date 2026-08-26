/** On-disk deepresearch storage unit upgrades before the domain opens. */

import { access, open, rename, rm } from 'node:fs/promises'
import { constants } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import { deepResearchDomainSpec, researchProjectSchema } from './spec.ts'
import type { ResearchId, ResearchProject } from './types.ts'

export const DEEPRESEARCH_UNIT_NAME = deepResearchDomainSpec.name
export const SHARED_SQLITE_FILENAME = 'dsh.sqlite'

const EMPTY_PROGRESS = { running: 0, waiting: 0, scouts: [] as unknown[] }

interface RawUnitDocument {
  unit: { name: string; version: number }
  global: unknown
  tables: Record<string, Record<string, unknown>>
}

/** Default JSON unit path used by the web profile (`dshHomePath('storages')`). */
export function defaultDeepResearchUnitPath(env: NodeJS.ProcessEnv = process.env): string {
  return resolveDeepResearchUnitPath(undefined, env)
}

/** Resolve the on-disk unit file, optionally overriding the storages directory (tests). */
export function resolveDeepResearchUnitPath(storageRoot?: string, env: NodeJS.ProcessEnv = process.env): string {
  if (storageRoot !== undefined && storageRoot !== '') {
    return join(storageRoot, `${DEEPRESEARCH_UNIT_NAME}.json`)
  }
  const configured = env.DSH_HOME?.trim()
  const home = configured === undefined || configured === ''
    ? join(homedir(), '.dsh')
    : configured.startsWith('~')
      ? join(homedir(), configured.slice(1))
      : configured
  return join(home, 'storages', `${DEEPRESEARCH_UNIT_NAME}.json`)
}

/** Canonical sqlite file both product plugins mount when the host has none. */
export function defaultSharedSqlitePath(env: NodeJS.ProcessEnv = process.env): string {
  return join(dirname(defaultDeepResearchUnitPath(env)), SHARED_SQLITE_FILENAME)
}

/** Leftover plugin-named sqlite from before the shared-file cutover. */
export function defaultDeepResearchSqlitePath(env: NodeJS.ProcessEnv = process.env): string {
  return resolveDeepResearchUnitPath(undefined, env).replace(/\.json$/u, '.sqlite')
}

export function legacyDeepResearchSqlitePath(sqlitePath: string): string {
  return join(dirname(sqlitePath), 'deepresearch.sqlite')
}

/** Read JSON records from one sqlite KV table, or [] when the file/table is missing. */
export function loadSqliteTableValues(path: string, unit: string, table: string): unknown[] {
  let db: DatabaseSync
  try {
    db = new DatabaseSync(path, { readOnly: true })
  } catch {
    return []
  }
  try {
    const physical = `u_${unit}_${table}`
    const found = db.prepare(
      'SELECT name FROM sqlite_master WHERE type = \'table\' AND name = ?',
    ).get(physical) as { name: string } | undefined
    if (found === undefined) return []
    const rows = db.prepare(`SELECT value FROM "${physical}"`).all() as Array<{ value: string }>
    return rows.map(row => JSON.parse(row.value) as unknown)
  } finally {
    db.close()
  }
}

/**
 * Copy leftover `deepresearch.sqlite` projects into an empty domain table.
 * Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
 */
export async function importLegacySqliteProjectsIfEmpty(
  legacyPath: string,
  liveSqlitePath: string,
  table: { entries(): Iterable<[ResearchId, ResearchProject]>; put(id: ResearchId, project: ResearchProject): Promise<void> },
): Promise<number> {
  if ([...table.entries()].length > 0) return 0
  if (resolve(legacyPath) === resolve(liveSqlitePath)) return 0
  try {
    await access(legacyPath, constants.R_OK)
  } catch {
    return 0
  }
  let imported = 0
  for (const raw of loadSqliteTableValues(legacyPath, DEEPRESEARCH_UNIT_NAME, 'projects')) {
    const project = researchProjectSchema.parse(raw)
    await table.put(project.id, project)
    imported += 1
  }
  return imported
}

/**
 * Upgrade a stored deepresearch JSON unit up to the current domain version.
 * @param path - Absolute unit file path.
 * @param targetVersion - Expected domain version after migration.
 * @returns true when the file was rewritten.
 */
export async function migrateDeepResearchUnitFile(
  path: string,
  targetVersion = deepResearchDomainSpec.version,
): Promise<boolean> {
  let text: string
  try {
    text = await readFileUtf8(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
  const document = parseRawUnit(text, path)
  if (document.unit.version >= targetVersion) return false
  let current = document
  while (current.unit.version < targetVersion) {
    if (current.unit.version === 2 && targetVersion >= 3) current = migrateV2ToV3(current)
    else throw new Error(`deepresearch: unsupported storage migration from v${current.unit.version} to v${targetVersion}`)
  }
  await writeAtomic(path, serializeRawUnit(current))
  return true
}

/**
 * Copy leftover JSON projects into an empty domain table (JSON → SQLite cutover).
 * @param path - Migrated JSON unit path.
 * @param table - Opened projects table.
 * @returns number of imported projects.
 */
export async function importJsonProjectsIfEmpty(
  path: string,
  table: { entries(): Iterable<[ResearchId, ResearchProject]>; put(id: ResearchId, project: ResearchProject): Promise<void> },
): Promise<number> {
  if ([...table.entries()].length > 0) return 0
  let text: string
  try {
    text = await readFileUtf8(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 0
    throw error
  }
  const document = parseRawUnit(text, path)
  const projects = document.tables.projects ?? {}
  let imported = 0
  for (const raw of Object.values(projects)) {
    const project = researchProjectSchema.parse(raw)
    await table.put(project.id, project)
    imported += 1
  }
  return imported
}

function parseRawUnit(text: string, path: string): RawUnitDocument {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    throw new Error(`deepresearch: storage unit at ${path} is not valid JSON`, { cause: error })
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`deepresearch: storage unit at ${path} is not a JSON object`)
  }
  const { unit, global, tables } = parsed as Record<string, unknown>
  if (
    typeof unit !== 'object' || unit === null ||
    (unit as Record<string, unknown>).name !== DEEPRESEARCH_UNIT_NAME ||
    typeof (unit as Record<string, unknown>).version !== 'number'
  ) {
    throw new Error(`deepresearch: storage unit at ${path} has a missing or foreign unit header`)
  }
  if (typeof tables !== 'object' || tables === null || Array.isArray(tables)) {
    throw new Error(`deepresearch: storage unit at ${path} has invalid tables`)
  }
  return {
    unit: {
      name: DEEPRESEARCH_UNIT_NAME,
      version: (unit as Record<string, unknown>).version as number,
    },
    global: global ?? null,
    tables: tables as Record<string, Record<string, unknown>>,
  }
}

function migrateV2ToV3(document: RawUnitDocument): RawUnitDocument {
  const projects = document.tables.projects ?? {}
  const migrated: Record<string, unknown> = {}
  for (const [key, raw] of Object.entries(projects)) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      migrated[key] = raw
      continue
    }
    migrated[key] = migrateProjectV2ToV3(raw as Record<string, unknown>)
  }
  return {
    unit: { name: DEEPRESEARCH_UNIT_NAME, version: 3 },
    global: document.global,
    tables: { ...document.tables, projects: migrated },
  }
}

function migrateProjectV2ToV3(project: Record<string, unknown>): Record<string, unknown> {
  const phase = typeof project.phase === 'string' ? project.phase : 'planning'
  const planConfirmed = project.planConfirmed === true
  let runState = project.runState
  let nextPhase = phase
  if (runState !== 'idle' && runState !== 'running' && runState !== 'paused') {
    if (phase === 'aborted') {
      runState = 'paused'
      nextPhase = planConfirmed ? 'investigating' : 'planning'
    } else if (phase === 'done' || phase === 'failed' || phase === 'incomplete') {
      runState = 'idle'
    } else {
      runState = 'idle'
    }
  }
  return {
    ...project,
    phase: nextPhase,
    runState,
    progress: project.progress ?? EMPTY_PROGRESS,
  }
}

function serializeRawUnit(document: RawUnitDocument): string {
  return `${JSON.stringify({
    unit: document.unit,
    global: document.global,
    tables: document.tables,
  }, null, 2)}\n`
}

async function readFileUtf8(path: string): Promise<string> {
  const handle = await open(path, 'r')
  try {
    return await handle.readFile('utf8')
  } finally {
    await handle.close()
  }
}

async function writeAtomic(path: string, data: string): Promise<void> {
  const tmp = join(dirname(path), `.${randomUUID()}.tmp`)
  try {
    const handle = await open(tmp, 'wx', 0o600)
    try {
      await handle.writeFile(data, 'utf8')
      await handle.sync()
    } finally {
      await handle.close()
    }
    await rename(tmp, path)
  } catch (error) {
    await rm(tmp, { force: true })
    throw error
  }
}
