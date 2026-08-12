/** Durable storage declaration for deep research. */
import { z } from 'zod';
import { ResearchId } from './types.ts';
/** Durable source evidence schema. */
export declare const researchEvidenceSchema: z.ZodObject<{
    source: z.ZodString;
    url: z.ZodNullable<z.ZodString>;
    summary: z.ZodString;
}, z.core.$strip>;
/** Durable research project schema. */
export declare const researchProjectSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodString, z.ZodTransform<ResearchId, string>>;
    question: z.ZodString;
    depth: z.ZodEnum<{
        quick: "quick";
        standard: "standard";
        deep: "deep";
    }>;
    phase: z.ZodEnum<{
        planning: "planning";
        researching: "researching";
        synthesizing: "synthesizing";
        complete: "complete";
    }>;
    plan: z.ZodArray<z.ZodString>;
    evidence: z.ZodArray<z.ZodObject<{
        source: z.ZodString;
        url: z.ZodNullable<z.ZodString>;
        summary: z.ZodString;
    }, z.core.$strip>>;
    report: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
/** Global research store shared by Sessions. */
export declare const deepResearchDomainSpec: {
    name: string;
    version: number;
    tables: {
        projects: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<ResearchId, import("./types.ts").ResearchProject>;
    };
};
//# sourceMappingURL=spec.d.ts.map