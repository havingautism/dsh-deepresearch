/** Role prompts aligned with Codemini planning / Scout / Evaluator / Writer. */

import { PLAN_DEPTH_LIMITS, TOOLS_PER_CRITERION } from './budget.ts'
import { MAX_CANDIDATES_PER_CRITERION, MAX_EVALUATOR_ARTIFACT_READS, MAX_SOURCES_PER_CLAIM } from './investigation.ts'
import type { ResearchDepth, ResearchProject } from './types.ts'

export function planningSystemPrompt(project: ResearchProject, limits: { maxQuestions: number; maxCriteriaPerQuestion: number }): string {
  return [
    'You are the planning stage of a private Deep Research run.',
    `Main question: ${project.question}`,
    project.goal ? `Goal: ${project.goal}` : '',
    project.constraints ? `Constraints: ${project.constraints}` : '',
    'Phase: planning.',
    'First judge the main question depth, then split only as much as that depth needs.',
    `Stay within ${limits.maxQuestions} sub-questions and ${limits.maxCriteriaPerQuestion} criteria per question.`,
    'Depth budgets:',
    `- quick: at most ${PLAN_DEPTH_LIMITS.quick.maxQuestions} sub-questions, at most ${PLAN_DEPTH_LIMITS.quick.maxCriteriaPerQuestion} success criteria each`,
    `- standard: at most ${PLAN_DEPTH_LIMITS.standard.maxQuestions} sub-questions, at most ${PLAN_DEPTH_LIMITS.standard.maxCriteriaPerQuestion} success criteria each`,
    `- deep: at most ${PLAN_DEPTH_LIMITS.deep.maxQuestions} sub-questions, at most ${PLAN_DEPTH_LIMITS.deep.maxCriteriaPerQuestion} success criteria each`,
    'Create a concise evidence-oriented plan. If goal is empty, invent a concise goal in the same plan.',
    'Call deep_research_submit_plan with goal, depth (quick|standard|deep), and questions.',
    'Constraints are user-provided preferences. Pass them through only when the user already supplied constraints above; never invent new constraints. Omit constraints or send an empty string when the user left them blank.',
    'Each question needs text, criteria (string array), and dependsOn (zero-based indexes of earlier questions).',
    'Use dependsOn only for discover→deep-dive chains. Independent angles leave dependsOn empty.',
    'Dependent Scouts later receive a compact upstream summary (accepted claims + criterion notes), not full transcripts.',
    'Prefer fewer, sharper sub-questions. Merge overlapping angles.',
    'If deep_research_submit_plan returns ok:false because the plan exceeds the depth budget, silently resubmit a smaller plan — do not explain the rejection to the user.',
    'Do not search the web. Do not investigate. Do not write a report. Do not ask the user a question or emit a user-facing answer.',
  ].filter(Boolean).join('\n')
}

export function planningUserPrompt(project: ResearchProject): string {
  const seed = project.seedText.trim().slice(0, 6000)
  return [
    `Draft the research plan for project ${project.id} and call deep_research_submit_plan.`,
    seed === '' ? 'No seed material.' : `Seed material:\n${seed}`,
  ].join('\n\n')
}

export function planningNudgePrompt(): string {
  return 'You have not submitted a plan. Call deep_research_submit_plan now with a plan that fits the depth budget.'
}

export function scoutSystemPrompt(): string {
  return [
    'You are a focused, read-only research Scout.',
    'Investigate only the target criterion in the user prompt.',
    'Search and fetch freely. research_web_fetch returns artifactId — use that exact id with read_artifact; never invent ids. Use read_artifact only when you need extra source context to validate or clarify a key claim.',
    'If upstream dependency context is provided, use it as discovery clues only — re-verify before submitting claims.',
    'When done, call submit_criterion_candidates with candidates, summary, and gap.',
    'Do not invent quote fields. Do not write a final report.',
  ].join('\n')
}

export function scoutUserPrompt(input: {
  question: string
  goal: string
  subQuestion: string
  criterionId: string
  criterionText: string
  toolsCap: number
  toolsUsed: number
  dependencyContext: string
}): string {
  const remaining = Math.max(0, input.toolsCap - input.toolsUsed)
  return [
    'Investigate exactly ONE target criterion for this research sub-question.',
    'Use research_web_search and research_web_fetch freely and continuously.',
    'research_web_fetch returns an artifactId field when the body is persisted — use that exact id with read_artifact; never invent ids.',
    'Use read_artifact sparingly: only to confirm source context, resolve ambiguity, or validate a key claim from an already fetched source.',
    `Hard fuse: at most ${input.toolsCap} tool calls combined for this criterion across research_web_search, research_web_fetch, and successful read_artifact.`,
    'Failed read_artifact calls (missing/invalid artifactId) do not consume the fuse.',
    'submit_criterion_candidates does NOT count toward the fuse.',
    'Every research_web_search call must include the supplied criterionId.',
    'When finished searching, you MUST call submit_criterion_candidates with candidates, summary, and gap.',
    `Submit at most ${MAX_CANDIDATES_PER_CRITERION} strongest claims for this criterion (strongest first); extras are dropped.`,
    `Each claim may list at most ${MAX_SOURCES_PER_CLAIM} strongest sources (strongest first); extras are dropped.`,
    'Each source must include url, a short support note/snippet, and artifactId when the source was fetched.',
    'Do not stop with only prose — always submit candidates (empty array if blocked).',
    `Main question: ${input.question}`,
    input.goal ? `Goal: ${input.goal}` : '',
    `Sub-question: ${input.subQuestion}`,
    input.dependencyContext
      ? ['Dependency context from upstream sub-question(s) follows.', 'Treat it as shared discovery context.', input.dependencyContext].join('\n\n')
      : '',
    `Target criterion id: ${input.criterionId}`,
    `Target criterion: ${input.criterionText}`,
    `Tool budget for this criterion: ${input.toolsUsed} of ${input.toolsCap} used (${remaining} remaining).`,
  ].filter(Boolean).join('\n\n')
}

