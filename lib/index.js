import { randomUUID } from "node:crypto";
import { Service } from "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { GatewayService, Remote } from "@deepseek-ai/dsh-type-meta";
import { z } from "zod";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
//#region lib/types/types.js
/** Public wire values for durable deep-research projects. */
/** Construct a research identity at its owning boundary. */
const ResearchId = (value) => value;
//#endregion
//#region lib/types/spec.js
/** Durable storage declaration for deep research. */
/** Durable source evidence schema. */
const researchEvidenceSchema = z.object({
	source: z.string(),
	url: z.string().nullable(),
	summary: z.string()
});
/** Durable research project schema. */
const researchProjectSchema = z.object({
	id: z.string().transform(ResearchId),
	question: z.string(),
	depth: z.enum([
		"quick",
		"standard",
		"deep"
	]),
	phase: z.enum([
		"planning",
		"researching",
		"synthesizing",
		"complete"
	]),
	plan: z.array(z.string()),
	evidence: z.array(researchEvidenceSchema),
	report: z.string().nullable(),
	createdAt: z.number(),
	updatedAt: z.number()
});
/** Global research store shared by Sessions. */
const deepResearchDomainSpec = defineDomain({
	name: "deepresearch",
	version: 1,
	tables: { projects: domainTable(researchProjectSchema) }
});
//#endregion
//#region lib/types/index.js
/**
* Durable evidence-first deep-research workflow over existing web and subagent tools.
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
const PROJECT_SCHEMA = {
	type: "object",
	additionalProperties: false,
	properties: {
		id: {
			type: "string",
			required: true
		},
		question: {
			type: "string",
			required: true
		},
		depth: {
			type: "string",
			required: true,
			enum: [
				"quick",
				"standard",
				"deep"
			]
		},
		phase: {
			type: "string",
			required: true,
			enum: [
				"planning",
				"researching",
				"synthesizing",
				"complete"
			]
		},
		plan: {
			type: "array",
			required: true,
			items: { type: "string" }
		},
		evidence: {
			type: "array",
			required: true,
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					source: {
						type: "string",
						required: true
					},
					url: {
						required: true,
						oneOf: [{ type: "string" }, { type: "null" }]
					},
					summary: {
						type: "string",
						required: true
					}
				}
			}
		},
		report: {
			required: true,
			oneOf: [{ type: "string" }, { type: "null" }]
		},
		createdAt: {
			type: "number",
			required: true
		},
		updatedAt: {
			type: "number",
			required: true
		}
	}
};
/** Deep-research project service. */
let DeepResearchService = (() => {
	let _classSuper = GatewayService;
	let _instanceExtraInitializers = [];
	let _list_decorators;
	let _get_decorators;
	let _start_decorators;
	let _addEvidence_decorators;
	let _complete_decorators;
	return class DeepResearchService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
			_get_decorators = [Remote("get")];
			_start_decorators = [Remote("start")];
			_addEvidence_decorators = [Remote("addEvidence")];
			_complete_decorators = [Remote("complete")];
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
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		config = __runInitializers(this, _instanceExtraInitializers);
		static inject = [
			"storageDomain",
			"tools",
			"systemPrompt"
		];
		/** Loader validation for deployment-varying research limits. */
		static Config = s.object({
			maxProjects: s.number().step(1).min(1).required(),
			maxEvidencePerProject: s.number().step(1).min(1).required(),
			maxReportChars: s.number().step(1).min(1).required()
		});
		table;
		mutationTail = Promise.resolve();
		/**
		* @param ctx - Host context carrying storage, prompt, and tool registries.
		* @param config - Project and content limits.
		*/
		constructor(ctx, config) {
			super(ctx, "deepResearch");
			this.config = config;
		}
		/** Open storage and publish workflow guidance and tools. */
		async [Service.init]() {
			const domain = await this.ctx.storageDomain.open(deepResearchDomainSpec);
			this.ctx.effect(() => () => domain.close(), "deepresearch.domainClose");
			this.table = domain.table("projects");
			this.ctx.systemPrompt.section({
				name: "deepresearch",
				order: 170,
				text: "For an explicit deep-research request, create a project with deep_research_start before gathering evidence. Use the composed web and subagent tools to investigate the approved plan, add only source-backed findings with deep_research_add_evidence, and finish with deep_research_complete after comparing evidence and stating uncertainty. Never invent a source or claim that a project is complete before its final report is saved."
			});
			this.registerTools();
		}
		/** List projects matching optional text and phase filters. */
		list(request) {
			const query = request.query?.trim().toLocaleLowerCase();
			return { projects: [...this.requireTable().entries()].map(([, project]) => snapshot(project)).filter((project) => request.phase === void 0 || project.phase === request.phase).filter((project) => query === void 0 || query === "" || `${project.question}\n${project.report ?? ""}`.toLocaleLowerCase().includes(query)).sort((left, right) => right.updatedAt - left.updatedAt) };
		}
		/** Read one exact project. */
		get(request) {
			const project = this.requireTable().get(request.id);
			return project === void 0 ? null : snapshot(project);
		}
		/** Create a project with a non-empty investigation plan. */
		start(request) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				if (table.size >= this.config.maxProjects) throw new RangeError(`deepresearch: project limit ${this.config.maxProjects} reached`);
				const plan = request.plan.map((step, index) => requiredText(step, `plan[${index}]`));
				if (plan.length === 0) throw new TypeError("deepresearch: plan must contain at least one step");
				const now = Date.now();
				const project = snapshot({
					id: ResearchId(`research-${randomUUID()}`),
					question: requiredText(request.question, "question"),
					depth: request.depth,
					phase: "planning",
					plan,
					evidence: [],
					report: null,
					createdAt: now,
					updatedAt: now
				});
				await table.put(project.id, project);
				return snapshot(project);
			});
		}
		/** Attach one finding and move the project into active investigation. */
		addEvidence(request) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				const current = requireProject(table, request.id);
				if (current.phase === "complete") throw new Error(`deepresearch: project ${request.id} is complete`);
				if (current.evidence.length >= this.config.maxEvidencePerProject) throw new RangeError(`deepresearch: evidence limit ${this.config.maxEvidencePerProject} reached`);
				const evidence = {
					source: requiredText(request.source, "source"),
					url: request.url === void 0 ? null : requiredText(request.url, "url"),
					summary: requiredText(request.summary, "summary")
				};
				const project = snapshot({
					...current,
					phase: "researching",
					evidence: [...current.evidence, evidence],
					updatedAt: Math.max(Date.now(), current.updatedAt)
				});
				await table.put(project.id, project);
				return snapshot(project);
			});
		}
		/** Save the final synthesis and close the project. */
		complete(request) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				const current = requireProject(table, request.id);
				const report = requiredText(request.report, "report");
				if (report.length > this.config.maxReportChars) throw new RangeError(`deepresearch: report exceeds ${this.config.maxReportChars} characters`);
				const project = snapshot({
					...current,
					phase: "complete",
					report,
					updatedAt: Math.max(Date.now(), current.updatedAt)
				});
				await table.put(project.id, project);
				return snapshot(project);
			});
		}
		/** Register model-facing workflow tools over the service. */
		registerTools() {
			this.ctx.tools.register(defineTool({
				name: "deep_research_start",
				description: "Create a durable deep-research project with an explicit investigation plan.",
				parameters: {
					question: {
						type: "string",
						required: true,
						description: "The exact research question."
					},
					depth: {
						type: "string",
						required: true,
						enum: [
							"quick",
							"standard",
							"deep"
						],
						description: "Investigation depth."
					},
					plan: {
						type: "array",
						required: true,
						items: { type: "string" },
						description: "Ordered evidence-gathering steps."
					}
				},
				output: {
					schema: PROJECT_SCHEMA,
					render: (_args, value) => [{
						type: "text",
						text: `Created research project ${value.id} with ${value.plan.length} steps.`
					}]
				},
				execute: async (args) => this.start(args),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Plan deep research",
					rawInput: args.question
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_add_evidence",
				description: "Attach one verified source-backed finding to an active research project.",
				parameters: {
					id: {
						type: "string",
						required: true,
						description: "Research project id."
					},
					source: {
						type: "string",
						required: true,
						description: "Source title or publisher."
					},
					url: {
						type: "string",
						description: "Source URL when available."
					},
					summary: {
						type: "string",
						required: true,
						description: "Finding supported by the source."
					}
				},
				output: {
					schema: PROJECT_SCHEMA,
					render: (_args, value) => [{
						type: "text",
						text: `Saved evidence ${value.evidence.length} for ${value.id}.`
					}]
				},
				execute: async (args) => this.addEvidence({
					...args,
					id: ResearchId(args.id)
				}),
				presentCall: (args) => ({
					card: "generic",
					kind: "search",
					title: "Add research evidence",
					rawInput: args.source
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_complete",
				description: "Save the final evidence-based report and mark a research project complete.",
				parameters: {
					id: {
						type: "string",
						required: true,
						description: "Research project id."
					},
					report: {
						type: "string",
						required: true,
						description: "Final report with source attribution and uncertainty."
					}
				},
				output: {
					schema: PROJECT_SCHEMA,
					render: (_args, value) => [{
						type: "text",
						text: `Completed research project ${value.id}.`
					}]
				},
				execute: async (args) => this.complete({
					...args,
					id: ResearchId(args.id)
				}),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Complete deep research",
					rawInput: args.id
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_list",
				description: "List durable research projects before starting duplicate work or resuming an investigation.",
				parameters: {
					query: {
						type: "string",
						description: "Optional text query."
					},
					phase: {
						type: "string",
						enum: [
							"planning",
							"researching",
							"synthesizing",
							"complete"
						],
						description: "Optional phase filter."
					}
				},
				output: {
					schema: {
						type: "object",
						additionalProperties: false,
						properties: { projects: {
							type: "array",
							required: true,
							items: PROJECT_SCHEMA
						} }
					},
					render: (_args, value) => [{
						type: "text",
						text: value.projects.length === 0 ? "No research projects matched." : value.projects.map((project) => `- [${project.phase}] ${project.question} (${project.id})`).join("\n")
					}]
				},
				execute: async (args) => this.list(args),
				presentCall: (args) => ({
					card: "generic",
					kind: "search",
					title: "List research projects",
					rawInput: args.query ?? args.phase
				})
			}));
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
function requiredText(value, field) {
	const text = value.trim();
	if (text === "") throw new TypeError(`deepresearch: ${field} must not be blank`);
	return text;
}
function requireProject(table, id) {
	const project = table.get(id);
	if (project === void 0) throw new Error(`deepresearch: project ${id} not found`);
	return project;
}
function snapshot(project) {
	return Object.freeze({
		...project,
		plan: [...project.plan],
		evidence: project.evidence.map((item) => Object.freeze({ ...item }))
	});
}
//#endregion
export { DeepResearchService, DeepResearchService as default, ResearchId, deepResearchDomainSpec, researchEvidenceSchema, researchProjectSchema };
