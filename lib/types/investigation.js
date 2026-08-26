/** Pure investigation helpers aligned with Codemini Scout / Evaluator. */
import { TOOLS_PER_CRITERION } from "./budget.js";
export const MAX_CANDIDATES_PER_CRITERION = 3;
export const MAX_SOURCES_PER_CLAIM = 3;
export const MAX_EVALUATOR_ARTIFACT_READS = 3;
export const MAX_DEP_CLAIMS_PER_UPSTREAM = 8;
export const MAX_DEP_CONTEXT_CHARS = 4000;
export const MAX_URL_TEXT_FOR_VERIFY = 2500;
export const SETTLED_QUESTION = new Set(['covered', 'partial', 'blocked']);
export const TERMINAL_COVERAGE = new Set(['covered', 'partial', 'blocked']);
export function clip(value, max = 8000) {
    return String(value ?? '').trim().slice(0, max);
}
export function normalizeQuery(value) {
    return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
export function normalizeUrl(value) {
    try {
        const url = new URL(String(value || '').trim());
        for (const key of [...url.searchParams.keys()]) {
            if (/^(utm_|ref$|source$|campaign$)/i.test(key))
                url.searchParams.delete(key);
        }
        url.hash = '';
        return url.toString().replace(/\/$/, '');
    }
    catch {
        return String(value || '').trim().replace(/\/$/, '');
    }
}
/** Keep the first occurrence of each normalized URL, up to the per-claim cap. */
export function uniqueSources(sources, max = MAX_SOURCES_PER_CLAIM) {
    const out = [];
    const seen = new Set();
    for (const source of sources) {
        const url = normalizeUrl(source.url);
        if (url === '' || seen.has(url))
            continue;
        seen.add(url);
        out.push(url === source.url ? source : { ...source, url });
        if (out.length >= max)
            break;
    }
    return out;
}
export function appendToolBudgetNote(payload, used, cap) {
    const remaining = Math.max(0, cap - used);
    const note = `[tools ${used}/${cap} used, ${remaining} left]`;
    if (payload == null)
        return note;
    if (typeof payload === 'string')
        return `${payload}\n\n${note}`;
    try {
        return `${JSON.stringify(payload)}\n\n${note}`;
    }
    catch {
        return `${String(payload)}\n\n${note}`;
    }
}
export function indexSearchResult(urlIndex, sources) {
    for (const source of sources) {
        const url = normalizeUrl(source.url ?? '');
        if (url === '')
            continue;
        const text = clip([source.title, source.snippet].filter(Boolean).join('\n'), MAX_URL_TEXT_FOR_VERIFY);
        const prior = urlIndex.get(url);
        urlIndex.set(url, { url, text: clip(`${prior?.text ?? ''}\n${text}`, MAX_URL_TEXT_FOR_VERIFY), artifactId: prior?.artifactId ?? '' });
    }
}
export function indexFetchResult(urlIndex, url, text, artifactId, finalUrl) {
    const requested = normalizeUrl(url);
    const landed = normalizeUrl(finalUrl || url);
    const preview = clip(text, MAX_URL_TEXT_FOR_VERIFY);
    const write = (key) => {
        if (key === '')
            return;
        urlIndex.set(key, { url: key, text: preview, artifactId });
    };
    write(landed || requested);
    if (requested !== '' && requested !== landed)
        write(requested);
}
export function normalizeSubmittedCandidates(raw, criterionId) {
    const items = Array.isArray(raw) ? raw : [];
    const out = [];
    for (const [index, item] of items.entries()) {
        if (item == null || typeof item !== 'object')
            continue;
        const record = item;
        const claim = clip(record.claim, 800);
        if (claim === '')
            continue;
        const rawSources = Array.isArray(record.sources) ? record.sources : [];
        const sources = [];
        for (const source of rawSources) {
            if (source == null || typeof source !== 'object')
                continue;
            const src = source;
            const url = normalizeUrl(String(src.url ?? ''));
            if (url === '')
                continue;
            sources.push({ url, snippet: clip(src.snippet, 1200), artifactId: clip(src.artifactId, 120), toolText: '' });
        }
        out.push({
            id: clip(record.id, 80) || `${criterionId}-c${index + 1}`,
            claim,
            confidence: record.confidence === 'high' || record.confidence === 'low' ? record.confidence : 'medium',
            riskFlags: [...new Set((Array.isArray(record.riskFlags) ? record.riskFlags : []).map(flag => clip(flag, 40)).filter(Boolean))],
            sources: uniqueSources(sources),
        });
        if (out.length >= MAX_CANDIDATES_PER_CRITERION)
            break;
    }
    return out;
}
export function gateCandidatesByUrl(candidates, urlIndex) {
    const accepted = [];
    const rejected = [];
    for (const candidate of candidates) {
        const kept = [];
        const missing = [];
        for (const source of candidate.sources) {
            const url = normalizeUrl(source.url);
            const indexed = urlIndex.get(url);
            if (indexed === undefined) {
                if (url !== '')
                    missing.push(url);
                continue;
            }
            kept.push({
                url,
                snippet: clip(source.snippet, 1200),
                artifactId: source.artifactId || indexed.artifactId,
                toolText: clip(indexed.text, MAX_URL_TEXT_FOR_VERIFY),
            });
        }
        if (kept.length === 0) {
            rejected.push({ ...candidate, reason: missing.length ? `URL(s) not seen in tool results: ${missing.join(', ')}` : 'No URLs provided' });
            continue;
        }
        accepted.push({ ...candidate, sources: uniqueSources(kept) });
    }
    return { accepted, rejected };
}
export function parseJsonObject(raw) {
    const text = raw.trim();
    if (text === '')
        return null;
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const body = fenced?.[1]?.trim() ?? text;
    const start = body.indexOf('{');
    const end = body.lastIndexOf('}');
    if (start < 0 || end <= start)
        return null;
    try {
        const parsed = JSON.parse(body.slice(start, end + 1));
        return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    }
    catch {
        return null;
    }
}
export function parseCandidatesFromText(raw, criterionId) {
    const parsed = parseJsonObject(raw) ?? {};
    return {
        candidates: normalizeSubmittedCandidates(parsed.candidates, criterionId),
        summary: clip(parsed.summary, 1200),
        gap: clip(parsed.gap, 1200),
    };
}
export function parseReviewFromText(raw, candidates, fallbackSummary, fallbackGap) {
    const parsed = parseJsonObject(raw) ?? {};
    return normalizeReview(parsed, candidates, fallbackSummary, fallbackGap);
}
export function normalizeReview(args, candidates, fallbackSummary, fallbackGap) {
    const rawVerdicts = Array.isArray(args.verdicts) ? args.verdicts : [];
    const byId = new Map();
    for (const item of rawVerdicts) {
        if (item == null || typeof item !== 'object')
            continue;
        const record = item;
        const candidateId = clip(record.candidateId ?? record.id, 80);
        if (candidateId === '')
            continue;
        const attached = [];
        const rawSources = Array.isArray(record.sources) ? record.sources : [];
        for (const source of rawSources) {
            if (source == null || typeof source !== 'object')
                continue;
            const src = source;
            const url = normalizeUrl(String(src.url ?? ''));
            if (url === '')
                continue;
            attached.push({ url, snippet: clip(src.snippet, 1200) });
        }
        byId.set(candidateId, {
            candidateId,
            supported: Boolean(record.supported ?? record.accept ?? record.ok),
            relevantToCriterion: record.relevantToCriterion == null ? Boolean(record.relevant) : Boolean(record.relevantToCriterion),
            reason: clip(record.reason, 400),
            sources: uniqueSources(attached),
        });
    }
    const decisionRaw = String(args.decision ?? 'WARNING').trim().toUpperCase();
    const decision = decisionRaw === 'PASS' || decisionRaw === 'FAIL' || decisionRaw === 'WARNING' ? decisionRaw : 'WARNING';
    return {
        decision,
        warnings: [...new Set((Array.isArray(args.warnings) ? args.warnings : [args.warnings]).map(item => clip(item, 240)).filter(Boolean))].slice(0, 4),
        verdicts: candidates.map(candidate => byId.get(candidate.id) ?? { candidateId: candidate.id, supported: false, relevantToCriterion: false, reason: 'Missing verdict', sources: [] }),
        summary: clip(args.summary, 1200) || fallbackSummary,
        gap: clip(args.gap, 1200) || fallbackGap,
    };
}
export function isAcceptedVerdict(verdict) {
    return Boolean(verdict?.supported && verdict.relevantToCriterion);
}
export function criterionStatusFromReview(decision, acceptedCount) {
    if (decision === 'PASS')
        return { status: acceptedCount > 0 ? 'covered' : 'blocked', reason: acceptedCount > 0 ? 'Criterion passed review.' : 'Criterion passed but no accepted claims.' };
    if (decision === 'WARNING')
        return { status: acceptedCount > 0 ? 'partial' : 'blocked', reason: 'Criterion is usable but materially caveated.' };
    return { status: 'blocked', reason: 'Criterion failed verification.' };
}
export function questionStatusFromCoverage(criteria, acceptedEvidenceCount) {
    if (criteria.length > 0 && criteria.every(item => item.status === 'covered'))
        return 'covered';
    if (acceptedEvidenceCount > 0 || criteria.some(item => item.status === 'partial'))
        return 'partial';
    return 'blocked';
}
export function deriveQuestionGaps(criteria) {
    return criteria.filter(item => item.status !== 'covered').map(item => clip(item.gap, 1200)).filter(Boolean);
}
const LIMITATION_FALLBACK = {
    partial: 'Partially covered — remaining uncertainty on this criterion.',
    blocked: 'Rejected — verification did not accept this criterion.',
    conflicted: 'Sources conflict on this criterion.',
    missing: 'Not covered.',
};
/** Turn partial / blocked / conflicted / still-missing criteria into limitation rows. */
export function deriveLimitationRows(project) {
    const rows = [];
    for (const question of project.questions) {
        for (const criterion of question.criteria) {
            if (criterion.status === 'covered')
                continue;
            const text = [criterion.gap, criterion.warning].map(item => item.trim()).filter(Boolean).join(' ') || LIMITATION_FALLBACK[criterion.status];
            rows.push({ questionId: question.id, criterionId: criterion.id, status: criterion.status, text });
        }
    }
    for (const item of project.limitations) {
        const text = item.trim();
        if (!text || rows.some(row => row.text === text || text.endsWith(row.text)))
            continue;
        rows.push({ questionId: '', criterionId: '', status: '', text });
    }
    return rows;
}
export function collectLimitations(project) {
    return [...new Set(deriveLimitationRows(project).map(row => {
            if (row.criterionId === '')
                return row.text;
            const question = project.questions.find(item => item.id === row.questionId);
            return `${question?.text ?? row.questionId} — ${row.criterionId} — ${row.text}`;
        }))];
}
export function buildScoutHandoff(question, evidence) {
    const accepted = evidence.filter(item => item.questionId === question.id && item.status === 'accepted');
    const lines = [`Question: ${question.id} — ${question.text}`, '', 'Accepted Evidence:'];
    if (accepted.length === 0)
        lines.push('- No accepted evidence yet.');
    for (const item of accepted) {
        lines.push(`- ${item.id}: ${item.claim}`);
        for (const source of evidenceSources(item)) {
            if (source.url)
                lines.push(`  URL: ${source.url}`);
            if (source.snippet)
                lines.push(`  snippet: ${source.snippet}`);
        }
        if (item.criterionIds.length)
            lines.push(`  Criteria: ${item.criterionIds.join(', ')}`);
    }
    lines.push('', 'Coverage:');
    for (const criterion of question.criteria) {
        lines.push(`- [${criterion.id}] ${criterion.status}`);
        if (criterion.verification)
            lines.push(`  verification: ${criterion.verification}`);
        if (criterion.summary)
            lines.push(`  summary: ${criterion.summary}`);
        if (criterion.gap)
            lines.push(`  gap: ${criterion.gap}`);
        if (criterion.warning)
            lines.push(`  warning: ${criterion.warning}`);
    }
    return lines.join('\n');
}
export function evidenceSources(item) {
    if (item.sources.length > 0)
        return uniqueSources(item.sources);
    if (item.url || item.snippet)
        return [{ url: item.url ?? '', snippet: item.snippet }];
    return [];
}
export function buildUpstreamDependencySummary(question, evidence) {
    const accepted = evidence.filter(item => item.questionId === question.id && item.status === 'accepted');
    const lines = [`### Upstream: ${clip(question.text || question.id, 240)}`, `Id: ${question.id}`, `Status: ${question.status}`, 'Confirmed claims:'];
    if (accepted.length === 0)
        lines.push('- (none yet)');
    else {
        for (const item of accepted.slice(0, MAX_DEP_CLAIMS_PER_UPSTREAM))
            lines.push(`- ${clip(item.claim, 240)}`);
        if (accepted.length > MAX_DEP_CLAIMS_PER_UPSTREAM)
            lines.push(`- … +${accepted.length - MAX_DEP_CLAIMS_PER_UPSTREAM} more`);
    }
    const notes = [];
    for (const criterion of question.criteria) {
        if (criterion.summary)
            notes.push(`- [${criterion.id}] summary: ${clip(criterion.summary, 200)}`);
        if (criterion.gap)
            notes.push(`- [${criterion.id}] gap: ${clip(criterion.gap, 200)}`);
        if (criterion.warning)
            notes.push(`- [${criterion.id}] warning: ${clip(criterion.warning, 160)}`);
    }
    if (notes.length) {
        lines.push('Criterion notes:');
        lines.push(...notes.slice(0, 12));
    }
    return lines.join('\n');
}
export function collectDependencyContext(question, questions, evidence) {
    const waitingOn = unresolvedDependencyIds(question, questions);
    if (question.dependsOn.length === 0)
        return { text: '', waitingOn };
    const sections = [];
    for (const depId of question.dependsOn) {
        const upstream = questions.find(item => item.id === depId);
        sections.push(upstream === undefined ? `### Upstream: ${depId}\nStatus: missing` : buildUpstreamDependencySummary(upstream, evidence));
    }
    let body = [
        'Upstream dependency context (clues only — not verified evidence for this sub-question).',
        'Use it to avoid duplicate discovery searches and to focus follow-up investigation.',
        'Re-verify before treating any upstream claim as established for YOUR criterion.',
        '',
        ...sections,
    ].join('\n\n');
    if (body.length > MAX_DEP_CONTEXT_CHARS)
        body = `${body.slice(0, MAX_DEP_CONTEXT_CHARS - 1)}…`;
    return { text: body, waitingOn };
}
export function isQuestionSettled(question) {
    if (SETTLED_QUESTION.has(question.status))
        return true;
    return question.criteria.length > 0 && question.criteria.every(item => TERMINAL_COVERAGE.has(item.status));
}
export function unresolvedDependencyIds(question, questions) {
    return question.dependsOn.filter(depId => {
        const upstream = questions.find(item => item.id === depId);
        return upstream === undefined || !isQuestionSettled(upstream);
    });
}
export function selectReadyWaveBatch(questions, maxParallel = 3) {
    const pending = questions.filter(question => !isQuestionSettled(question) && question.status !== 'failed');
    const ready = pending.filter(question => unresolvedDependencyIds(question, questions).length === 0);
    const cap = Math.max(1, Math.floor(maxParallel) || 1);
    const batch = (ready.length > 0 ? ready : pending.slice(0, 1)).slice(0, cap);
    const batchIds = new Set(batch.map(item => item.id));
    const waiting = pending.filter(question => !batchIds.has(question.id)).map(question => ({ question, waitingOn: unresolvedDependencyIds(question, questions) }));
    return { ready: batch, waiting };
}
/** Keep Scout/Evaluator draft panes for model prose; drop tool-log and JSON payloads. */
export function readableRoleDraft(text) {
    const value = text.trim();
    if (value === '')
        return '';
    if (/^(Search|Fetch|Read artifact|Evaluator read)\b/i.test(value))
        return '';
    if (value.startsWith('{') || value.startsWith('['))
        return '';
    if (/^\s*<(?:tool|function|invoke)\b/i.test(value))
        return '';
    return value.slice(0, 800);
}
export function emptyProgress() {
    return { running: 0, waiting: 0, scouts: [] };
}
export function emptyScoutProgress(questionId, extras = {}) {
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
    };
}
export function mergeScoutProgress(progress, next) {
    const scouts = progress.scouts.filter(item => item.questionId !== next.questionId);
    scouts.push(next);
    return {
        running: scouts.filter(item => item.status === 'running' || item.status === 'verifying').length,
        waiting: scouts.filter(item => item.status === 'waiting').length,
        scouts,
    };
}
export function pushProgressTool(tools, tool) {
    return [...tools, tool].slice(-8);
}
export function buildResearchWritingPack(project) {
    const lines = [`Main question: ${project.question}`];
    if (project.goal)
        lines.push(`Goal: ${project.goal}`);
    if (project.constraints)
        lines.push(`Constraints: ${project.constraints}`);
    lines.push(`Depth: ${project.depth}`, '');
    lines.push('Suggested outline (organize freely; do not invent facts):');
    if (project.questions.length === 0)
        lines.push('(no sub-questions)');
    else {
        project.questions.forEach((question, index) => lines.push(`${index + 1}. ${question.text}`));
        lines.push(`${project.questions.length + 1}. Limitations / unresolved gaps`);
    }
    lines.push('');
    const accepted = project.evidence.filter(item => item.status === 'accepted');
    for (const question of project.questions) {
        const qEvidence = accepted.filter(item => item.questionId === question.id);
        lines.push(`## ${question.id} — ${question.text}`.trim());
        lines.push(`Status: ${question.status}`);
        lines.push('Criteria:');
        for (const criterion of question.criteria) {
            lines.push(`- [${criterion.id}] [${criterion.status}]${criterion.verification ? ` verify=${criterion.verification}` : ''} ${criterion.text}`.trimEnd());
            if (criterion.summary)
                lines.push(`  summary: ${criterion.summary}`);
            if (criterion.gap)
                lines.push(`  gap: ${criterion.gap}`);
            if (criterion.warning)
                lines.push(`  warning: ${criterion.warning}`);
            for (const ev of qEvidence.filter(item => item.criterionIds.includes(criterion.id))) {
                lines.push(`  evidence ${ev.id} (${ev.confidence}): ${ev.claim}`);
                for (const source of evidenceSources(ev)) {
                    if (source.snippet)
                        lines.push(`    snippet: ${source.snippet}`);
                    if (source.url)
                        lines.push(`    url: ${source.url}`);
                }
            }
        }
        const unlinked = qEvidence.filter(ev => ev.criterionIds.length === 0 || !question.criteria.some(criterion => ev.criterionIds.includes(criterion.id)));
        if (unlinked.length) {
            lines.push('Additional accepted evidence:');
            for (const ev of unlinked) {
                lines.push(`- ${ev.id} (${ev.confidence}): ${ev.claim}`);
                for (const source of evidenceSources(ev)) {
                    if (source.snippet)
                        lines.push(`    snippet: ${source.snippet}`);
                    if (source.url)
                        lines.push(`    url: ${source.url}`);
                }
            }
        }
        const riskBits = [...question.gaps, ...question.criteria.filter(item => item.status !== 'covered').flatMap(item => [item.gap, item.warning])].map(text => String(text || '').trim()).filter(Boolean);
        if (riskBits.length) {
            lines.push('Risks / limitations for this section:');
            for (const bit of [...new Set(riskBits)].slice(0, 8))
                lines.push(`- ${bit}`);
        }
        lines.push('');
    }
    return `${lines.join('\n').trim()}\n`;
}
//# sourceMappingURL=investigation.js.map