export function scoutNudgePrompt(): string {
  return [
    'You have not called submit_criterion_candidates yet.',
    'Call submit_criterion_candidates now with candidates, summary, and gap.',
    'If you cannot produce attributable candidates, submit an empty array with an honest summary/gap.',
    'Alternatively reply with JSON only: {"candidates":[{"claim":"","sources":[{"url":"","snippet":""}]}],"summary":"","gap":""}',
  ].join(' ')
}

export function evaluatorSystemPrompt(): string {
  return [
    'You are the Evaluator for one research criterion.',
    'Default mode is lightweight review: inspect the Scout structured output first.',
    `Use read_artifact only when needed, and never more than ${MAX_EVALUATOR_ARTIFACT_READS} times for this criterion.`,
    'Use the exact artifactId from each candidate source. Failed/missing reads do not consume the artifact-read budget.',
    'Escalate to read_artifact only for high-risk or doubtful cases: numeric/quantitative claims, causal claims, absolute claims, legal/medical/financial/safety claims, low-confidence claims, snippet mismatch, or when toolText appears too weak or ambiguous.',
    'For each candidate, judge two things:',
    '1) supported: does one or more sources substantively support the claim? Judge semantically from toolText / read_artifact; do not require verbatim quote matching.',
    '2) relevantToCriterion: does the claim directly address this criterion?',
    'A candidate becomes accepted evidence only when both are true.',
    'When supported=true, return sources:[{url, snippet}] as optional display/helper notes.',
    'Review scout summary and gap too. Rewrite if overstated, off-topic, or vague.',
    'summary and gap must be clean prose about this criterion only. Never mention accepted/rejected counts, tool budgets, or workflow statistics.',
    'Finish by calling submit_criterion_review.',
  ].join('\n')
}

export function evaluatorUserPrompt(input: {
  subQuestion: string
  criterionId: string
  criterionText: string
  scoutSummary: string
  scoutGap: string
  candidatesJson: string
}): string {
  return [
    `Sub-question: ${input.subQuestion}`,
    `Criterion (${input.criterionId}): ${input.criterionText}`,
    `Scout summary: ${input.scoutSummary || '(empty)'}`,
    `Scout gap: ${input.scoutGap || '(empty)'}`,
    `Artifact read budget: 0/${MAX_EVALUATOR_ARTIFACT_READS}`,
    `Candidates:\n${input.candidatesJson}`,
  ].join('\n\n')
}

export function evaluatorNudgePrompt(): string {
  return 'Call submit_criterion_review now. If evidence is weak, use WARNING or FAIL and explain the gap plainly.'
}

export function writerSystemPrompt(depth: ResearchDepth): string {
  const length = depth === 'quick'
    ? 'Depth is quick: aim for about 800-2000 Chinese characters (or proportional English length). Short answers are fine; still state what remains unverified.'
    : depth === 'deep'
      ? 'Depth is deep: aim for about 4000-10000 Chinese characters when the pack supports it. Expand mechanisms, contrasts, and evidence strength.'
      : 'Depth is standard: aim for about 2000-5000 Chinese characters when the pack supports it. Prefer clear subheadings; keep substance over padding.'
  return [
    'You are the writing stage of a private Deep Research run.',
    'Write the final research report from the writing pack only.',
    'Write the entire report markdown in the same language as the main question.',
    'Hard rules:',
    '- Use only the writing pack. Do not invent facts, dates, or sources outside it.',
    '- Affirmative claims must be supportable by accepted evidence entries in the pack.',
    '- Cite sources in the prose using the pack URLs (markdown links). Do not invent URLs.',
    '- Treat verify=WARNING / warning / gap lines as caution or limitations in the report.',
    '- Uncovered criteria and Risks / limitations sections must appear in the report.',
    length,
    'Length follows the pack: a thin pack means a shorter report is correct; do not pad.',
    'Call deep_research_complete with the markdown report. Set partial=true when evidence is insufficient.',
    'Do not search the web. Do not ask the user a question or emit a user-facing answer.',
  ].join('\n')
}

export function writerUserPrompt(pack: string): string {
  return ['Write the final report from this writing pack, then call deep_research_complete.', pack].join('\n\n')
}

export function writerNudgePrompt(): string {
  return 'Call deep_research_complete now with the markdown report. If the pack is thin, write a shorter report and set partial=true.'
}

export function toolsCapNote(used: number, cap = TOOLS_PER_CRITERION): string {
  return `[tools ${used}/${cap} used, ${Math.max(0, cap - used)} left]`
}
