import { randomUUID } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { Service } from "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { SessionId } from "@deepseek-ai/dsh-session";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { access, mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { load } from "cheerio";
import { constants } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { z } from "zod";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
import * as StorageSqlite from "@deepseek-ai/dsh-storage-sqlite";
import * as WebFetchHttp from "@deepseek-ai/dsh-web-fetch-http";
//#region lib/types/artifacts.js
/** On-disk fetch bodies for Scout / Evaluator. Not stored in the project JSON. */
/** Default root under the user's DSH home. */
function researchArtifactsRoot(rootDir = "") {
	const override = rootDir.trim();
	if (override !== "") return override;
	return join(homedir(), ".dsh", "research-artifacts");
}
/** Directory for one criterion's artifacts. */
function artifactDirFor(projectId, questionId, criterionId, rootDir = "") {
	return join(researchArtifactsRoot(rootDir), projectId, questionId, criterionId);
}
/** Directory for one project. */
function projectArtifactsDir(projectId, rootDir = "") {
	return join(researchArtifactsRoot(rootDir), projectId);
}
const MAX_STORE_CHARS = 2e5;
const MAX_PREVIEW_CHARS = 2500;
const MAX_READ_CHARS = 4e3;
function looksLikeHtml(value) {
	return /<(?:!doctype|html|head|body|script|style|div|article|main|section|p|meta|link)\b/i.test(value);
}
/** Codemini-aligned readable text: strip script/style/noscript, keep body text. */
function readableFetchText(body) {
	const raw = body.trim();
	if (raw === "") return "";
	if (!looksLikeHtml(raw)) return raw.slice(0, MAX_STORE_CHARS);
	const $ = load(raw);
	$("script, style, noscript").remove();
	const extracted = String($("body").text() || $.root().text()).replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
	return (extracted === "" ? raw : extracted).slice(0, MAX_STORE_CHARS);
}
/** Persist a fetched page body and return the artifact id. */
async function persistArtifact(scope) {
	const text = readableFetchText(scope.body);
	if (text === "") return null;
	const artifactId = `art_${randomUUID()}`;
	const dir = artifactDirFor(scope.projectId, scope.questionId, scope.criterionId, scope.rootDir);
	await mkdir(dir, { recursive: true });
	await writeFile(join(dir, `${artifactId}.txt`), text, "utf8");
	await writeFile(join(dir, `${artifactId}.url`), scope.url, "utf8");
	return {
		artifactId,
		url: scope.url,
		preview: text.slice(0, MAX_PREVIEW_CHARS),
		text
	};
}
/** Read a slice of a persisted artifact. Throws when the id is unknown. */
async function readArtifact(scope) {
	const artifactId = scope.artifactId.trim();
	if (artifactId === "") throw new Error("artifactId is required");
	const fullText = await readFile(join(artifactDirFor(scope.projectId, scope.questionId, scope.criterionId, scope.rootDir), `${artifactId}.txt`), "utf8");
	const offset = Math.max(0, Math.floor(scope.offset ?? 0));
	const maxChars = Math.min(MAX_READ_CHARS, Math.max(1, Math.floor(scope.maxChars ?? MAX_READ_CHARS)));
	return {
		artifactId,
		text: fullText.slice(offset, offset + maxChars),
		offset,
		total: fullText.length
	};
}
/** Best-effort remove one criterion's artifacts. */
async function cleanupCriterionArtifacts(projectId, questionId, criterionId, rootDir = "") {
	const dir = artifactDirFor(projectId, questionId, criterionId, rootDir);
	await rm(dir, {
		recursive: true,
		force: true
	}).catch(() => void 0);
	await rm(dirname(dir), { recursive: false }).catch(() => void 0);
}
/** Best-effort remove every artifact for a project. */
async function cleanupProjectArtifacts(projectId, rootDir = "") {
	await rm(projectArtifactsDir(projectId, rootDir), {
		recursive: true,
		force: true
	}).catch(() => void 0);
}
/** Plan size by depth (quick maps to Codemini brief). */
const PLAN_DEPTH_LIMITS = {
	quick: {
		maxQuestions: 2,
		maxCriteriaPerQuestion: 2
	},
	standard: {
		maxQuestions: 4,
		maxCriteriaPerQuestion: 3
	},
	deep: {
		maxQuestions: 6,
		maxCriteriaPerQuestion: 3
	}
};
/** Effective plan limits: depth cap intersected with plugin config. */
function planLimits(depth, config) {
	const limits = PLAN_DEPTH_LIMITS[depth];
	return {
		maxQuestions: Math.min(config.maxQuestions, limits.maxQuestions),
		maxCriteriaPerQuestion: Math.min(config.maxCriteriaPerQuestion, limits.maxCriteriaPerQuestion)
	};
}
/**
* Infer depth from the main question / goal. Brief cues win.
* @param question - user research question.
* @param goal - optional goal text.
*/
function inferResearchPlanDepth(question, goal = "") {
	const text = `${question} ${goal}`.toLowerCase();
	const briefHints = [
		"简短",
		"简单",
		"快速",
		"概览",
		"简介",
		"一眼",
		"一句话",
		"brief",
		"quick",
		"short",
		"simple",
		"overview",
		"tl;dr",
		"tldr",
		"eli5"
	];
	const deepHints = [
		"深入",
		"详尽",
		"全面",
		"对比决策",
		"系统梳理",
		"调研报告",
		"deep",
		"thorough",
		"comprehensive",
		"exhaustive",
		"in-depth",
		"detailed analysis"
	];
	if (briefHints.some((hint) => text.includes(hint))) return "quick";
	if (deepHints.some((hint) => text.includes(hint))) return "deep";
	return "standard";
}
/**
* Apply the brief-wins rule when the model submits a depth.
* @param requested - depth from the planner.
* @param question - main question.
* @param goal - optional goal.
*/
function resolveSubmittedDepth(requested, question, goal = "") {
	return inferResearchPlanDepth(question, goal) === "quick" ? "quick" : requested;
}
/** Session search/fetch caps from criterion count, with Codemini floors. */
function planResearchBudget(criterionCount, used) {
	const toolBudget = Math.max(1, Math.floor(criterionCount) || 1) * 10;
	return {
		maxSearches: Math.max(25, toolBudget),
		maxFetches: Math.max(200, toolBudget),
		searchesUsed: used?.searchesUsed ?? 0,
		fetchesUsed: used?.fetchesUsed ?? 0
	};
}
/** Count success criteria on a project or draft plan. */
function countCriteria(questions) {
	return questions.reduce((sum, question) => sum + question.criteria.length, 0);
}
/** Validate a submitted plan against depth limits. Throws a RangeError when oversized. */
function assertPlanFitsDepth(depth, questions, config) {
	const limits = planLimits(depth, config);
	if (questions.length === 0) throw new TypeError("deepresearch: plan must contain at least one question");
	if (questions.length > limits.maxQuestions) throw new RangeError(`depth "${depth}" allows at most ${limits.maxQuestions} sub-questions; got ${questions.length}. Resubmit a smaller plan that fits this depth.`);
	for (const [index, question] of questions.entries()) {
		if (question.criteria.length === 0) throw new TypeError(`deepresearch: questions[${index}] requires criteria`);
		if (question.criteria.length > limits.maxCriteriaPerQuestion) throw new RangeError(`depth "${depth}" allows at most ${limits.maxCriteriaPerQuestion} success criteria per sub-question; question ${index + 1} has ${question.criteria.length}. Resubmit with fewer criteria.`);
	}
}
/** True when a plan-size error should bounce the planner instead of failing the run. */
function isOversizedPlanError(error) {
	return error instanceof RangeError && String(error.message).includes("allows at most");
}
/** Session budget for a stored project, preserving used counts. */
function budgetForProject(project) {
	return planResearchBudget(countCriteria(project.questions), project.budget);
}
const MAX_DEP_CONTEXT_CHARS = 4e3;
const MAX_URL_TEXT_FOR_VERIFY = 2500;
const SETTLED_QUESTION = new Set([
	"covered",
	"partial",
	"blocked"
]);
const TERMINAL_COVERAGE = new Set([
	"covered",
	"partial",
	"blocked"
]);
function clip(value, max = 8e3) {
	return String(value ?? "").trim().slice(0, max);
}
function normalizeQuery(value) {
	return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function normalizeUrl(value) {
	try {
		const url = new URL(String(value || "").trim());
		for (const key of [...url.searchParams.keys()]) if (/^(utm_|ref$|source$|campaign$)/i.test(key)) url.searchParams.delete(key);
		url.hash = "";
		return url.toString().replace(/\/$/, "");
	} catch {
		return String(value || "").trim().replace(/\/$/, "");
	}
}
/** Keep the first occurrence of each normalized URL, up to the per-claim cap. */
function uniqueSources(sources, max = 3) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const source of sources) {
		const url = normalizeUrl(source.url);
		if (url === "" || seen.has(url)) continue;
		seen.add(url);
		out.push(url === source.url ? source : {
			...source,
			url
		});
		if (out.length >= max) break;
	}
	return out;
}
function appendToolBudgetNote(payload, used, cap) {
	const note = `[tools ${used}/${cap} used, ${Math.max(0, cap - used)} left]`;
	if (payload == null) return note;
	if (typeof payload === "string") return `${payload}\n\n${note}`;
	try {
		return `${JSON.stringify(payload)}\n\n${note}`;
	} catch {
		return `${String(payload)}\n\n${note}`;
	}
}
function indexSearchResult(urlIndex, sources) {
	for (const source of sources) {
		const url = normalizeUrl(source.url ?? "");
		if (url === "") continue;
		const text = clip([source.title, source.snippet].filter(Boolean).join("\n"), MAX_URL_TEXT_FOR_VERIFY);
		const prior = urlIndex.get(url);
		urlIndex.set(url, {
			url,
			text: clip(`${prior?.text ?? ""}\n${text}`, MAX_URL_TEXT_FOR_VERIFY),
			artifactId: prior?.artifactId ?? ""
		});
	}
}
function indexFetchResult(urlIndex, url, text, artifactId, finalUrl) {
	const requested = normalizeUrl(url);
	const landed = normalizeUrl(finalUrl || url);
	const preview = clip(text, MAX_URL_TEXT_FOR_VERIFY);
	const write = (key) => {
		if (key === "") return;
		urlIndex.set(key, {
			url: key,
			text: preview,
			artifactId
		});
	};
	write(landed || requested);
	if (requested !== "" && requested !== landed) write(requested);
}
function normalizeSubmittedCandidates(raw, criterionId) {
	const items = Array.isArray(raw) ? raw : [];
	const out = [];
	for (const [index, item] of items.entries()) {
		if (item == null || typeof item !== "object") continue;
		const record = item;
		const claim = clip(record.claim, 800);
		if (claim === "") continue;
		const rawSources = Array.isArray(record.sources) ? record.sources : [];
		const sources = [];
		for (const source of rawSources) {
			if (source == null || typeof source !== "object") continue;
			const src = source;
			const url = normalizeUrl(String(src.url ?? ""));
			if (url === "") continue;
			sources.push({
				url,
				snippet: clip(src.snippet, 1200),
				artifactId: clip(src.artifactId, 120),
				toolText: ""
			});
		}
		out.push({
			id: clip(record.id, 80) || `${criterionId}-c${index + 1}`,
			claim,
			confidence: record.confidence === "high" || record.confidence === "low" ? record.confidence : "medium",
			riskFlags: [...new Set((Array.isArray(record.riskFlags) ? record.riskFlags : []).map((flag) => clip(flag, 40)).filter(Boolean))],
			sources: uniqueSources(sources)
		});
		if (out.length >= 3) break;
	}
	return out;
}
function gateCandidatesByUrl(candidates, urlIndex) {
	const accepted = [];
	const rejected = [];
	for (const candidate of candidates) {
		const kept = [];
		const missing = [];
		for (const source of candidate.sources) {
			const url = normalizeUrl(source.url);
			const indexed = urlIndex.get(url);
			if (indexed === void 0) {
				if (url !== "") missing.push(url);
				continue;
			}
			kept.push({
				url,
				snippet: clip(source.snippet, 1200),
				artifactId: source.artifactId || indexed.artifactId,
				toolText: clip(indexed.text, MAX_URL_TEXT_FOR_VERIFY)
			});
		}
		if (kept.length === 0) {
			rejected.push({
				...candidate,
				reason: missing.length ? `URL(s) not seen in tool results: ${missing.join(", ")}` : "No URLs provided"
			});
			continue;
		}
		accepted.push({
			...candidate,
			sources: uniqueSources(kept)
		});
	}
	return {
		accepted,
		rejected
	};
}
function parseJsonObject(raw) {
	const text = raw.trim();
	if (text === "") return null;
	const body = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim() ?? text;
	const start = body.indexOf("{");
	const end = body.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		const parsed = JSON.parse(body.slice(start, end + 1));
		return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function parseCandidatesFromText(raw, criterionId) {
	const parsed = parseJsonObject(raw) ?? {};
	return {
		candidates: normalizeSubmittedCandidates(parsed.candidates, criterionId),
		summary: clip(parsed.summary, 1200),
		gap: clip(parsed.gap, 1200)
	};
}
function parseReviewFromText(raw, candidates, fallbackSummary, fallbackGap) {
	return normalizeReview(parseJsonObject(raw) ?? {}, candidates, fallbackSummary, fallbackGap);
}
function normalizeReview(args, candidates, fallbackSummary, fallbackGap) {
	const rawVerdicts = Array.isArray(args.verdicts) ? args.verdicts : [];
	const byId = /* @__PURE__ */ new Map();
	for (const item of rawVerdicts) {
		if (item == null || typeof item !== "object") continue;
		const record = item;
		const candidateId = clip(record.candidateId ?? record.id, 80);
		if (candidateId === "") continue;
		const attached = [];
		const rawSources = Array.isArray(record.sources) ? record.sources : [];
		for (const source of rawSources) {
			if (source == null || typeof source !== "object") continue;
			const src = source;
			const url = normalizeUrl(String(src.url ?? ""));
			if (url === "") continue;
			attached.push({
				url,
				snippet: clip(src.snippet, 1200)
			});
		}
		byId.set(candidateId, {
			candidateId,
			supported: Boolean(record.supported ?? record.accept ?? record.ok),
			relevantToCriterion: record.relevantToCriterion == null ? Boolean(record.relevant) : Boolean(record.relevantToCriterion),
			reason: clip(record.reason, 400),
			sources: uniqueSources(attached)
		});
	}
	const decisionRaw = String(args.decision ?? "WARNING").trim().toUpperCase();
	return {
		decision: decisionRaw === "PASS" || decisionRaw === "FAIL" || decisionRaw === "WARNING" ? decisionRaw : "WARNING",
		warnings: [...new Set((Array.isArray(args.warnings) ? args.warnings : [args.warnings]).map((item) => clip(item, 240)).filter(Boolean))].slice(0, 4),
		verdicts: candidates.map((candidate) => byId.get(candidate.id) ?? {
			candidateId: candidate.id,
			supported: false,
			relevantToCriterion: false,
			reason: "Missing verdict",
			sources: []
		}),
		summary: clip(args.summary, 1200) || fallbackSummary,
		gap: clip(args.gap, 1200) || fallbackGap
	};
}
function isAcceptedVerdict(verdict) {
	return Boolean(verdict?.supported && verdict.relevantToCriterion);
}
function criterionStatusFromReview(decision, acceptedCount) {
	if (decision === "PASS") return {
		status: acceptedCount > 0 ? "covered" : "blocked",
		reason: acceptedCount > 0 ? "Criterion passed review." : "Criterion passed but no accepted claims."
	};
	if (decision === "WARNING") return {
		status: acceptedCount > 0 ? "partial" : "blocked",
		reason: "Criterion is usable but materially caveated."
	};
	return {
		status: "blocked",
		reason: "Criterion failed verification."
	};
}
function questionStatusFromCoverage(criteria, acceptedEvidenceCount) {
	if (criteria.length > 0 && criteria.every((item) => item.status === "covered")) return "covered";
	if (acceptedEvidenceCount > 0 || criteria.some((item) => item.status === "partial")) return "partial";
	return "blocked";
}
function deriveQuestionGaps(criteria) {
	return criteria.filter((item) => item.status !== "covered").map((item) => clip(item.gap, 1200)).filter(Boolean);
}
const LIMITATION_FALLBACK = {
	partial: "Partially covered — remaining uncertainty on this criterion.",
	blocked: "Rejected — verification did not accept this criterion.",
	conflicted: "Sources conflict on this criterion.",
	missing: "Not covered."
};
/** Turn partial / blocked / conflicted / still-missing criteria into limitation rows. */
function deriveLimitationRows(project) {
	const rows = [];
	for (const question of project.questions) for (const criterion of question.criteria) {
		if (criterion.status === "covered") continue;
		const text = [criterion.gap, criterion.warning].map((item) => item.trim()).filter(Boolean).join(" ") || LIMITATION_FALLBACK[criterion.status];
		rows.push({
			questionId: question.id,
			criterionId: criterion.id,
			status: criterion.status,
			text
		});
	}
	for (const item of project.limitations) {
		const text = item.trim();
		if (!text || rows.some((row) => row.text === text || text.endsWith(row.text))) continue;
		rows.push({
			questionId: "",
			criterionId: "",
			status: "",
			text
		});
	}
	return rows;
}
function collectLimitations(project) {
	return [...new Set(deriveLimitationRows(project).map((row) => {
		if (row.criterionId === "") return row.text;
		return `${project.questions.find((item) => item.id === row.questionId)?.text ?? row.questionId} — ${row.criterionId} — ${row.text}`;
	}))];
}
function buildScoutHandoff(question, evidence) {
	const accepted = evidence.filter((item) => item.questionId === question.id && item.status === "accepted");
	const lines = [
		`Question: ${question.id} — ${question.text}`,
		"",
		"Accepted Evidence:"
	];
	if (accepted.length === 0) lines.push("- No accepted evidence yet.");
	for (const item of accepted) {
		lines.push(`- ${item.id}: ${item.claim}`);
		for (const source of evidenceSources(item)) {
			if (source.url) lines.push(`  URL: ${source.url}`);
			if (source.snippet) lines.push(`  snippet: ${source.snippet}`);
		}
		if (item.criterionIds.length) lines.push(`  Criteria: ${item.criterionIds.join(", ")}`);
	}
	lines.push("", "Coverage:");
	for (const criterion of question.criteria) {
		lines.push(`- [${criterion.id}] ${criterion.status}`);
		if (criterion.verification) lines.push(`  verification: ${criterion.verification}`);
		if (criterion.summary) lines.push(`  summary: ${criterion.summary}`);
		if (criterion.gap) lines.push(`  gap: ${criterion.gap}`);
		if (criterion.warning) lines.push(`  warning: ${criterion.warning}`);
	}
	return lines.join("\n");
}
function evidenceSources(item) {
	if (item.sources.length > 0) return uniqueSources(item.sources);
	if (item.url || item.snippet) return [{
		url: item.url ?? "",
		snippet: item.snippet
	}];
	return [];
}
function buildUpstreamDependencySummary(question, evidence) {
	const accepted = evidence.filter((item) => item.questionId === question.id && item.status === "accepted");
	const lines = [
		`### Upstream: ${clip(question.text || question.id, 240)}`,
		`Id: ${question.id}`,
		`Status: ${question.status}`,
		"Confirmed claims:"
	];
	if (accepted.length === 0) lines.push("- (none yet)");
	else {
		for (const item of accepted.slice(0, 8)) lines.push(`- ${clip(item.claim, 240)}`);
		if (accepted.length > 8) lines.push(`- … +${accepted.length - 8} more`);
	}
	const notes = [];
	for (const criterion of question.criteria) {
		if (criterion.summary) notes.push(`- [${criterion.id}] summary: ${clip(criterion.summary, 200)}`);
		if (criterion.gap) notes.push(`- [${criterion.id}] gap: ${clip(criterion.gap, 200)}`);
		if (criterion.warning) notes.push(`- [${criterion.id}] warning: ${clip(criterion.warning, 160)}`);
	}
	if (notes.length) {
		lines.push("Criterion notes:");
		lines.push(...notes.slice(0, 12));
	}
	return lines.join("\n");
}
function collectDependencyContext(question, questions, evidence) {
	const waitingOn = unresolvedDependencyIds(question, questions);
	if (question.dependsOn.length === 0) return {
		text: "",
		waitingOn
	};
	const sections = [];
	for (const depId of question.dependsOn) {
		const upstream = questions.find((item) => item.id === depId);
		sections.push(upstream === void 0 ? `### Upstream: ${depId}\nStatus: missing` : buildUpstreamDependencySummary(upstream, evidence));
	}
	let body = [
		"Upstream dependency context (clues only — not verified evidence for this sub-question).",
		"Use it to avoid duplicate discovery searches and to focus follow-up investigation.",
		"Re-verify before treating any upstream claim as established for YOUR criterion.",
		"",
		...sections
	].join("\n\n");
	if (body.length > 4e3) body = `${body.slice(0, MAX_DEP_CONTEXT_CHARS - 1)}…`;
	return {
		text: body,
		waitingOn
	};
}
function isQuestionSettled(question) {
	if (SETTLED_QUESTION.has(question.status)) return true;
	return question.criteria.length > 0 && question.criteria.every((item) => TERMINAL_COVERAGE.has(item.status));
}
function unresolvedDependencyIds(question, questions) {
	return question.dependsOn.filter((depId) => {
		const upstream = questions.find((item) => item.id === depId);
		return upstream === void 0 || !isQuestionSettled(upstream);
	});
}
function selectReadyWaveBatch(questions, maxParallel = 3) {
	const pending = questions.filter((question) => !isQuestionSettled(question) && question.status !== "failed");
	const ready = pending.filter((question) => unresolvedDependencyIds(question, questions).length === 0);
	const cap = Math.max(1, Math.floor(maxParallel) || 1);
	const batch = (ready.length > 0 ? ready : pending.slice(0, 1)).slice(0, cap);
	const batchIds = new Set(batch.map((item) => item.id));
	return {
		ready: batch,
		waiting: pending.filter((question) => !batchIds.has(question.id)).map((question) => ({
			question,
			waitingOn: unresolvedDependencyIds(question, questions)
		}))
	};
}
/** Keep Scout/Evaluator draft panes for model prose; drop tool-log and JSON payloads. */
function readableRoleDraft(text) {
	const value = text.trim();
	if (value === "") return "";
	if (/^(Search|Fetch|Read artifact|Evaluator read)\b/i.test(value)) return "";
	if (value.startsWith("{") || value.startsWith("[")) return "";
	if (/^\s*<(?:tool|function|invoke)\b/i.test(value)) return "";
	return value.slice(0, 800);
}
function emptyProgress$1() {
	return {
		running: 0,
		waiting: 0,
		scouts: []
	};
}
function emptyScoutProgress(questionId, extras = {}) {
	return {
		questionId,
		role: "waiting",
		status: "waiting",
		waitingOn: [],
		toolsUsed: 0,
		toolsCap: 10,
		activity: "",
		tools: [],
		scoutDraft: "",
		evaluatorDraft: "",
		activeCriterionId: "",
		activeCriterionText: "",
		dependencySummary: "",
		handoff: "",
		...extras
	};
}
function mergeScoutProgress(progress, next) {
	const scouts = progress.scouts.filter((item) => item.questionId !== next.questionId);
	scouts.push(next);
	return {
		running: scouts.filter((item) => item.status === "running" || item.status === "verifying").length,
		waiting: scouts.filter((item) => item.status === "waiting").length,
		scouts
	};
}
function pushProgressTool(tools, tool) {
	return [...tools, tool].slice(-8);
}
function buildResearchWritingPack(project) {
	const lines = [`Main question: ${project.question}`];
	if (project.goal) lines.push(`Goal: ${project.goal}`);
	if (project.constraints) lines.push(`Constraints: ${project.constraints}`);
	lines.push(`Depth: ${project.depth}`, "");
	lines.push("Suggested outline (organize freely; do not invent facts):");
	if (project.questions.length === 0) lines.push("(no sub-questions)");
	else {
		project.questions.forEach((question, index) => lines.push(`${index + 1}. ${question.text}`));
		lines.push(`${project.questions.length + 1}. Limitations / unresolved gaps`);
	}
	lines.push("");
	const accepted = project.evidence.filter((item) => item.status === "accepted");
	for (const question of project.questions) {
		const qEvidence = accepted.filter((item) => item.questionId === question.id);
		lines.push(`## ${question.id} — ${question.text}`.trim());
		lines.push(`Status: ${question.status}`);
		lines.push("Criteria:");
		for (const criterion of question.criteria) {
			lines.push(`- [${criterion.id}] [${criterion.status}]${criterion.verification ? ` verify=${criterion.verification}` : ""} ${criterion.text}`.trimEnd());
			if (criterion.summary) lines.push(`  summary: ${criterion.summary}`);
			if (criterion.gap) lines.push(`  gap: ${criterion.gap}`);
			if (criterion.warning) lines.push(`  warning: ${criterion.warning}`);
			for (const ev of qEvidence.filter((item) => item.criterionIds.includes(criterion.id))) {
				lines.push(`  evidence ${ev.id} (${ev.confidence}): ${ev.claim}`);
				for (const source of evidenceSources(ev)) {
					if (source.snippet) lines.push(`    snippet: ${source.snippet}`);
					if (source.url) lines.push(`    url: ${source.url}`);
				}
			}
		}
		const unlinked = qEvidence.filter((ev) => ev.criterionIds.length === 0 || !question.criteria.some((criterion) => ev.criterionIds.includes(criterion.id)));
		if (unlinked.length) {
			lines.push("Additional accepted evidence:");
			for (const ev of unlinked) {
				lines.push(`- ${ev.id} (${ev.confidence}): ${ev.claim}`);
				for (const source of evidenceSources(ev)) {
					if (source.snippet) lines.push(`    snippet: ${source.snippet}`);
					if (source.url) lines.push(`    url: ${source.url}`);
				}
			}
		}
		const riskBits = [...question.gaps, ...question.criteria.filter((item) => item.status !== "covered").flatMap((item) => [item.gap, item.warning])].map((text) => String(text || "").trim()).filter(Boolean);
		if (riskBits.length) {
			lines.push("Risks / limitations for this section:");
			for (const bit of [...new Set(riskBits)].slice(0, 8)) lines.push(`- ${bit}`);
		}
		lines.push("");
	}
	return `${lines.join("\n").trim()}\n`;
}
//#endregion
//#region lib/types/prompts.js
/** Role prompts aligned with Codemini planning / Scout / Evaluator / Writer. */
function planningSystemPrompt(project, limits) {
	return [
		"You are the planning stage of a private Deep Research run.",
		`Main question: ${project.question}`,
		project.goal ? `Goal: ${project.goal}` : "",
		project.constraints ? `Constraints: ${project.constraints}` : "",
		"Phase: planning.",
		"First judge the main question depth, then split only as much as that depth needs.",
		`Stay within ${limits.maxQuestions} sub-questions and ${limits.maxCriteriaPerQuestion} criteria per question.`,
		"Depth budgets:",
		`- quick: at most ${PLAN_DEPTH_LIMITS.quick.maxQuestions} sub-questions, at most ${PLAN_DEPTH_LIMITS.quick.maxCriteriaPerQuestion} success criteria each`,
		`- standard: at most ${PLAN_DEPTH_LIMITS.standard.maxQuestions} sub-questions, at most ${PLAN_DEPTH_LIMITS.standard.maxCriteriaPerQuestion} success criteria each`,
		`- deep: at most ${PLAN_DEPTH_LIMITS.deep.maxQuestions} sub-questions, at most ${PLAN_DEPTH_LIMITS.deep.maxCriteriaPerQuestion} success criteria each`,
		"Create a concise evidence-oriented plan. If goal is empty, invent a concise goal in the same plan.",
		"Call deep_research_submit_plan with goal, depth (quick|standard|deep), and questions.",
		"Constraints are user-provided preferences. Pass them through only when the user already supplied constraints above; never invent new constraints. Omit constraints or send an empty string when the user left them blank.",
		"Each question needs text, criteria (string array), and dependsOn (zero-based indexes of earlier questions).",
		"Use dependsOn only for discover→deep-dive chains. Independent angles leave dependsOn empty.",
		"Dependent Scouts later receive a compact upstream summary (accepted claims + criterion notes), not full transcripts.",
		"Prefer fewer, sharper sub-questions. Merge overlapping angles.",
		"If deep_research_submit_plan returns ok:false because the plan exceeds the depth budget, silently resubmit a smaller plan — do not explain the rejection to the user.",
		"Do not search the web. Do not investigate. Do not write a report. Do not ask the user a question or emit a user-facing answer."
	].filter(Boolean).join("\n");
}
function planningUserPrompt(project) {
	const seed = project.seedText.trim().slice(0, 6e3);
	return [`Draft the research plan for project ${project.id} and call deep_research_submit_plan.`, seed === "" ? "No seed material." : `Seed material:\n${seed}`].join("\n\n");
}
function planningNudgePrompt() {
	return "You have not submitted a plan. Call deep_research_submit_plan now with a plan that fits the depth budget.";
}
function scoutSystemPrompt() {
	return [
		"You are a focused, read-only research Scout.",
		"Investigate only the target criterion in the user prompt.",
		"Search and fetch freely. research_web_fetch returns artifactId — use that exact id with read_artifact; never invent ids. Use read_artifact only when you need extra source context to validate or clarify a key claim.",
		"If upstream dependency context is provided, use it as discovery clues only — re-verify before submitting claims.",
		"When done, call submit_criterion_candidates with candidates, summary, and gap.",
		"Do not invent quote fields. Do not write a final report."
	].join("\n");
}
function scoutUserPrompt(input) {
	const remaining = Math.max(0, input.toolsCap - input.toolsUsed);
	return [
		"Investigate exactly ONE target criterion for this research sub-question.",
		"Use research_web_search and research_web_fetch freely and continuously.",
		"research_web_fetch returns an artifactId field when the body is persisted — use that exact id with read_artifact; never invent ids.",
		"Use read_artifact sparingly: only to confirm source context, resolve ambiguity, or validate a key claim from an already fetched source.",
		`Hard fuse: at most ${input.toolsCap} tool calls combined for this criterion across research_web_search, research_web_fetch, and successful read_artifact.`,
		"Failed read_artifact calls (missing/invalid artifactId) do not consume the fuse.",
		"submit_criterion_candidates does NOT count toward the fuse.",
		"Every research_web_search call must include the supplied criterionId.",
		"When finished searching, you MUST call submit_criterion_candidates with candidates, summary, and gap.",
		`Submit at most 3 strongest claims for this criterion (strongest first); extras are dropped.`,
		`Each claim may list at most 3 strongest sources (strongest first); extras are dropped.`,
		"Each source must include url, a short support note/snippet, and artifactId when the source was fetched.",
		"Do not stop with only prose — always submit candidates (empty array if blocked).",
		`Main question: ${input.question}`,
		input.goal ? `Goal: ${input.goal}` : "",
		`Sub-question: ${input.subQuestion}`,
		input.dependencyContext ? [
			"Dependency context from upstream sub-question(s) follows.",
			"Treat it as shared discovery context.",
			input.dependencyContext
		].join("\n\n") : "",
		`Target criterion id: ${input.criterionId}`,
		`Target criterion: ${input.criterionText}`,
		`Tool budget for this criterion: ${input.toolsUsed} of ${input.toolsCap} used (${remaining} remaining).`
	].filter(Boolean).join("\n\n");
}
function scoutNudgePrompt() {
	return [
		"You have not called submit_criterion_candidates yet.",
		"Call submit_criterion_candidates now with candidates, summary, and gap.",
		"If you cannot produce attributable candidates, submit an empty array with an honest summary/gap.",
		"Alternatively reply with JSON only: {\"candidates\":[{\"claim\":\"\",\"sources\":[{\"url\":\"\",\"snippet\":\"\"}]}],\"summary\":\"\",\"gap\":\"\"}"
	].join(" ");
}
function evaluatorSystemPrompt() {
	return [
		"You are the Evaluator for one research criterion.",
		"Default mode is lightweight review: inspect the Scout structured output first.",
		`Use read_artifact only when needed, and never more than 3 times for this criterion.`,
		"Use the exact artifactId from each candidate source. Failed/missing reads do not consume the artifact-read budget.",
		"Escalate to read_artifact only for high-risk or doubtful cases: numeric/quantitative claims, causal claims, absolute claims, legal/medical/financial/safety claims, low-confidence claims, snippet mismatch, or when toolText appears too weak or ambiguous.",
		"For each candidate, judge two things:",
		"1) supported: does one or more sources substantively support the claim? Judge semantically from toolText / read_artifact; do not require verbatim quote matching.",
		"2) relevantToCriterion: does the claim directly address this criterion?",
		"A candidate becomes accepted evidence only when both are true.",
		"When supported=true, return sources:[{url, snippet}] as optional display/helper notes.",
		"Review scout summary and gap too. Rewrite if overstated, off-topic, or vague.",
		"summary and gap must be clean prose about this criterion only. Never mention accepted/rejected counts, tool budgets, or workflow statistics.",
		"Finish by calling submit_criterion_review."
	].join("\n");
}
function evaluatorUserPrompt(input) {
	return [
		`Sub-question: ${input.subQuestion}`,
		`Criterion (${input.criterionId}): ${input.criterionText}`,
		`Scout summary: ${input.scoutSummary || "(empty)"}`,
		`Scout gap: ${input.scoutGap || "(empty)"}`,
		`Artifact read budget: 0/3`,
		`Candidates:\n${input.candidatesJson}`
	].join("\n\n");
}
function evaluatorNudgePrompt() {
	return "Call submit_criterion_review now. If evidence is weak, use WARNING or FAIL and explain the gap plainly.";
}
function writerSystemPrompt(depth) {
	return [
		"You are the writing stage of a private Deep Research run.",
		"Write the final research report from the writing pack only.",
		"Write the entire report markdown in the same language as the main question.",
		"Hard rules:",
		"- Use only the writing pack. Do not invent facts, dates, or sources outside it.",
		"- Affirmative claims must be supportable by accepted evidence entries in the pack.",
		"- Cite sources in the prose using the pack URLs (markdown links). Do not invent URLs.",
		"- Treat verify=WARNING / warning / gap lines as caution or limitations in the report.",
		"- Uncovered criteria and Risks / limitations sections must appear in the report.",
		depth === "quick" ? "Depth is quick: aim for about 800-2000 Chinese characters (or proportional English length). Short answers are fine; still state what remains unverified." : depth === "deep" ? "Depth is deep: aim for about 4000-10000 Chinese characters when the pack supports it. Expand mechanisms, contrasts, and evidence strength." : "Depth is standard: aim for about 2000-5000 Chinese characters when the pack supports it. Prefer clear subheadings; keep substance over padding.",
		"Length follows the pack: a thin pack means a shorter report is correct; do not pad.",
		"Call deep_research_complete with the markdown report. Write limitations into the report body; a saved report is complete.",
		"Do not search the web. Do not ask the user a question or emit a user-facing answer."
	].join("\n");
}
function writerUserPrompt(pack) {
	return ["Write the final report from this writing pack, then call deep_research_complete.", pack].join("\n\n");
}
function writerNudgePrompt() {
	return "Call deep_research_complete now with the markdown report. If the pack is thin, write a shorter report and state limitations in the report body.";
}
//#endregion
//#region lib/types/types.js
/** Public wire values for durable Codemini-style Deep Research projects. */
/**
* Construct a research project identity at its owning boundary.
* @param value - persisted or wire identity.
* @returns branded project identity.
*/
const ResearchId = (value) => value;
/**
* Construct a planned-question identity at its owning boundary.
* @param value - persisted or wire identity.
* @returns branded question identity.
*/
const ResearchQuestionId = (value) => value;
/**
* Construct an evidence identity at its owning boundary.
* @param value - persisted or wire identity.
* @returns branded evidence identity.
*/
const ResearchEvidenceId = (value) => value;
//#endregion
//#region lib/types/spec.js
/** Durable storage declaration for Deep Research. */
const emptyProgress = {
	running: 0,
	waiting: 0,
	scouts: []
};
/** Stored success-criterion schema. */
const researchCriterionSchema = z.object({
	id: z.string(),
	text: z.string(),
	status: z.enum([
		"missing",
		"partial",
		"covered",
		"conflicted",
		"blocked"
	]),
	summary: z.string(),
	gap: z.string(),
	warning: z.string().optional().default(""),
	verification: z.enum([
		"",
		"PASS",
		"WARNING",
		"FAIL"
	]).optional().default(""),
	toolCount: z.number().optional().default(0)
});
/** Stored planned-question schema. */
const researchQuestionSchema = z.object({
	id: z.string().transform(ResearchQuestionId),
	text: z.string(),
	dependsOn: z.array(z.string().transform(ResearchQuestionId)),
	status: z.enum([
		"pending",
		"running",
		"covered",
		"partial",
		"blocked",
		"failed"
	]),
	criteria: z.array(researchCriterionSchema),
	gaps: z.array(z.string()).optional().default([]),
	handoff: z.string().optional().default("")
});
/** Stored source-backed evidence schema. */
const researchEvidenceSchema = z.object({
	id: z.string().transform(ResearchEvidenceId),
	questionId: z.string().transform(ResearchQuestionId),
	criterionIds: z.array(z.string()),
	source: z.string(),
	url: z.string().nullable(),
	snippet: z.string(),
	sources: z.array(z.object({
		url: z.string(),
		snippet: z.string(),
		artifactId: z.string().optional()
	})).optional().default([]),
	claim: z.string(),
	confidence: z.enum([
		"low",
		"medium",
		"high"
	]),
	status: z.enum([
		"candidate",
		"accepted",
		"rejected"
	]).optional().default("accepted"),
	createdAt: z.number()
});
const researchScoutProgressSchema = z.object({
	questionId: z.string().transform(ResearchQuestionId),
	role: z.enum([
		"waiting",
		"scout",
		"evaluator",
		"writing"
	]),
	status: z.enum([
		"waiting",
		"running",
		"verifying",
		"done",
		"partial",
		"blocked"
	]),
	waitingOn: z.array(z.string().transform(ResearchQuestionId)),
	toolsUsed: z.number(),
	toolsCap: z.number(),
	activity: z.string(),
	tools: z.array(z.object({
		name: z.string(),
		detail: z.string(),
		status: z.enum(["running", "done"])
	})),
	scoutDraft: z.string(),
	evaluatorDraft: z.string(),
	activeCriterionId: z.string(),
	activeCriterionText: z.string(),
	dependencySummary: z.string(),
	handoff: z.string()
});
/** Stored investigation process snapshot. */
const researchProgressSchema = z.object({
	running: z.number(),
	waiting: z.number(),
	scouts: z.array(researchScoutProgressSchema)
});
/** Stored research project schema. */
const researchProjectSchema = z.object({
	id: z.string().transform(ResearchId),
	title: z.string(),
	question: z.string(),
	goal: z.string(),
	constraints: z.string(),
	seedText: z.string(),
	depth: z.enum([
		"quick",
		"standard",
		"deep"
	]),
	phase: z.enum([
		"planning",
		"awaiting_plan_confirm",
		"investigating",
		"ready_for_report",
		"incomplete",
		"writing",
		"done",
		"failed",
		"aborted"
	]),
	runState: z.enum([
		"idle",
		"running",
		"paused"
	]).optional().default("idle"),
	planConfirmed: z.boolean(),
	questions: z.array(researchQuestionSchema),
	evidence: z.array(researchEvidenceSchema),
	conclusions: z.array(z.string()),
	limitations: z.array(z.string()),
	report: z.string().nullable(),
	budget: z.object({
		maxSearches: z.number(),
		maxFetches: z.number(),
		searchesUsed: z.number(),
		fetchesUsed: z.number()
	}),
	progress: researchProgressSchema.optional().default(emptyProgress),
	createdAt: z.number(),
	updatedAt: z.number()
});
/** Global research store shared by Sessions. */
const deepResearchDomainSpec = defineDomain({
	name: "deepresearch",
	version: 3,
	tables: { projects: domainTable(researchProjectSchema) }
});
//#endregion
//#region lib/types/migrate.js
/** On-disk deepresearch storage unit upgrades before the domain opens. */
const DEEPRESEARCH_UNIT_NAME = deepResearchDomainSpec.name;
const SHARED_SQLITE_FILENAME = "dsh.sqlite";
const EMPTY_PROGRESS = {
	running: 0,
	waiting: 0,
	scouts: []
};
/** Default JSON unit path used by the web profile (`dshHomePath('storages')`). */
function defaultDeepResearchUnitPath(env = process.env) {
	return resolveDeepResearchUnitPath(void 0, env);
}
/** Resolve the on-disk unit file, optionally overriding the storages directory (tests). */
function resolveDeepResearchUnitPath(storageRoot, env = process.env) {
	if (storageRoot !== void 0 && storageRoot !== "") return join(storageRoot, `${DEEPRESEARCH_UNIT_NAME}.json`);
	const configured = env.DSH_HOME?.trim();
	return join(configured === void 0 || configured === "" ? join(homedir(), ".dsh") : configured.startsWith("~") ? join(homedir(), configured.slice(1)) : configured, "storages", `${DEEPRESEARCH_UNIT_NAME}.json`);
}
/** Canonical sqlite file both product plugins mount when the host has none. */
function defaultSharedSqlitePath(env = process.env) {
	return join(dirname(defaultDeepResearchUnitPath(env)), SHARED_SQLITE_FILENAME);
}
/** Leftover plugin-named sqlite from before the shared-file cutover. */
function defaultDeepResearchSqlitePath(env = process.env) {
	return resolveDeepResearchUnitPath(void 0, env).replace(/\.json$/u, ".sqlite");
}
function legacyDeepResearchSqlitePath(sqlitePath) {
	return join(dirname(sqlitePath), "deepresearch.sqlite");
}
/** Read JSON records from one sqlite KV table, or [] when the file/table is missing. */
function loadSqliteTableValues(path, unit, table) {
	let db;
	try {
		db = new DatabaseSync(path, { readOnly: true });
	} catch {
		return [];
	}
	try {
		const physical = `u_${unit}_${table}`;
		if (db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(physical) === void 0) return [];
		return db.prepare(`SELECT value FROM "${physical}"`).all().map((row) => JSON.parse(row.value));
	} finally {
		db.close();
	}
}
/**
* Copy leftover `deepresearch.sqlite` projects into an empty domain table.
* Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
*/
async function importLegacySqliteProjectsIfEmpty(legacyPath, liveSqlitePath, table) {
	if ([...table.entries()].length > 0) return 0;
	if (resolve(legacyPath) === resolve(liveSqlitePath)) return 0;
	try {
		await access(legacyPath, constants.R_OK);
	} catch {
		return 0;
	}
	let imported = 0;
	for (const raw of loadSqliteTableValues(legacyPath, DEEPRESEARCH_UNIT_NAME, "projects")) {
		const project = researchProjectSchema.parse(raw);
		await table.put(project.id, project);
		imported += 1;
	}
	return imported;
}
/**
* Upgrade a stored deepresearch JSON unit up to the current domain version.
* @param path - Absolute unit file path.
* @param targetVersion - Expected domain version after migration.
* @returns true when the file was rewritten.
*/
async function migrateDeepResearchUnitFile(path, targetVersion = deepResearchDomainSpec.version) {
	let text;
	try {
		text = await readFileUtf8(path);
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
	const document = parseRawUnit(text, path);
	if (document.unit.version >= targetVersion) return false;
	let current = document;
	while (current.unit.version < targetVersion) if (current.unit.version === 2 && targetVersion >= 3) current = migrateV2ToV3(current);
	else throw new Error(`deepresearch: unsupported storage migration from v${current.unit.version} to v${targetVersion}`);
	await writeAtomic(path, serializeRawUnit(current));
	return true;
}
/**
* Copy leftover JSON projects into an empty domain table (JSON → SQLite cutover).
* @param path - Migrated JSON unit path.
* @param table - Opened projects table.
* @returns number of imported projects.
*/
async function importJsonProjectsIfEmpty(path, table) {
	if ([...table.entries()].length > 0) return 0;
	let text;
	try {
		text = await readFileUtf8(path);
	} catch (error) {
		if (error.code === "ENOENT") return 0;
		throw error;
	}
	const projects = parseRawUnit(text, path).tables.projects ?? {};
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
	} catch (error) {
		throw new Error(`deepresearch: storage unit at ${path} is not valid JSON`, { cause: error });
	}
	if (typeof parsed !== "object" || parsed === null) throw new Error(`deepresearch: storage unit at ${path} is not a JSON object`);
	const { unit, global, tables } = parsed;
	if (typeof unit !== "object" || unit === null || unit.name !== DEEPRESEARCH_UNIT_NAME || typeof unit.version !== "number") throw new Error(`deepresearch: storage unit at ${path} has a missing or foreign unit header`);
	if (typeof tables !== "object" || tables === null || Array.isArray(tables)) throw new Error(`deepresearch: storage unit at ${path} has invalid tables`);
	return {
		unit: {
			name: DEEPRESEARCH_UNIT_NAME,
			version: unit.version
		},
		global: global ?? null,
		tables
	};
}
function migrateV2ToV3(document) {
	const projects = document.tables.projects ?? {};
	const migrated = {};
	for (const [key, raw] of Object.entries(projects)) {
		if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
			migrated[key] = raw;
			continue;
		}
		migrated[key] = migrateProjectV2ToV3(raw);
	}
	return {
		unit: {
			name: DEEPRESEARCH_UNIT_NAME,
			version: 3
		},
		global: document.global,
		tables: {
			...document.tables,
			projects: migrated
		}
	};
}
function migrateProjectV2ToV3(project) {
	const phase = typeof project.phase === "string" ? project.phase : "planning";
	const planConfirmed = project.planConfirmed === true;
	let runState = project.runState;
	let nextPhase = phase;
	if (runState !== "idle" && runState !== "running" && runState !== "paused") if (phase === "aborted") {
		runState = "paused";
		nextPhase = planConfirmed ? "investigating" : "planning";
	} else if (phase === "done" || phase === "failed" || phase === "incomplete") runState = "idle";
	else runState = "idle";
	return {
		...project,
		phase: nextPhase,
		runState,
		progress: project.progress ?? EMPTY_PROGRESS
	};
}
function serializeRawUnit(document) {
	return `${JSON.stringify({
		unit: document.unit,
		global: document.global,
		tables: document.tables
	}, null, 2)}\n`;
}
async function readFileUtf8(path) {
	const handle = await open(path, "r");
	try {
		return await handle.readFile("utf8");
	} finally {
		await handle.close();
	}
}
async function writeAtomic(path, data) {
	const tmp = join(dirname(path), `.${randomUUID()}.tmp`);
	try {
		const handle = await open(tmp, "wx", 384);
		try {
			await handle.writeFile(data, "utf8");
			await handle.sync();
		} finally {
			await handle.close();
		}
		await rename(tmp, path);
	} catch (error) {
		await rm(tmp, { force: true });
		throw error;
	}
}
//#endregion
//#region lib/types/platform.js
/** Mount shared DSH sqlite/fetch once, then route this plugin's domain onto them. */
function sqliteMounted(ctx) {
	return ctx.storage.backend.names().includes("sqlite");
}
function canMountHttpFetch(ctx) {
	const web = ctx.get("web");
	return web !== void 0 && typeof web.registerFetchProvider === "function";
}
function isAlreadyMountedError(error) {
	const text = error instanceof Error ? `${error.name} ${error.message}` : String(error);
	return /already registered|duplicate-backend|WEB_DUPLICATE_PROVIDER/i.test(text);
}
/** Sqlite file for this plugin when it is the one that mounts the backend. */
function sqlitePathFor(config, env = process.env) {
	const root = config.storageRoot?.trim();
	if (root !== void 0 && root !== "") return join(root, "dsh.sqlite");
	return defaultSharedSqlitePath(env);
}
/** Register the sqlite backend when the host has not already done so. */
async function ensureSqliteBackend(ctx, path) {
	if (sqliteMounted(ctx)) return;
	try {
		await ctx.plugin(StorageSqlite, { path });
	} catch (error) {
		if (sqliteMounted(ctx) || isAlreadyMountedError(error)) return;
		throw error;
	}
}
/** Register the HTTP fetch provider when `ctx.web` exists and has none. */
async function ensureHttpFetchProvider(ctx) {
	if (!canMountHttpFetch(ctx)) return;
	try {
		await ctx.plugin(WebFetchHttp);
	} catch (error) {
		if (isAlreadyMountedError(error)) return;
		throw error;
	}
}
/** Send one storage-domain name to sqlite without replacing other routes. */
function routeDomainToSqlite(ctx, domain) {
	const facility = ctx.storageDomain;
	const routes = facility.config.routes ?? (facility.config.routes = {});
	routes[domain] = "sqlite";
}
/** Ensure sqlite/fetch exist, then route this plugin's domain to sqlite. */
async function ensurePluginPlatform(ctx, options) {
	await ensureSqliteBackend(ctx, options.sqlitePath);
	routeDomainToSqlite(ctx, options.domain);
	await ensureHttpFetchProvider(ctx);
}
//#endregion
//#region lib/types/index.js
/**
* Codemini-aligned Deep Research: planning Lead, serial/parallel Scouts, Evaluator, Writer.
* @module @deepseek-ai/dsh-deepresearch
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
const TEXT_OUTPUT = {
	type: "object",
	additionalProperties: false,
	properties: { text: {
		type: "string",
		required: true
	} }
};
/** Durable Codemini-style Deep Research project service. */
let DeepResearchService = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _list_decorators;
	let _get_decorators;
	let _start_decorators;
	let _updatePlan_decorators;
	let _confirmPlan_decorators;
	let _addEvidence_decorators;
	let _updateQuestion_decorators;
	let _complete_decorators;
	let _fail_decorators;
	let _resume_decorators;
	let _writeReport_decorators;
	let _delete_decorators;
	return class DeepResearchService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
			_get_decorators = [Remote("get")];
			_start_decorators = [Remote("start")];
			_updatePlan_decorators = [Remote("updatePlan")];
			_confirmPlan_decorators = [Remote("confirmPlan")];
			_addEvidence_decorators = [Remote("addEvidence")];
			_updateQuestion_decorators = [Remote("updateQuestion")];
			_complete_decorators = [Remote("complete")];
			_fail_decorators = [Remote("fail")];
			_resume_decorators = [Remote("resume")];
			_writeReport_decorators = [Remote("writeReport")];
			_delete_decorators = [Remote("delete")];
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _get_decorators, {
				kind: "method",
				name: "get",
				static: false,
				private: false,
				access: {
					has: (obj) => "get" in obj,
					get: (obj) => obj.get
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _start_decorators, {
				kind: "method",
				name: "start",
				static: false,
				private: false,
				access: {
					has: (obj) => "start" in obj,
					get: (obj) => obj.start
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _updatePlan_decorators, {
				kind: "method",
				name: "updatePlan",
				static: false,
				private: false,
				access: {
					has: (obj) => "updatePlan" in obj,
					get: (obj) => obj.updatePlan
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _confirmPlan_decorators, {
				kind: "method",
				name: "confirmPlan",
				static: false,
				private: false,
				access: {
					has: (obj) => "confirmPlan" in obj,
					get: (obj) => obj.confirmPlan
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _addEvidence_decorators, {
				kind: "method",
				name: "addEvidence",
				static: false,
				private: false,
				access: {
					has: (obj) => "addEvidence" in obj,
					get: (obj) => obj.addEvidence
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _updateQuestion_decorators, {
				kind: "method",
				name: "updateQuestion",
				static: false,
				private: false,
				access: {
					has: (obj) => "updateQuestion" in obj,
					get: (obj) => obj.updateQuestion
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _complete_decorators, {
				kind: "method",
				name: "complete",
				static: false,
				private: false,
				access: {
					has: (obj) => "complete" in obj,
					get: (obj) => obj.complete
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _fail_decorators, {
				kind: "method",
				name: "fail",
				static: false,
				private: false,
				access: {
					has: (obj) => "fail" in obj,
					get: (obj) => obj.fail
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _resume_decorators, {
				kind: "method",
				name: "resume",
				static: false,
				private: false,
				access: {
					has: (obj) => "resume" in obj,
					get: (obj) => obj.resume
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _writeReport_decorators, {
				kind: "method",
				name: "writeReport",
				static: false,
				private: false,
				access: {
					has: (obj) => "writeReport" in obj,
					get: (obj) => obj.writeReport
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _delete_decorators, {
				kind: "method",
				name: "delete",
				static: false,
				private: false,
				access: {
					has: (obj) => "delete" in obj,
					get: (obj) => obj.delete
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		config = __runInitializers(this, _instanceExtraInitializers);
		static inject = [
			"storage",
			"storageDomain",
			"tools",
			"systemPrompt",
			"agents",
			"agentDefaultModel",
			"agentPresets",
			"web"
		];
		static Config = s.object({
			runnerEnabled: s.boolean().required(),
			runnerCwd: s.string().default(process.cwd()),
			storageRoot: s.string(),
			maxProjects: s.number().step(1).min(1).required(),
			maxQuestions: s.number().step(1).min(1).required(),
			maxCriteriaPerQuestion: s.number().step(1).min(1).required(),
			maxEvidencePerProject: s.number().step(1).min(1).required(),
			maxReportChars: s.number().step(1).min(1).required()
		});
		table;
		mutationTail = Promise.resolve();
		activeRuns = /* @__PURE__ */ new Map();
		/** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
		constructor(ctx, config) {
			super(ctx, "deepResearch");
			this.config = config;
		}
		async [Service.init]() {
			const sqlitePath = sqlitePathFor(this.config);
			await ensurePluginPlatform(this.ctx, {
				domain: "deepresearch",
				sqlitePath
			});
			const jsonPath = resolveDeepResearchUnitPath(this.config.storageRoot);
			await migrateDeepResearchUnitFile(jsonPath);
			const domain = await this.ctx.storageDomain.open(deepResearchDomainSpec);
			this.ctx.effect(() => () => domain.close(), "deepresearch.domainClose");
			this.table = domain.table("projects");
			await importLegacySqliteProjectsIfEmpty(legacyDeepResearchSqlitePath(sqlitePath), sqlitePath, this.table);
			await importJsonProjectsIfEmpty(jsonPath, this.table);
			if (this.config.runnerEnabled) for (const [id, project] of this.table.entries()) {
				if (project.runState === "paused") continue;
				if (project.phase === "planning") this.launch(id, "planning");
				else if (project.phase === "investigating") this.launch(id, "investigating");
				else if (project.phase === "writing") this.launch(id, "writing");
			}
			this.ctx.effect(() => async () => {
				const runs = [...this.activeRuns.values()];
				for (const run of runs) {
					run.controller.abort();
					for (const handle of run.handles) handle.agent.cancel({ kind: "disposed" });
				}
				await Promise.allSettled(runs.map((run) => run.promise));
			}, "deepresearch.runnerDrain");
		}
		list(request) {
			const query = request.query?.trim().toLocaleLowerCase();
			return { projects: [...this.requireTable().entries()].map(([, project]) => snapshot(project)).filter((project) => request.phase === void 0 || project.phase === request.phase).filter((project) => query === void 0 || query === "" || researchText(project).includes(query)).sort((left, right) => right.updatedAt - left.updatedAt) };
		}
		get(request) {
			const project = this.requireTable().get(request.id);
			return project === void 0 ? null : snapshot(project);
		}
		start(request) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				if (table.size >= this.config.maxProjects) throw new RangeError(`deepresearch: project limit ${this.config.maxProjects} reached`);
				const depth = resolveSubmittedDepth(request.depth, request.question, request.goal);
				const questions = request.questions.length === 0 ? [] : this.buildQuestions(request.questions, depth);
				const now = Date.now();
				const id = ResearchId(`research-${randomUUID()}`);
				const project = snapshot({
					id,
					title: optionalText(request.title) || `🔬 ${requiredText(request.question, "question").slice(0, 64)}`,
					question: requiredText(request.question, "question"),
					goal: optionalText(request.goal),
					constraints: optionalText(request.constraints),
					seedText: optionalText(request.seedText),
					depth,
					phase: this.config.runnerEnabled ? "planning" : "awaiting_plan_confirm",
					runState: this.config.runnerEnabled ? "running" : "idle",
					planConfirmed: false,
					questions,
					evidence: [],
					conclusions: [],
					limitations: [],
					report: null,
					budget: planResearchBudget(countCriteria(questions)),
					progress: emptyProgress$1(),
					createdAt: now,
					updatedAt: now
				});
				await table.put(id, project);
				if (this.config.runnerEnabled) {
					this.emitProgress(project);
					this.launch(id, "planning");
				}
				return snapshot(project);
			});
		}
		updatePlan(request) {
			return this.update(request.id, (project) => {
				if (project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is confirmed`);
				const depth = resolveSubmittedDepth(request.depth, project.question, request.goal);
				const questions = this.buildQuestions(request.questions, depth);
				return {
					...project,
					goal: request.goal.trim(),
					constraints: request.constraints.trim(),
					depth,
					questions,
					budget: planResearchBudget(countCriteria(questions), project.budget),
					phase: "awaiting_plan_confirm"
				};
			});
		}
		async confirmPlan(request) {
			const project = await this.update(request.id, (current) => {
				if (current.questions.length === 0) throw new Error(`deepresearch: project ${current.id} has no generated plan`);
				return {
					...current,
					planConfirmed: true,
					phase: "investigating",
					runState: "running",
					budget: budgetForProject(current),
					progress: seedInvestigationProgress(current)
				};
			});
			if (this.config.runnerEnabled) this.launch(request.id, "investigating");
			return project;
		}
		addEvidence(request) {
			return this.update(request.id, (project) => {
				if (!project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is not confirmed`);
				if (project.evidence.length >= this.config.maxEvidencePerProject) throw new RangeError(`deepresearch: evidence limit ${this.config.maxEvidencePerProject} reached`);
				const question = project.questions.find((item) => item.id === request.questionId);
				if (question === void 0) throw new Error(`deepresearch: question ${request.questionId} not found`);
				const criteria = new Set(question.criteria.map((item) => item.id));
				for (const id of request.criterionIds ?? []) if (!criteria.has(id)) throw new Error(`deepresearch: criterion ${id} not found`);
				const sources = uniqueSources((request.sources ?? []).map((source) => source.artifactId ? {
					url: optionalText(source.url),
					snippet: optionalText(source.snippet),
					artifactId: source.artifactId
				} : {
					url: optionalText(source.url),
					snippet: optionalText(source.snippet)
				}));
				const url = sources[0]?.url || optionalText(request.url) || null;
				const snippet = sources[0]?.snippet || optionalText(request.snippet);
				const evidence = {
					id: ResearchEvidenceId(`evidence-${randomUUID()}`),
					questionId: request.questionId,
					criterionIds: [...request.criterionIds ?? []],
					source: requiredText(request.source, "source"),
					url,
					snippet,
					sources: sources.length > 0 ? sources : url || snippet ? [{
						url: url ?? "",
						snippet
					}] : [],
					claim: requiredText(request.claim, "claim"),
					confidence: request.confidence,
					status: request.status ?? "accepted",
					createdAt: Date.now()
				};
				return {
					...project,
					phase: "investigating",
					evidence: [...project.evidence, evidence]
				};
			});
		}
		updateQuestion(request) {
			return this.update(request.id, (project) => {
				const index = project.questions.findIndex((item) => item.id === request.questionId);
				if (index < 0) throw new Error(`deepresearch: question ${request.questionId} not found`);
				const current = project.questions[index];
				const questions = [...project.questions];
				const inferredCriterionStatus = request.status === "covered" ? "covered" : request.status === "partial" ? "partial" : request.status === "blocked" || request.status === "failed" ? "blocked" : void 0;
				const criteria = request.criteria ?? (inferredCriterionStatus === void 0 ? current.criteria : current.criteria.map((criterion) => ({
					...criterion,
					status: inferredCriterionStatus
				})));
				questions[index] = {
					...current,
					status: request.status,
					criteria,
					gaps: deriveQuestionGaps(criteria)
				};
				const settled = questions.every((question) => [
					"covered",
					"partial",
					"blocked"
				].includes(question.status));
				return {
					...project,
					questions,
					phase: settled ? "ready_for_report" : "investigating"
				};
			});
		}
		complete(request) {
			return this.update(request.id, (project) => {
				const report = requiredText(request.report, "report");
				if (report.length > this.config.maxReportChars) throw new RangeError(`deepresearch: report exceeds ${this.config.maxReportChars} characters`);
				const limitations = normalizeList(request.limitations ?? collectLimitations(project));
				cleanupProjectArtifacts(project.id);
				return {
					...project,
					phase: "done",
					runState: "idle",
					report,
					conclusions: normalizeList(request.conclusions ?? project.conclusions),
					limitations,
					progress: emptyProgress$1()
				};
			});
		}
		fail(request) {
			this.stopRun(request.id);
			if (request.aborted === true) return this.markPaused(request.id);
			cleanupProjectArtifacts(request.id);
			return this.update(request.id, (project) => ({
				...project,
				phase: "failed",
				runState: "idle",
				limitations: normalizeList([...project.limitations, requiredText(request.reason, "reason")]),
				progress: emptyProgress$1()
			}));
		}
		async resume(request) {
			const phase = resumeRunnerPhase(this.require(request.id));
			const project = await this.update(request.id, (current) => ({
				...current,
				runState: "running",
				phase: resumeProjectPhase(current, phase)
			}));
			if (this.config.runnerEnabled) this.launch(request.id, phase);
			return project;
		}
		async writeReport(request) {
			if (!this.require(request.id).planConfirmed) throw new Error(`deepresearch: project ${request.id} plan is not confirmed`);
			this.stopRun(request.id);
			const project = await this.update(request.id, (current) => ({
				...current,
				phase: "writing",
				runState: "running",
				limitations: collectLimitations(current)
			}));
			if (this.config.runnerEnabled) this.launch(request.id, "writing");
			return project;
		}
		delete(request) {
			this.stopRun(request.id);
			cleanupProjectArtifacts(request.id);
			return this.enqueue(async () => {
				const table = this.requireTable();
				const deleted = table.get(request.id) !== void 0;
				if (deleted) await table.delete(request.id);
				return { deleted };
			});
		}
		launch(id, phase) {
			const active = this.activeRuns.get(id);
			if (active !== void 0) {
				if (active.phase !== phase) active.promise?.then(() => {
					this.launch(id, phase);
				});
				return;
			}
			const run = {
				phase,
				controller: new AbortController(),
				handles: [],
				planRejects: 0
			};
			this.activeRuns.set(id, run);
			run.promise = (phase === "planning" ? this.runPlanning(id, run) : phase === "writing" ? this.runWritingPhase(id, run) : this.runInvestigation(id, run)).catch(async (cause) => {
				if (run.controller.signal.aborted || this.requireTable().get(id) === void 0) return;
				const reason = cause instanceof Error ? cause.message : String(cause);
				await this.update(id, (project) => ({
					...project,
					phase: "failed",
					runState: "idle",
					limitations: normalizeList([...project.limitations, `Runner failed: ${reason}`])
				}));
			}).finally(async () => {
				this.activeRuns.delete(id);
				await Promise.allSettled(run.handles.map((handle) => handle.dispose()));
			});
		}
		async runPlanning(id, run) {
			const project = this.require(id);
			let submitted = false;
			await this.spawnRole(id, run, {
				tools: ["deep_research_submit_plan"],
				system: planningSystemPrompt(project, planLimits(project.depth, this.config)),
				user: planningUserPrompt(project),
				nudge: planningNudgePrompt(),
				register: (ctx) => {
					ctx.tools.register(defineTool({
						name: "deep_research_submit_plan",
						description: "Submit the generated plan for user review. This ends the planning run. Oversized plans are rejected — shrink and call again.",
						parameters: {
							goal: {
								type: "string",
								required: true
							},
							constraints: { type: "string" },
							depth: {
								type: "string",
								required: true,
								enum: [
									"quick",
									"standard",
									"deep"
								]
							},
							questions: {
								type: "array",
								required: true,
								items: {
									type: "object",
									additionalProperties: false,
									properties: {
										text: {
											type: "string",
											required: true
										},
										criteria: {
											type: "array",
											required: true,
											items: { type: "string" }
										},
										dependsOn: {
											type: "array",
											items: { type: "number" }
										}
									}
								}
							}
						},
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							try {
								const current = this.require(id);
								const constraints = String(args.constraints ?? "").trim() || current.constraints;
								const updated = await this.updatePlan({
									id,
									goal: String(args.goal ?? ""),
									constraints,
									depth: args.depth,
									questions: args.questions
								});
								run.planRejects = 0;
								submitted = true;
								return { text: JSON.stringify({
									ok: true,
									phase: updated.phase,
									questionCount: updated.questions.length
								}) };
							} catch (error) {
								if (!isOversizedPlanError(error)) throw error;
								run.planRejects += 1;
								if (run.planRejects >= 3) throw new Error(`${error instanceof Error ? error.message : String(error)} Gave up after 3 oversized submissions.`);
								return { text: JSON.stringify({
									ok: false,
									error: error instanceof Error ? error.message : String(error)
								}) };
							}
						},
						presentCall: () => presentGeneric("edit", "Submit research plan", id)
					}));
				},
				done: () => submitted
			});
			if (run.controller.signal.aborted) return;
			const latest = this.get({ id });
			if (latest !== null && latest.phase === "planning") throw new Error("the planning agent stopped before submitting a plan");
		}
		async runInvestigation(id, run) {
			this.requireWeb();
			while (!run.controller.signal.aborted) {
				const project = this.require(id);
				const { ready, waiting } = selectReadyWaveBatch(project.questions, 3);
				if (ready.length === 0) break;
				let progress = project.progress;
				for (const item of waiting) progress = mergeScoutProgress(progress, emptyScoutProgress(item.question.id, {
					role: "waiting",
					status: "waiting",
					waitingOn: item.waitingOn,
					activity: "Waiting on upstream sub-questions."
				}));
				await this.update(id, (current) => ({
					...current,
					progress
				}));
				const rejected = (await Promise.allSettled(ready.map((question) => this.runScoutForQuestion(id, run, question.id)))).find((item) => item.status === "rejected");
				if (rejected !== void 0 && !run.controller.signal.aborted) throw rejected.reason;
			}
			if (run.controller.signal.aborted) return;
			await this.runWritingPhase(id, run);
		}
		async runWritingPhase(id, run) {
			if (run.controller.signal.aborted) return;
			const accepted = this.require(id).evidence.filter((item) => item.status === "accepted");
			await this.update(id, (current) => ({
				...current,
				phase: "writing",
				runState: current.runState === "paused" ? "paused" : "running",
				limitations: collectLimitations(current),
				progress: mergeScoutProgress(current.progress, emptyScoutProgress(current.questions[0]?.id ?? ResearchQuestionId("writing"), {
					role: "writing",
					status: "running",
					activity: "Writing the report from the verified pack."
				}))
			}));
			if (run.controller.signal.aborted) return;
			await this.runWriting(id, run);
			if (run.controller.signal.aborted) return;
			cleanupProjectArtifacts(id);
			const finished = this.require(id);
			if ([
				"investigating",
				"ready_for_report",
				"writing"
			].includes(finished.phase) && accepted.length === 0) await this.update(id, (current) => ({
				...current,
				phase: "incomplete",
				runState: "idle",
				report: current.report ?? "Investigation finished without accepted evidence.",
				limitations: collectLimitations(current),
				progress: emptyProgress$1()
			}));
			if ([
				"investigating",
				"ready_for_report",
				"writing"
			].includes(this.require(id).phase)) throw new Error("the research agent stopped before saving a report");
		}
		async runScoutForQuestion(id, run, questionId) {
			const project = this.require(id);
			const question = project.questions.find((item) => item.id === questionId);
			if (question === void 0) return;
			const dependency = collectDependencyContext(question, project.questions, project.evidence);
			await this.update(id, (current) => ({
				...current,
				questions: current.questions.map((item) => item.id === questionId ? {
					...item,
					status: "running"
				} : item),
				progress: mergeScoutProgress(current.progress, emptyScoutProgress(questionId, {
					role: "scout",
					status: "running",
					dependencySummary: dependency.text,
					activity: "Starting scout."
				}))
			}));
			for (const criterion of question.criteria) {
				if (run.controller.signal.aborted) return;
				if ([
					"covered",
					"partial",
					"blocked"
				].includes(criterion.status)) continue;
				await this.runCriterion(id, run, questionId, criterion.id, dependency.text);
			}
			if (run.controller.signal.aborted) return;
			const after = this.require(id);
			const latestQuestion = after.questions.find((item) => item.id === questionId);
			if (latestQuestion === void 0) return;
			const acceptedCount = after.evidence.filter((item) => item.questionId === questionId && item.status === "accepted").length;
			const status = questionStatusFromCoverage(latestQuestion.criteria, acceptedCount);
			const handoff = buildScoutHandoff({
				...latestQuestion,
				status
			}, after.evidence);
			await this.update(id, (current) => {
				const questions = current.questions.map((item) => item.id === questionId ? {
					...item,
					status,
					gaps: deriveQuestionGaps(item.criteria),
					handoff
				} : item);
				const settled = questions.every((item) => [
					"covered",
					"partial",
					"blocked"
				].includes(item.status));
				return {
					...current,
					questions,
					phase: settled ? "ready_for_report" : "investigating",
					progress: mergeScoutProgress(current.progress, {
						...emptyScoutProgress(questionId),
						role: "scout",
						status: status === "covered" ? "done" : status === "partial" ? "partial" : "blocked",
						handoff,
						activity: "Question settled.",
						toolsCap: 10
					})
				};
			});
		}
		async runCriterion(id, run, questionId, criterionId, dependencyContext) {
			const project = this.require(id);
			const question = project.questions.find((item) => item.id === questionId);
			const criterion = question?.criteria.find((item) => item.id === criterionId);
			if (question === void 0 || criterion === void 0) return;
			const urlIndex = /* @__PURE__ */ new Map();
			const knownQueries = /* @__PURE__ */ new Set();
			let toolsUsed = 0;
			let fuseRejectCount = 0;
			let forceAfterFuseMiss = false;
			let submitted = false;
			let submittedCandidates = [];
			let submittedSummary = "";
			let submittedGap = "";
			const web = this.requireWeb();
			const toolsCap = 10;
			const patchScout = async (patch) => {
				await this.update(id, (current) => {
					const previous = current.progress.scouts.find((item) => item.questionId === questionId) ?? emptyScoutProgress(questionId);
					return {
						...current,
						progress: mergeScoutProgress(current.progress, {
							...previous,
							role: "scout",
							status: "running",
							activeCriterionId: criterionId,
							activeCriterionText: criterion.text,
							toolsUsed,
							toolsCap,
							...patch
						})
					};
				});
			};
			await this.spawnRole(id, run, {
				tools: [
					"research_web_search",
					"research_web_fetch",
					"read_artifact",
					"submit_criterion_candidates"
				],
				system: scoutSystemPrompt(),
				user: scoutUserPrompt({
					question: project.question,
					goal: project.goal,
					subQuestion: question.text,
					criterionId,
					criterionText: criterion.text,
					toolsCap,
					toolsUsed: 0,
					dependencyContext
				}),
				nudge: scoutNudgePrompt(),
				register: (ctx) => {
					ctx.tools.register(defineTool({
						name: "research_web_search",
						description: "Search the web for the current Deep Research criterion. criterionId must match the current target. Counts toward the per-criterion fuse.",
						parameters: {
							query: {
								type: "string",
								required: true
							},
							criterionId: {
								type: "string",
								required: true
							},
							max_results: { type: "number" }
						},
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							if (toolsUsed >= toolsCap) {
								fuseRejectCount += 1;
								if (fuseRejectCount >= 2) forceAfterFuseMiss = true;
								return { text: `Tool fuse reached (${toolsCap}/${toolsCap}). Call submit_criterion_candidates with your candidates now.` };
							}
							if (String(args.criterionId ?? "") !== criterionId) throw new Error(`Search rejected: current target criterion is ${criterionId}`);
							const query = String(args.query ?? "").trim();
							const normalized = normalizeQuery(query);
							if (normalized === "") throw new Error("Search rejected: query is required");
							if (knownQueries.has(normalized)) throw new Error("Search rejected: duplicate query for this criterion");
							knownQueries.add(normalized);
							await this.reserveBudget(id, "searches");
							toolsUsed += 1;
							const priorTools = this.require(id).progress.scouts.find((item) => item.questionId === questionId)?.tools ?? [];
							await patchScout({
								activity: `Search: ${query}`,
								tools: pushProgressTool(priorTools, {
									name: "research_web_search",
									detail: query,
									status: "running"
								})
							});
							const result = await web.search({
								query,
								maxResults: typeof args.max_results === "number" ? args.max_results : 8
							}, run.controller.signal);
							indexSearchResult(urlIndex, result.sources);
							await patchScout({
								activity: `Search: ${query}`,
								tools: pushProgressTool(priorTools, {
									name: "research_web_search",
									detail: query,
									status: "done"
								})
							});
							return { text: appendToolBudgetNote({
								content: result.content,
								sources: result.sources
							}, toolsUsed, toolsCap) };
						},
						presentCall: (args) => presentGeneric("search", "Research search", args?.query)
					}));
					ctx.tools.register(defineTool({
						name: "research_web_fetch",
						description: "Fetch a live web page. Returns artifactId for read_artifact. Counts toward the per-criterion fuse.",
						parameters: { url: {
							type: "string",
							required: true
						} },
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							if (toolsUsed >= toolsCap) {
								fuseRejectCount += 1;
								if (fuseRejectCount >= 2) forceAfterFuseMiss = true;
								return { text: `Tool fuse reached (${toolsCap}/${toolsCap}). Call submit_criterion_candidates with your candidates now.` };
							}
							const url = normalizeUrl(String(args.url ?? ""));
							if (url === "") throw new Error("Fetch rejected: url is required");
							await this.reserveBudget(id, "fetches");
							toolsUsed += 1;
							const fetched = await web.fetch({ url }, run.controller.signal);
							const body = fetched.body.content ?? "";
							const artifact = await persistArtifact({
								projectId: id,
								questionId,
								criterionId,
								url,
								body
							});
							indexFetchResult(urlIndex, url, artifact?.preview ?? body, artifact?.artifactId ?? "", fetched.url);
							await patchScout({
								activity: `Fetch: ${url}`,
								tools: pushProgressTool(this.require(id).progress.scouts.find((item) => item.questionId === questionId)?.tools ?? [], {
									name: "research_web_fetch",
									detail: url,
									status: "done"
								})
							});
							return { text: appendToolBudgetNote({
								url: fetched.url,
								statusCode: fetched.statusCode,
								artifactId: artifact?.artifactId ?? null,
								artifactPersisted: artifact !== null,
								preview: artifact?.preview ?? "",
								artifactNote: artifact === null ? "No artifact persisted (empty body)." : "Use this exact artifactId with read_artifact."
							}, toolsUsed, toolsCap) };
						},
						presentCall: (args) => presentGeneric("search", "Research fetch", args?.url)
					}));
					ctx.tools.register(defineTool({
						name: "read_artifact",
						description: "Read more context from a source artifact previously fetched in this criterion. Successful reads count toward the fuse. Missing ids do not.",
						parameters: {
							artifactId: {
								type: "string",
								required: true
							},
							offset: { type: "number" },
							maxChars: { type: "number" }
						},
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							if (toolsUsed >= toolsCap) {
								fuseRejectCount += 1;
								if (fuseRejectCount >= 2) forceAfterFuseMiss = true;
								return { text: `Tool fuse reached (${toolsCap}/${toolsCap}). Call submit_criterion_candidates with your candidates now.` };
							}
							try {
								const result = await readArtifact({
									projectId: id,
									questionId,
									criterionId,
									artifactId: String(args.artifactId ?? ""),
									offset: typeof args.offset === "number" ? args.offset : 0,
									maxChars: typeof args.maxChars === "number" ? args.maxChars : 4e3
								});
								toolsUsed += 1;
								await patchScout({ activity: `Read artifact ${result.artifactId}` });
								return { text: appendToolBudgetNote(result, toolsUsed, toolsCap) };
							} catch (error) {
								return { text: `${error instanceof Error ? error.message : String(error)} Failed read did not consume the fuse.` };
							}
						},
						presentCall: (args) => presentGeneric("search", "Read artifact", args?.artifactId)
					}));
					ctx.tools.register(defineTool({
						name: "submit_criterion_candidates",
						description: "End search/fetch for the current criterion and deliver candidate findings. Does not count toward the fuse.",
						parameters: {
							candidates: {
								type: "array",
								required: true,
								items: {
									type: "object",
									additionalProperties: false,
									properties: {
										claim: { type: "string" },
										confidence: {
											type: "string",
											enum: [
												"low",
												"medium",
												"high"
											]
										},
										riskFlags: {
											type: "array",
											items: { type: "string" }
										},
										sources: {
											type: "array",
											items: {
												type: "object",
												additionalProperties: false,
												properties: {
													url: { type: "string" },
													snippet: { type: "string" },
													artifactId: { type: "string" }
												}
											}
										}
									}
								}
							},
							summary: {
								type: "string",
								required: true
							},
							gap: {
								type: "string",
								required: true
							}
						},
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							submittedCandidates = normalizeSubmittedCandidates(args.candidates, criterionId);
							submittedSummary = String(args.summary ?? "");
							submittedGap = String(args.gap ?? "");
							submitted = true;
							await patchScout({
								activity: `Submitted ${submittedCandidates.length} candidate(s).`,
								scoutDraft: submittedSummary
							});
							return { text: JSON.stringify({
								ok: true,
								acceptedForVerification: submittedCandidates.length
							}) };
						},
						presentCall: () => presentGeneric("edit", "Submit candidates", criterionId)
					}));
				},
				done: () => submitted || forceAfterFuseMiss,
				onDraft: (text) => {
					const draft = readableRoleDraft(text);
					if (draft !== "") patchScout({ scoutDraft: draft });
				},
				lastText: (text) => {
					if (submitted) return;
					const parsed = parseCandidatesFromText(text, criterionId);
					submittedCandidates = parsed.candidates;
					submittedSummary = parsed.summary;
					submittedGap = parsed.gap;
					submitted = true;
				}
			});
			if (run.controller.signal.aborted) return;
			const { accepted: gated, rejected: urlRejected } = gateCandidatesByUrl(submittedCandidates, urlIndex);
			const review = await this.runEvaluator(id, run, question, criterion, gated, submittedSummary, submittedGap);
			if (run.controller.signal.aborted) return;
			const verdictById = new Map(review.verdicts.map((item) => [item.candidateId, item]));
			const accepted = gated.filter((item) => isAcceptedVerdict(verdictById.get(item.id)));
			for (const candidate of accepted) {
				const verdict = verdictById.get(candidate.id);
				const sources = uniqueSources((verdict?.sources.length ? verdict.sources : candidate.sources).map((source) => {
					const artifactId = candidate.sources.find((item) => item.url === source.url)?.artifactId;
					return artifactId ? {
						url: source.url,
						snippet: source.snippet,
						artifactId
					} : {
						url: source.url,
						snippet: source.snippet
					};
				}));
				await this.addEvidence({
					id,
					questionId,
					criterionIds: [criterionId],
					source: sources[0]?.url || candidate.claim,
					url: sources[0]?.url,
					snippet: sources[0]?.snippet,
					sources,
					claim: candidate.claim,
					confidence: candidate.confidence,
					status: "accepted"
				}).catch(() => void 0);
			}
			const acceptedCount = this.require(id).evidence.filter((item) => item.questionId === questionId && item.criterionIds.includes(criterionId) && item.status === "accepted").length;
			const coverage = criterionStatusFromReview(review.decision, acceptedCount);
			const reason = review.warnings.join("; ") || urlRejected[0]?.reason || coverage.reason;
			await this.update(id, (current) => ({
				...current,
				questions: current.questions.map((item) => item.id !== questionId ? item : {
					...item,
					criteria: item.criteria.map((entry) => entry.id !== criterionId ? entry : {
						...entry,
						status: coverage.status,
						summary: review.summary,
						gap: review.gap,
						warning: review.warnings.join("; "),
						verification: review.decision,
						toolCount: toolsUsed
					}),
					gaps: deriveQuestionGaps(item.criteria.map((entry) => entry.id !== criterionId ? entry : {
						...entry,
						status: coverage.status,
						gap: review.gap
					}))
				}),
				progress: mergeScoutProgress(current.progress, {
					...current.progress.scouts.find((item) => item.questionId === questionId) ?? emptyScoutProgress(questionId),
					activity: reason,
					toolsUsed,
					toolsCap
				})
			}));
			await cleanupCriterionArtifacts(id, questionId, criterionId);
		}
		async runEvaluator(id, run, question, criterion, gated, scoutSummary, scoutGap) {
			let submitted = gated.length === 0 ? {
				decision: "FAIL",
				warnings: [],
				verdicts: [],
				summary: scoutSummary,
				gap: scoutGap || "No attributable candidates were verified."
			} : null;
			if (submitted !== null) return submitted;
			let artifactReads = 0;
			await this.update(id, (current) => {
				const previous = current.progress.scouts.find((item) => item.questionId === question.id) ?? emptyScoutProgress(question.id);
				return {
					...current,
					progress: mergeScoutProgress(current.progress, {
						...previous,
						role: "evaluator",
						status: "verifying",
						activity: "Evaluator reviewing candidates.",
						activeCriterionId: criterion.id,
						activeCriterionText: criterion.text
					})
				};
			});
			await this.spawnRole(id, run, {
				tools: ["read_artifact", "submit_criterion_review"],
				system: evaluatorSystemPrompt(),
				user: evaluatorUserPrompt({
					subQuestion: question.text,
					criterionId: criterion.id,
					criterionText: criterion.text,
					scoutSummary,
					scoutGap,
					candidatesJson: JSON.stringify(gated.map((item) => ({
						candidateId: item.id,
						claim: item.claim,
						confidence: item.confidence,
						riskFlags: item.riskFlags,
						sources: item.sources.map((source) => ({
							url: source.url,
							snippet: source.snippet,
							artifactId: source.artifactId,
							toolText: source.toolText
						}))
					})), null, 2)
				}),
				nudge: evaluatorNudgePrompt(),
				register: (ctx) => {
					ctx.tools.register(defineTool({
						name: "read_artifact",
						description: "Read an artifact from the Scout run. Failed/missing ids do not consume the evaluator read budget.",
						parameters: {
							artifactId: {
								type: "string",
								required: true
							},
							offset: { type: "number" },
							maxChars: { type: "number" }
						},
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							if (artifactReads >= 3) return { text: "Artifact read budget reached (3/3). Submit your review now." };
							try {
								const result = await readArtifact({
									projectId: id,
									questionId: question.id,
									criterionId: criterion.id,
									artifactId: String(args.artifactId ?? ""),
									offset: typeof args.offset === "number" ? args.offset : 0,
									maxChars: typeof args.maxChars === "number" ? args.maxChars : 4e3
								});
								artifactReads += 1;
								await this.update(id, (current) => {
									const previous = current.progress.scouts.find((item) => item.questionId === question.id) ?? emptyScoutProgress(question.id);
									return {
										...current,
										progress: mergeScoutProgress(current.progress, {
											...previous,
											activity: `Evaluator read ${result.artifactId}`
										})
									};
								});
								return { text: JSON.stringify(result) };
							} catch (error) {
								return { text: `${error instanceof Error ? error.message : String(error)} Failed read did not consume the artifact-read budget.` };
							}
						},
						presentCall: (args) => presentGeneric("search", "Read artifact", args?.artifactId)
					}));
					ctx.tools.register(defineTool({
						name: "submit_criterion_review",
						description: "Finish evaluator review for the current criterion.",
						parameters: {
							decision: {
								type: "string",
								required: true,
								enum: [
									"PASS",
									"WARNING",
									"FAIL"
								]
							},
							warnings: {
								type: "array",
								items: { type: "string" }
							},
							verdicts: {
								type: "array",
								required: true,
								items: {
									type: "object",
									additionalProperties: false,
									properties: {
										candidateId: { type: "string" },
										supported: { type: "boolean" },
										relevantToCriterion: { type: "boolean" },
										reason: { type: "string" },
										sources: {
											type: "array",
											items: {
												type: "object",
												additionalProperties: false,
												properties: {
													url: { type: "string" },
													snippet: { type: "string" }
												}
											}
										}
									}
								}
							},
							summary: {
								type: "string",
								required: true
							},
							gap: {
								type: "string",
								required: true
							}
						},
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							submitted = normalizeReview(args, gated, scoutSummary, scoutGap);
							return { text: JSON.stringify({
								ok: true,
								message: "Criterion review recorded."
							}) };
						},
						presentCall: () => presentGeneric("edit", "Submit review", criterion.id)
					}));
				},
				done: () => submitted !== null,
				onDraft: (text) => {
					const draft = readableRoleDraft(text);
					if (draft === "") return;
					this.update(id, (current) => {
						const previous = current.progress.scouts.find((item) => item.questionId === question.id) ?? emptyScoutProgress(question.id);
						return {
							...current,
							progress: mergeScoutProgress(current.progress, {
								...previous,
								evaluatorDraft: draft
							})
						};
					});
				},
				lastText: (text) => {
					if (submitted !== null) return;
					submitted = parseReviewFromText(text, gated, scoutSummary, scoutGap);
				}
			});
			if (run.controller.signal.aborted) return submitted ?? {
				decision: "WARNING",
				warnings: ["Review stopped by user."],
				verdicts: [],
				summary: scoutSummary,
				gap: scoutGap
			};
			return submitted ?? {
				decision: "WARNING",
				warnings: [],
				verdicts: gated.map((item) => ({
					candidateId: item.id,
					supported: false,
					relevantToCriterion: false,
					reason: "Evaluator did not submit a review.",
					sources: []
				})),
				summary: scoutSummary,
				gap: scoutGap
			};
		}
		async runWriting(id, run) {
			const project = this.require(id);
			let submitted = false;
			await this.spawnRole(id, run, {
				tools: ["deep_research_complete"],
				system: writerSystemPrompt(project.depth),
				user: writerUserPrompt(buildResearchWritingPack(project)),
				nudge: writerNudgePrompt(),
				register: (ctx) => {
					ctx.tools.register(defineTool({
						name: "deep_research_complete",
						description: "Save the evidence-based report. Write limitations into the report body.",
						parameters: {
							report: {
								type: "string",
								required: true
							},
							conclusions: {
								type: "array",
								items: { type: "string" }
							},
							limitations: {
								type: "array",
								items: { type: "string" }
							},
							partial: { type: "boolean" }
						},
						output: {
							schema: TEXT_OUTPUT,
							render: (_args, value) => [{
								type: "text",
								text: value.text
							}]
						},
						execute: async (args) => {
							const completed = await this.complete({
								id,
								report: String(args.report ?? ""),
								conclusions: args.conclusions,
								limitations: args.limitations,
								partial: Boolean(args.partial)
							});
							submitted = true;
							return { text: projectSummary(completed) };
						},
						presentCall: () => presentGeneric("edit", "Complete deep research", id)
					}));
				},
				done: () => submitted,
				onDraft: (text) => {
					this.update(id, (current) => current.phase === "writing" ? {
						...current,
						report: text
					} : current);
				}
			});
		}
		async spawnRole(_id, run, spec) {
			const selection = this.ctx.agentDefaultModel.currentSelection();
			const handle = await this.ctx.agents.create({
				sessionId: SessionId(`deepresearch-run-${randomUUID()}`),
				meta: {
					cwd: resolve(this.config.runnerCwd),
					origin: "subagent",
					delegationDepth: 1
				},
				agentOptions: {
					provider: selection.provider,
					model: selection.model
				},
				signal: run.controller.signal,
				setup: async (agentCtx) => {
					await this.ctx.agentPresets.mount(agentCtx, "standard");
					agentCtx.tools.restrict({ allow: [] });
					spec.register(agentCtx);
					agentCtx.systemPrompt.section({
						name: "deepresearch:runner",
						order: 1e4,
						text: spec.system
					});
				}
			});
			run.handles.push(handle);
			if (run.controller.signal.aborted) {
				await handle.dispose();
				const early = run.handles.indexOf(handle);
				if (early >= 0) run.handles.splice(early, 1);
				return;
			}
			const stopDraft = watchDraft(handle, (text) => {
				spec.onDraft?.(text);
			});
			try {
				handle.agent.followup(createUserMessage({
					content: [{
						type: "text",
						text: spec.user
					}],
					source: { kind: "user" }
				}));
				await handle.agent.whenIdle();
				if (run.controller.signal.aborted) return;
				spec.onDraft?.(lastAssistantText(handle));
				if (!spec.done() && !run.controller.signal.aborted) {
					handle.agent.followup(createUserMessage({
						content: [{
							type: "text",
							text: spec.nudge
						}],
						source: { kind: "user" }
					}));
					await handle.agent.whenIdle();
					if (run.controller.signal.aborted) return;
					spec.onDraft?.(lastAssistantText(handle));
				}
				if (!spec.done() && !run.controller.signal.aborted && spec.lastText !== void 0) spec.lastText(lastAssistantText(handle));
			} finally {
				stopDraft();
				await handle.dispose();
				const index = run.handles.indexOf(handle);
				if (index >= 0) run.handles.splice(index, 1);
			}
		}
		markPaused(id) {
			const current = this.requireTable().get(id);
			if (current !== void 0) this.emitProgress(snapshot({
				...current,
				runState: "paused",
				updatedAt: Math.max(Date.now(), current.updatedAt + 1)
			}));
			return this.update(id, (project) => ({
				...project,
				runState: "paused"
			}));
		}
		stopRun(id) {
			const run = this.activeRuns.get(id);
			if (run === void 0) return;
			run.controller.abort();
			for (const handle of run.handles) handle.agent.cancel({ kind: "user" });
		}
		async reserveBudget(id, tool) {
			let exhausted = false;
			await this.update(id, (project) => {
				if (tool === "searches" && project.budget.searchesUsed >= project.budget.maxSearches) {
					exhausted = true;
					return project;
				}
				if (tool === "fetches" && project.budget.fetchesUsed >= project.budget.maxFetches) {
					exhausted = true;
					return project;
				}
				return {
					...project,
					budget: tool === "searches" ? {
						...project.budget,
						searchesUsed: project.budget.searchesUsed + 1
					} : {
						...project.budget,
						fetchesUsed: project.budget.fetchesUsed + 1
					}
				};
			});
			if (exhausted) throw new Error(tool === "searches" ? "Session search safety budget exhausted" : "Session fetch safety budget exhausted");
		}
		buildQuestions(input, depth) {
			assertPlanFitsDepth(depth, input, this.config);
			const ids = input.map(() => ResearchQuestionId(`rq-${randomUUID()}`));
			return input.map((item, index) => ({
				id: ids[index],
				text: requiredText(item.text, `questions[${index}].text`),
				dependsOn: (item.dependsOn ?? []).map((dep) => {
					const depId = ids[dep];
					if (depId === void 0 || dep >= index) throw new TypeError(`deepresearch: questions[${index}] has invalid dependency ${dep}`);
					return depId;
				}),
				status: "pending",
				criteria: item.criteria.map((text, criterionIndex) => ({
					id: `c${index + 1}.${criterionIndex + 1}`,
					text: requiredText(text, `questions[${index}].criteria[${criterionIndex}]`),
					status: "missing",
					summary: "",
					gap: "",
					warning: "",
					verification: "",
					toolCount: 0
				})),
				gaps: [],
				handoff: ""
			}));
		}
		require(id) {
			const project = this.get({ id });
			if (project === null) throw new Error(`deepresearch: project ${id} not found`);
			return project;
		}
		requireWeb() {
			const web = this.ctx.get("web");
			if (web === void 0) throw new Error("ctx.web is not available; mount a search provider and @deepseek-ai/dsh-web-fetch-http for research fetch");
			return web;
		}
		update(id, mutate) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				const current = table.get(id);
				if (current === void 0) throw new Error(`deepresearch: project ${id} not found`);
				const project = snapshot({
					...mutate(snapshot(current)),
					updatedAt: Math.max(Date.now(), current.updatedAt + 1)
				});
				await table.put(id, project);
				this.emitProgress(project);
				return snapshot(project);
			});
		}
		emitProgress(project) {
			this.ctx.emit("deepResearch/progress", snapshot(project));
		}
		enqueue(operation) {
			const result = this.mutationTail.then(operation);
			this.mutationTail = result.then(() => void 0, () => void 0);
			return result;
		}
		requireTable() {
			if (this.table === void 0) throw new Error("deepresearch: durable domain is not initialized");
			return this.table;
		}
	};
})();
function presentGeneric(kind, title, rawInput) {
	let text = "";
	try {
		text = typeof rawInput === "string" ? rawInput : rawInput == null ? "" : JSON.stringify(rawInput);
	} catch {
		text = title;
	}
	return {
		card: "generic",
		kind,
		title,
		rawInput: text
	};
}
function seedInvestigationProgress(project) {
	return project.questions.reduce((progress, question) => mergeScoutProgress(progress, emptyScoutProgress(question.id, {
		role: "waiting",
		status: "waiting",
		waitingOn: [...question.dependsOn],
		activity: question.dependsOn.length > 0 ? "Waiting on upstream sub-questions." : "Queued for the next scout wave."
	})), emptyProgress$1());
}
function requiredText(value, field) {
	const text = value.trim();
	if (text === "") throw new TypeError(`deepresearch: ${field} must not be blank`);
	return text;
}
function optionalText(value) {
	return value?.trim() ?? "";
}
function normalizeList(values) {
	return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
function researchText(project) {
	return [
		project.title,
		project.question,
		project.goal,
		project.constraints,
		project.seedText,
		project.report ?? "",
		...project.questions.flatMap((question) => [
			question.text,
			question.handoff,
			...question.gaps,
			...question.criteria.flatMap((criterion) => [
				criterion.text,
				criterion.summary,
				criterion.gap,
				criterion.warning
			])
		]),
		...project.evidence.flatMap((evidence) => [
			evidence.source,
			evidence.url ?? "",
			evidence.claim,
			evidence.snippet
		])
	].join("\n").toLocaleLowerCase();
}
function projectSummary(project) {
	return `${project.title} (${project.id})\nPhase: ${project.phase}; questions: ${project.questions.length}; evidence: ${project.evidence.length}\n${project.question}`;
}
function hydrateCriterion(criterion) {
	return {
		...criterion,
		warning: criterion.warning ?? "",
		verification: criterion.verification ?? "",
		toolCount: criterion.toolCount ?? 0
	};
}
function hydrateQuestion(question) {
	return {
		...question,
		dependsOn: [...question.dependsOn],
		gaps: [...question.gaps ?? []],
		handoff: question.handoff ?? "",
		criteria: question.criteria.map(hydrateCriterion)
	};
}
function hydrateEvidence(item) {
	const sources = uniqueSources(item.sources?.length ? item.sources : item.url || item.snippet ? [{
		url: item.url ?? "",
		snippet: item.snippet
	}] : []);
	return {
		...item,
		criterionIds: [...item.criterionIds],
		status: item.status ?? "accepted",
		url: sources[0]?.url || item.url,
		snippet: sources[0]?.snippet || item.snippet,
		sources
	};
}
function resumeRunnerPhase(project) {
	if (!project.planConfirmed || project.phase === "planning" || project.phase === "awaiting_plan_confirm") return "planning";
	if (project.phase === "writing" || project.phase === "done") return "writing";
	return "investigating";
}
function resumeProjectPhase(project, phase) {
	if (phase === "planning") return project.planConfirmed ? project.phase : project.phase === "failed" || project.phase === "aborted" ? "planning" : project.phase;
	if (phase === "writing") return "writing";
	if (project.phase === "aborted" || project.phase === "failed" && project.planConfirmed) return "investigating";
	return project.phase;
}
function snapshot(project) {
	return Object.freeze({
		...project,
		runState: project.runState ?? ([
			"planning",
			"investigating",
			"writing"
		].includes(project.phase) ? "running" : "idle"),
		questions: project.questions.map((question) => Object.freeze(hydrateQuestion(question))),
		evidence: project.evidence.map((item) => Object.freeze(hydrateEvidence(item))),
		conclusions: [...project.conclusions],
		limitations: [...project.limitations],
		budget: Object.freeze({ ...project.budget }),
		progress: Object.freeze({
			running: project.progress?.running ?? 0,
			waiting: project.progress?.waiting ?? 0,
			scouts: (project.progress?.scouts ?? []).map((scout) => Object.freeze({
				questionId: scout.questionId,
				role: scout.role ?? "waiting",
				status: scout.status ?? "waiting",
				waitingOn: [...scout.waitingOn ?? []],
				toolsUsed: scout.toolsUsed ?? 0,
				toolsCap: scout.toolsCap ?? 0,
				activity: scout.activity ?? "",
				tools: [...scout.tools ?? []],
				scoutDraft: scout.scoutDraft ?? "",
				evaluatorDraft: scout.evaluatorDraft ?? "",
				activeCriterionId: scout.activeCriterionId ?? "",
				activeCriterionText: scout.activeCriterionText ?? "",
				dependencySummary: scout.dependencySummary ?? "",
				handoff: scout.handoff ?? ""
			}))
		})
	});
}
function lastAssistantText(handle) {
	const agent = handle.agent;
	const messages = Array.isArray(agent.messages) ? agent.messages : Array.isArray(agent.session?.messages) ? agent.session.messages : [];
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message.role !== "assistant") continue;
		const text = messageText(message.content);
		if (text !== "") return text;
	}
	return "";
}
function messageText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.map((block) => typeof block === "string" ? block : String(block.text ?? "")).join("");
}
function watchDraft(handle, onDraft) {
	let last = "";
	let streamed = "";
	let timer;
	const push = (text) => {
		const next = text.trim();
		if (next === "" || next === last) return;
		last = next;
		onDraft(next.slice(0, 4e3));
	};
	const emit = () => {
		push(streamed || lastAssistantText(handle));
	};
	const schedule = () => {
		if (timer !== void 0) return;
		timer = setTimeout(() => {
			timer = void 0;
			emit();
		}, 400);
	};
	const ctx = handle.agent.ctx;
	const offChunk = ctx?.on?.("assistant/chunk", (payload) => {
		const chunk = payload?.chunk;
		if (chunk?.type === "text-delta" && chunk.text) {
			streamed += chunk.text;
			schedule();
		}
	});
	const offMessage = ctx?.on?.("assistant/message", (payload) => {
		const text = messageText(payload?.message?.content);
		if (text !== "") {
			streamed = text;
			emit();
		}
	});
	const poll = setInterval(emit, 600);
	emit();
	return () => {
		if (timer !== void 0) clearTimeout(timer);
		clearInterval(poll);
		offChunk?.();
		offMessage?.();
	};
}
//#endregion
export { DeepResearchService, DeepResearchService as default, ResearchEvidenceId, ResearchId, ResearchQuestionId, assertPlanFitsDepth, buildResearchWritingPack, deepResearchDomainSpec, defaultDeepResearchSqlitePath, defaultDeepResearchUnitPath, defaultSharedSqlitePath, gateCandidatesByUrl, importJsonProjectsIfEmpty, importLegacySqliteProjectsIfEmpty, inferResearchPlanDepth, migrateDeepResearchUnitFile, normalizeQuery, normalizeSubmittedCandidates, normalizeUrl, parseCandidatesFromText, planResearchBudget, researchCriterionSchema, researchEvidenceSchema, researchProjectSchema, researchQuestionSchema, resolveDeepResearchUnitPath, selectReadyWaveBatch };
