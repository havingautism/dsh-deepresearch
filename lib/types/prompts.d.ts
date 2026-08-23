/** Role prompts aligned with Codemini planning / Scout / Evaluator / Writer. */
import type { ResearchDepth, ResearchProject } from './types.ts';
export declare function planningSystemPrompt(project: ResearchProject, limits: {
    maxQuestions: number;
    maxCriteriaPerQuestion: number;
}): string;
export declare function planningUserPrompt(project: ResearchProject): string;
export declare function planningNudgePrompt(): string;
export declare function scoutSystemPrompt(): string;
export declare function scoutUserPrompt(input: {
    question: string;
    goal: string;
    subQuestion: string;
    criterionId: string;
    criterionText: string;
    toolsCap: number;
    toolsUsed: number;
    dependencyContext: string;
}): string;
export declare function scoutNudgePrompt(): string;
export declare function evaluatorSystemPrompt(): string;
export declare function evaluatorUserPrompt(input: {
    subQuestion: string;
    criterionId: string;
    criterionText: string;
    scoutSummary: string;
    scoutGap: string;
    candidatesJson: string;
}): string;
export declare function evaluatorNudgePrompt(): string;
export declare function writerSystemPrompt(depth: ResearchDepth): string;
export declare function writerUserPrompt(pack: string): string;
export declare function writerNudgePrompt(): string;
export declare function toolsCapNote(used: number, cap?: number): string;
//# sourceMappingURL=prompts.d.ts.map