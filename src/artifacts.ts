/** On-disk fetch bodies for Scout / Evaluator. Not stored in the project JSON. */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'

/** Default root under the user's DSH home. */
export function researchArtifactsRoot(rootDir = ''): string {
  const override = rootDir.trim()
  if (override !== '') return override
  return join(homedir(), '.dsh', 'research-artifacts')
}

/** Directory for one criterion's artifacts. */
export function artifactDirFor(projectId: string, questionId: string, criterionId: string, rootDir = ''): string {
  return join(researchArtifactsRoot(rootDir), projectId, questionId, criterionId)
}

/** Directory for one project. */
export function projectArtifactsDir(projectId: string, rootDir = ''): string {
  return join(researchArtifactsRoot(rootDir), projectId)
}

const MAX_STORE_CHARS = 6000

export interface PersistedArtifact {
  readonly artifactId: string
  readonly url: string
  readonly preview: string
  readonly text: string
}

/** Persist a fetched page body and return the artifact id. */
export async function persistArtifact(scope: { projectId: string; questionId: string; criterionId: string; url: string; body: string; rootDir?: string }): Promise<PersistedArtifact> {
  const text = scope.body.slice(0, MAX_STORE_CHARS)
  const artifactId = `art_${randomUUID()}`
  const dir = artifactDirFor(scope.projectId, scope.questionId, scope.criterionId, scope.rootDir)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, `${artifactId}.txt`), text, 'utf8')
  await writeFile(join(dir, `${artifactId}.url`), scope.url, 'utf8')
  return { artifactId, url: scope.url, preview: text.slice(0, 2500), text }
}

/** Read a slice of a persisted artifact. Throws when the id is unknown. */
export async function readArtifact(scope: { projectId: string; questionId: string; criterionId: string; artifactId: string; offset?: number; maxChars?: number; rootDir?: string }): Promise<{ artifactId: string; text: string; offset: number; total: number }> {
  const artifactId = scope.artifactId.trim()
  if (artifactId === '') throw new Error('artifactId is required')
  const dir = artifactDirFor(scope.projectId, scope.questionId, scope.criterionId, scope.rootDir)
  const fullText = await readFile(join(dir, `${artifactId}.txt`), 'utf8')
  const offset = Math.max(0, Math.floor(scope.offset ?? 0))
  const maxChars = Math.min(4000, Math.max(1, Math.floor(scope.maxChars ?? 4000)))
  return { artifactId, text: fullText.slice(offset, offset + maxChars), offset, total: fullText.length }
}

/** Best-effort remove one criterion's artifacts. */
export async function cleanupCriterionArtifacts(projectId: string, questionId: string, criterionId: string, rootDir = ''): Promise<void> {
  const dir = artifactDirFor(projectId, questionId, criterionId, rootDir)
  await rm(dir, { recursive: true, force: true }).catch(() => undefined)
  await rm(dirname(dir), { recursive: false }).catch(() => undefined)
}

/** Best-effort remove every artifact for a project. */
export async function cleanupProjectArtifacts(projectId: string, rootDir = ''): Promise<void> {
  await rm(projectArtifactsDir(projectId, rootDir), { recursive: true, force: true }).catch(() => undefined)
}
