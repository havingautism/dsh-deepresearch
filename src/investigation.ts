/** Pure investigation helpers aligned with Codemini Scout / Evaluator. */

import type {
  ResearchCoverageStatus, ResearchCriterion, ResearchEvidence, ResearchProgress,
  ResearchProgressTool, ResearchProject, ResearchQuestion, ResearchQuestionId,
  ResearchScoutProgress, ResearchVerification,
} from './types.ts'
import { TOOLS_PER_CRITERION } from './budget.ts'

export const MAX_CANDIDATES_PER_CRITERION = 3
export const MAX_SOURCES_PER_CLAIM = 3
export const MAX_EVALUATOR_ARTIFACT_READS = 3
export const MAX_DEP_CLAIMS_PER_UPSTREAM = 8
export const MAX_DEP_CONTEXT_CHARS = 4000
export const MAX_URL_TEXT_FOR_VERIFY = 2500
export const SETTLED_QUESTION = new Set(['covered', 'partial', 'blocked'])
export const TERMINAL_COVERAGE = new Set(['covered', 'partial', 'blocked'])

export interface IndexedUrl {
  url: string
  text: string
  artifactId: string
}

export interface CandidateSource {
  url: string
  snippet: string
  artifactId: string
  toolText: string
}

export interface Candidate {
  id: string
  claim: string
  confidence: 'low' | 'medium' | 'high'
  riskFlags: string[]
  sources: CandidateSource[]
}

export interface CriterionReview {
  decision: ResearchVerification
  warnings: string[]
  verdicts: Array<{ candidateId: string; supported: boolean; relevantToCriterion: boolean; reason: string; sources: Array<{ url: string; snippet: string }> }>
  summary: string
  gap: string
}

export function clip(value: unknown, max = 8000): string {
  return String(value ?? '').trim().slice(0, max)
}

export function normalizeQuery(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

export function normalizeUrl(value: string): string {
  try {
    const url = new URL(String(value || '').trim())
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref$|source$|campaign$)/i.test(key)) url.searchParams.delete(key)
    }
    url.hash = ''
    return url.toString().replace(/\/$/, '')
  } catch {
    return String(value || '').trim().replace(/\/$/, '')
  }
}

export function appendToolBudgetNote(payload: unknown, used: number, cap: number): string {
  const remaining = Math.max(0, cap - used)
  const note = `[tools ${used}/${cap} used, ${remaining} left]`
  if (payload == null) return note
  if (typeof payload === 'string') return `${payload}\n\n${note}`
  try {
    return `${JSON.stringify(payload)}\n\n${note}`
  } catch {
    return `${String(payload)}\n\n${note}`
  }
}

export function indexSearchResult(urlIndex: Map<string, IndexedUrl>, sources: ReadonlyArray<{ url?: string; snippet?: string; title?: string }>): void {
  for (const source of sources) {
    const url = normalizeUrl(source.url ?? '')
    if (url === '') continue
    const text = clip([source.title, source.snippet].filter(Boolean).join('\n'), MAX_URL_TEXT_FOR_VERIFY)
    const prior = urlIndex.get(url)
    urlIndex.set(url, { url, text: clip(`${prior?.text ?? ''}\n${text}`, MAX_URL_TEXT_FOR_VERIFY), artifactId: prior?.artifactId ?? '' })
  }
}

export function indexFetchResult(urlIndex: Map<string, IndexedUrl>, url: string, text: string, artifactId: string): void {
  const normalized = normalizeUrl(url)
  if (normalized === '') return
  urlIndex.set(normalized, { url: normalized, text: clip(text, MAX_URL_TEXT_FOR_VERIFY), artifactId })
}

export function normalizeSubmittedCandidates(raw: unknown, criterionId: string): Candidate[] {
  const items = Array.isArray(raw) ? raw : []
  const out: Candidate[] = []
  for (const [index, item] of items.entries()) {
    if (item == null || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const claim = clip(record.claim, 800)
    if (claim === '') continue
    const rawSources = Array.isArray(record.sources) ? record.sources : []
    const sources: CandidateSource[] = []
    for (const source of rawSources) {
      if (source == null || typeof source !== 'object') continue
      const src = source as Record<string, unknown>
      const url = normalizeUrl(String(src.url ?? ''))
      if (url === '') continue
      sources.push({ url, snippet: clip(src.snippet, 1200), artifactId: clip(src.artifactId, 120), toolText: '' })
      if (sources.length >= MAX_SOURCES_PER_CLAIM) break
    }
    out.push({
      id: clip(record.id, 80) || `${criterionId}-c${index + 1}`,
      claim,
      confidence: record.confidence === 'high' || record.confidence === 'low' ? record.confidence : 'medium',
      riskFlags: [...new Set((Array.isArray(record.riskFlags) ? record.riskFlags : []).map(flag => clip(flag, 40)).filter(Boolean))],
      sources,
    })
    if (out.length >= MAX_CANDIDATES_PER_CRITERION) break
  }
  return out
}

export function gateCandidatesByUrl(candidates: Candidate[], urlIndex: Map<string, IndexedUrl>): { accepted: Candidate[]; rejected: Array<Candidate & { reason: string }> } {
  const accepted: Candidate[] = []
  const rejected: Array<Candidate & { reason: string }> = []
  for (const candidate of candidates) {
    const kept: CandidateSource[] = []
    const missing: string[] = []
    for (const source of candidate.sources) {
      const url = normalizeUrl(source.url)
      const indexed = urlIndex.get(url)
      if (indexed === undefined) {
        if (url !== '') missing.push(url)
        continue
      }
      kept.push({
        url,
        snippet: clip(source.snippet, 1200),
        artifactId: source.artifactId || indexed.artifactId,
        toolText: clip(indexed.text, MAX_URL_TEXT_FOR_VERIFY),
      })
    }
    if (kept.length === 0) {
      rejected.push({ ...candidate, reason: missing.length ? `URL(s) not seen in tool results: ${missing.join(', ')}` : 'No URLs provided' })
      continue
    }
    accepted.push({ ...candidate, sources: kept })
  }
  return { accepted, rejected }
}

export function parseJsonObject(raw: string): Record<string, unknown> | null {
  const text = raw.trim()
  if (text === '') return null
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced?.[1]?.trim() ?? text
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  try {
    const parsed: unknown = JSON.parse(body.slice(start, end + 1))
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}

export function parseCandidatesFromText(raw: string, criterionId: string): { candidates: Candidate[]; summary: string; gap: string } {
  const parsed = parseJsonObject(raw) ?? {}
  return {
    candidates: normalizeSubmittedCandidates(parsed.candidates, criterionId),
    summary: clip(parsed.summary, 1200),
    gap: clip(parsed.gap, 1200),
  }
}

export function parseReviewFromText(raw: string, candidates: Candidate[], fallbackSummary: string, fallbackGap: string): CriterionReview {
  const parsed = parseJsonObject(raw) ?? {}
  return normalizeReview(parsed, candidates, fallbackSummary, fallbackGap)
}

export function normalizeReview(args: Record<string, unknown>, candidates: Candidate[], fallbackSummary: string, fallbackGap: string): CriterionReview {
  const rawVerdicts = Array.isArray(args.verdicts) ? args.verdicts : []
  const byId = new Map<string, CriterionReview['verdicts'][number]>()
  for (const item of rawVerdicts) {
    if (item == null || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const candidateId = clip(record.candidateId ?? record.id, 80)
    if (candidateId === '') continue
    const attached: Array<{ url: string; snippet: string }> = []
    const rawSources = Array.isArray(record.sources) ? record.sources : []
    for (const source of rawSources) {
      if (source == null || typeof source !== 'object') continue
      const src = source as Record<string, unknown>
      const url = normalizeUrl(String(src.url ?? ''))
      if (url === '') continue
      attached.push({ url, snippet: clip(src.snippet, 1200) })
    }
    byId.set(candidateId, {
      candidateId,
      supported: Boolean(record.supported ?? record.accept ?? record.ok),
      relevantToCriterion: record.relevantToCriterion == null ? Boolean(record.relevant) : Boolean(record.relevantToCriterion),
      reason: clip(record.reason, 400),
      sources: attached,
    })
  }
  const decisionRaw = String(args.decision ?? 'WARNING').trim().toUpperCase()
  const decision: ResearchVerification = decisionRaw === 'PASS' || decisionRaw === 'FAIL' || decisionRaw === 'WARNING' ? decisionRaw : 'WARNING'
  return {
    decision,
    warnings: [...new Set((Array.isArray(args.warnings) ? args.warnings : [args.warnings]).map(item => clip(item, 240)).filter(Boolean))].slice(0, 4),
    verdicts: candidates.map(candidate => byId.get(candidate.id) ?? { candidateId: candidate.id, supported: false, relevantToCriterion: false, reason: 'Missing verdict', sources: [] }),
    summary: clip(args.summary, 1200) || fallbackSummary,
    gap: clip(args.gap, 1200) || fallbackGap,
  }
}

export function isAcceptedVerdict(verdict: CriterionReview['verdicts'][number] | undefined): boolean {
  return Boolean(verdict?.supported && verdict.relevantToCriterion)
}

export function criterionStatusFromReview(decision: ResearchVerification, acceptedCount: number): { status: ResearchCoverageStatus; reason: string } {
  if (decision === 'PASS') return { status: acceptedCount > 0 ? 'covered' : 'blocked', reason: acceptedCount > 0 ? 'Criterion passed review.' : 'Criterion passed but no accepted claims.' }
  if (decision === 'WARNING') return { status: acceptedCount > 0 ? 'partial' : 'blocked', reason: 'Criterion is usable but materially caveated.' }
  return { status: 'blocked', reason: 'Criterion failed verification.' }
}

export function questionStatusFromCoverage(criteria: readonly ResearchCriterion[], acceptedEvidenceCount: number): ResearchQuestion['status'] {
  if (criteria.length > 0 && criteria.every(item => item.status === 'covered')) return 'covered'
  if (acceptedEvidenceCount > 0 || criteria.some(item => item.status === 'partial')) return 'partial'
  return 'blocked'
}

export function deriveQuestionGaps(criteria: readonly ResearchCriterion[]): string[] {
  return criteria.filter(item => item.status !== 'covered').map(item => clip(item.gap, 1200)).filter(Boolean)
}

const LIMITATION_FALLBACK: Record<Exclude<ResearchCoverageStatus, 'covered'>, string> = {
  partial: 'Partially covered — remaining uncertainty on this criterion.',
  blocked: 'Rejected — verification did not accept this criterion.',
  conflicted: 'Sources conflict on this criterion.',
  missing: 'Not covered.',
}

/** One limitation derived from a criterion that was not fully covered, or a project-level note. */
export interface ResearchLimitationRow {
  readonly questionId: ResearchQuestionId | ''
  readonly criterionId: string
  readonly status: ResearchCoverageStatus | ''
  readonly text: string
}

/** Turn partial / blocked / conflicted / still-missing criteria into limitation rows. */
export function deriveLimitationRows(project: Pick<ResearchProject, 'questions' | 'limitations'>): ResearchLimitationRow[] {
  const rows: ResearchLimitationRow[] = []
  for (const question of project.questions) {
    for (const criterion of question.criteria) {
      if (criterion.status === 'covered') continue
      const text = [criterion.gap, criterion.warning].map(item => item.trim()).filter(Boolean).join(' ') || LIMITATION_FALLBACK[criterion.status]
      rows.push({ questionId: question.id, criterionId: criterion.id, status: criterion.status, text })
    }
  }
  for (const item of project.limitations) {
    const text = item.trim()
    if (!text || rows.some(row => row.text === text || text.endsWith(row.text))) continue
    rows.push({ questionId: '', criterionId: '', status: '', text })
  }
  return rows
}

export function collectLimitations(project: Pick<ResearchProject, 'questions' | 'limitations'>): string[] {
  return [...new Set(deriveLimitationRows(project).map(row => {
    if (row.criterionId === '') return row.text
    const question = project.questions.find(item => item.id === row.questionId)
    return `${question?.text ?? row.questionId} — ${row.criterionId} — ${row.text}`
  }))]
}

export function buildScoutHandoff(question: ResearchQuestion, evidence: readonly ResearchEvidence[]): string {
  const accepted = evidence.filter(item => item.questionId === question.id && item.status === 'accepted')
  const lines = [`Question: ${question.id} — ${question.text}`, '', 'Accepted Evidence:']
  if (accepted.length === 0) lines.push('- No accepted evidence yet.')
  for (const item of accepted) {
    lines.push(`- ${item.id}: ${item.claim}`)
    for (const source of evidenceSources(item)) {
      if (source.url) lines.push(`  URL: ${source.url}`)
      if (source.snippet) lines.push(`  snippet: ${source.snippet}`)
    }
    if (item.criterionIds.length) lines.push(`  Criteria: ${item.criterionIds.join(', ')}`)
  }
  lines.push('', 'Coverage:')
  for (const criterion of question.criteria) {
    lines.push(`- [${criterion.id}] ${criterion.status}`)
    if (criterion.verification) lines.push(`  verification: ${criterion.verification}`)
    if (criterion.summary) lines.push(`  summary: ${criterion.summary}`)
    if (criterion.gap) lines.push(`  gap: ${criterion.gap}`)
    if (criterion.warning) lines.push(`  warning: ${criterion.warning}`)
  }
  return lines.join('\n')
}

export function evidenceSources(item: ResearchEvidence): Array<{ url: string; snippet: string; artifactId?: string | undefined }> {
  if (item.sources.length > 0) return item.sources
  if (item.url || item.snippet) return [{ url: item.url ?? '', snippet: item.snippet }]
  return []
}

export function buildUpstreamDependencySummary(question: ResearchQuestion, evidence: readonly ResearchEvidence[]): string {
  const accepted = evidence.filter(item => item.questionId === question.id && item.status === 'accepted')
  const lines = [`### Upstream: ${clip(question.text || question.id, 240)}`, `Id: ${question.id}`, `Status: ${question.status}`, 'Confirmed claims:']
  if (accepted.length === 0) lines.push('- (none yet)')
  else {
    for (const item of accepted.slice(0, MAX_DEP_CLAIMS_PER_UPSTREAM)) lines.push(`- ${clip(item.claim, 240)}`)
    if (accepted.length > MAX_DEP_CLAIMS_PER_UPSTREAM) lines.push(`- … +${accepted.length - MAX_DEP_CLAIMS_PER_UPSTREAM} more`)
  }
  const notes: string[] = []
  for (const criterion of question.criteria) {
    if (criterion.summary) notes.push(`- [${criterion.id}] summary: ${clip(criterion.summary, 200)}`)
    if (criterion.gap) notes.push(`- [${criterion.id}] gap: ${clip(criterion.gap, 200)}`)
    if (criterion.warning) notes.push(`- [${criterion.id}] warning: ${clip(criterion.warning, 160)}`)
  }
  if (notes.length) {
    lines.push('Criterion notes:')
    lines.push(...notes.slice(0, 12))
  }
  return lines.join('\n')
}

export function collectDependencyContext(question: ResearchQuestion, questions: readonly ResearchQuestion[], evidence: readonly ResearchEvidence[]): { text: string; waitingOn: ResearchQuestionId[] } {
  const waitingOn = unresolvedDependencyIds(question, questions)
  if (question.dependsOn.length === 0) return { text: '', waitingOn }
  const sections: string[] = []
  for (const depId of question.dependsOn) {
    const upstream = questions.find(item => item.id === depId)
    sections.push(upstream === undefined ? `### Upstream: ${depId}\nStatus: missing` : buildUpstreamDependencySummary(upstream, evidence))
  }
  let body = [
    'Upstream dependency context (clues only — not verified evidence for this sub-question).',
    'Use it to avoid duplicate discovery searches and to focus follow-up investigation.',
    'Re-verify before treating any upstream claim as established for YOUR criterion.',
    '',
    ...sections,
  ].join('\n\n')
  if (body.length > MAX_DEP_CONTEXT_CHARS) body = `${body.slice(0, MAX_DEP_CONTEXT_CHARS - 1)}…`
  return { text: body, waitingOn }
}

export function isQuestionSettled(question: ResearchQuestion): boolean {
  if (SETTLED_QUESTION.has(question.status)) return true
  return question.criteria.length > 0 && question.criteria.every(item => TERMINAL_COVERAGE.has(item.status))
}

export function unresolvedDependencyIds(question: ResearchQuestion, questions: readonly ResearchQuestion[]): ResearchQuestionId[] {
  return question.dependsOn.filter(depId => {
    const upstream = questions.find(item => item.id === depId)
    return upstream === undefined || !isQuestionSettled(upstream)
  })
}

export function selectReadyWaveBatch(questions: readonly ResearchQuestion[], maxParallel = 3): { ready: ResearchQuestion[]; waiting: Array<{ question: ResearchQuestion; waitingOn: ResearchQuestionId[] }> } {
  const pending = questions.filter(question => !isQuestionSettled(question) && question.status !== 'failed')
  const ready = pending.filter(question => unresolvedDependencyIds(question, questions).length === 0)
  const cap = Math.max(1, Math.floor(maxParallel) || 1)
  const batch = (ready.length > 0 ? ready : pending.slice(0, 1)).slice(0, cap)
  const batchIds = new Set(batch.map(item => item.id))
  const waiting = pending.filter(question => !batchIds.has(question.id)).map(question => ({ question, waitingOn: unresolvedDependencyIds(question, questions) }))
  return { ready: batch, waiting }
}

export function emptyProgress(): ResearchProgress {
  return { running: 0, waiting: 0, scouts: [] }
}

export function emptyScoutProgress(questionId: ResearchQuestionId, extras: Partial<ResearchScoutProgress> = {}): ResearchScoutProgress {
  return {
    questionId,
    role: 'waiting',
    status: 'waiting',
    waitingOn: [],
    toolsUsed: 0,
    toolsCap: TOOLS_PER_CRITERION,
    activity: '',
    tools: [],
    scoutDraft: '',
    evaluatorDraft: '',
    activeCriterionId: '',
    activeCriterionText: '',
    dependencySummary: '',
    handoff: '',
    ...extras,
  }
}

export function mergeScoutProgress(progress: ResearchProgress, next: ResearchScoutProgress): ResearchProgress {
  const scouts = progress.scouts.filter(item => item.questionId !== next.questionId)
  scouts.push(next)
  return {
    running: scouts.filter(item => item.status === 'running' || item.status === 'verifying').length,
    waiting: scouts.filter(item => item.status === 'waiting').length,
    scouts,
  }
}

export function pushProgressTool(tools: readonly ResearchProgressTool[], tool: ResearchProgressTool): ResearchProgressTool[] {
  return [...tools, tool].slice(-8)
}

export function buildResearchWritingPack(project: ResearchProject): string {
  const lines = [`Main question: ${project.question}`]
  if (project.goal) lines.push(`Goal: ${project.goal}`)
  if (project.constraints) lines.push(`Constraints: ${project.constraints}`)
  lines.push(`Depth: ${project.depth}`, '')
  lines.push('Suggested outline (organize freely; do not invent facts):')
  if (project.questions.length === 0) lines.push('(no sub-questions)')
  else {
    project.questions.forEach((question, index) => lines.push(`${index + 1}. ${question.text}`))
    lines.push(`${project.questions.length + 1}. Limitations / unresolved gaps`)
  }
  lines.push('')
  const accepted = project.evidence.filter(item => item.status === 'accepted')
  for (const question of project.questions) {
    const qEvidence = accepted.filter(item => item.questionId === question.id)
    lines.push(`## ${question.id} — ${question.text}`.trim())
    lines.push(`Status: ${question.status}`)
    lines.push('Criteria:')
    for (const criterion of question.criteria) {
      lines.push(`- [${criterion.id}] [${criterion.status}]${criterion.verification ? ` verify=${criterion.verification}` : ''} ${criterion.text}`.trimEnd())
      if (criterion.summary) lines.push(`  summary: ${criterion.summary}`)
      if (criterion.gap) lines.push(`  gap: ${criterion.gap}`)
      if (criterion.warning) lines.push(`  warning: ${criterion.warning}`)
      for (const ev of qEvidence.filter(item => item.criterionIds.includes(criterion.id))) {
        lines.push(`  evidence ${ev.id} (${ev.confidence}): ${ev.claim}`)
        for (const source of evidenceSources(ev)) {
          if (source.snippet) lines.push(`    snippet: ${source.snippet}`)
          if (source.url) lines.push(`    url: ${source.url}`)
        }
      }
    }
    const unlinked = qEvidence.filter(ev => ev.criterionIds.length === 0 || !question.criteria.some(criterion => ev.criterionIds.includes(criterion.id)))
    if (unlinked.length) {
      lines.push('Additional accepted evidence:')
      for (const ev of unlinked) {
        lines.push(`- ${ev.id} (${ev.confidence}): ${ev.claim}`)
        for (const source of evidenceSources(ev)) {
          if (source.snippet) lines.push(`    snippet: ${source.snippet}`)
          if (source.url) lines.push(`    url: ${source.url}`)
        }
      }
    }
    const riskBits = [...question.gaps, ...question.criteria.filter(item => item.status !== 'covered').flatMap(item => [item.gap, item.warning])].map(text => String(text || '').trim()).filter(Boolean)
    if (riskBits.length) {
      lines.push('Risks / limitations for this section:')
      for (const bit of [...new Set(riskBits)].slice(0, 8)) lines.push(`- ${bit}`)
    }
    lines.push('')
  }
  return `${lines.join('\n').trim()}\n`
}
