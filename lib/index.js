import { randomUUID } from "node:crypto";
import { Service } from "@deepseek-ai/cordis";
import s from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { z } from "zod";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
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
	gap: z.string()
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
	criteria: z.array(researchCriterionSchema)
});
/** Stored source-backed evidence schema. */
const researchEvidenceSchema = z.object({
	id: z.string().transform(ResearchEvidenceId),
	questionId: z.string().transform(ResearchQuestionId),
	criterionIds: z.array(z.string()),
	source: z.string(),
	url: z.string().nullable(),
	snippet: z.string(),
	claim: z.string(),
	confidence: z.enum([
		"low",
		"medium",
		"high"
	]),
	createdAt: z.number()
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
	createdAt: z.number(),
	updatedAt: z.number()
});
/** Global research store shared by Sessions. */
const deepResearchDomainSpec = defineDomain({
	name: "deepresearch",
	version: 2,
	tables: { projects: domainTable(researchProjectSchema) }
});
//#endregion
//#region lib/types/index.js
/**
* Evidence-first Deep Research workspace over existing Web and subagent Tools.
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
			"storageDomain",
			"tools",
			"systemPrompt"
		];
		static Config = s.object({
			maxProjects: s.number().step(1).min(1).required(),
			maxQuestions: s.number().step(1).min(1).required(),
			maxCriteriaPerQuestion: s.number().step(1).min(1).required(),
			maxEvidencePerProject: s.number().step(1).min(1).required(),
			maxReportChars: s.number().step(1).min(1).required()
		});
		table;
		mutationTail = Promise.resolve();
		/** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
		constructor(ctx, config) {
			super(ctx, "deepResearch");
			this.config = config;
		}
		/** Open storage and publish workflow guidance and Tools. */
		async [Service.init]() {
			const domain = await this.ctx.storageDomain.open(deepResearchDomainSpec);
			this.ctx.effect(() => () => domain.close(), "deepresearch.domainClose");
			this.table = domain.table("projects");
			this.ctx.systemPrompt.section({
				name: "deepresearch",
				order: 170,
				text: "For explicit deep research, create or resume a project before investigation. Refine and confirm its question plan, then use the composed Web and subagent tools. Save each source-backed claim against its sub-question and success criteria. Mark coverage honestly, retain limitations, and save the final report only after comparing accepted evidence. Never invent sources, evidence, coverage, or completion."
			});
			this.registerTools();
		}
		/**
		* List projects matching optional text and phase filters.
		* @param request - optional project filters.
		* @returns matching projects ordered by newest edit.
		*/
		list(request) {
			const query = request.query?.trim().toLocaleLowerCase();
			return { projects: [...this.requireTable().entries()].map(([, project]) => snapshot(project)).filter((project) => request.phase === void 0 || project.phase === request.phase).filter((project) => query === void 0 || query === "" || researchText(project).includes(query)).sort((left, right) => right.updatedAt - left.updatedAt) };
		}
		/**
		* Read one exact project.
		* @param request - project identity to read.
		* @returns detached project data, or null when absent.
		*/
		get(request) {
			const project = this.requireTable().get(request.id);
			return project === void 0 ? null : snapshot(project);
		}
		/**
		* Create a draft plan with sub-questions and success criteria.
		* @param request - research objective and initial question plan.
		* @returns the detached stored project.
		*/
		start(request) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				if (table.size >= this.config.maxProjects) throw new RangeError(`deepresearch: project limit ${this.config.maxProjects} reached`);
				const questions = this.buildQuestions(request.questions);
				const now = Date.now();
				const id = ResearchId(`research-${randomUUID()}`);
				const project = snapshot({
					id,
					title: optionalText(request.title) || `🔬 ${requiredText(request.question, "question").slice(0, 64)}`,
					question: requiredText(request.question, "question"),
					goal: optionalText(request.goal),
					constraints: optionalText(request.constraints),
					seedText: optionalText(request.seedText),
					depth: request.depth,
					phase: "awaiting_plan_confirm",
					planConfirmed: false,
					questions,
					evidence: [],
					conclusions: [],
					limitations: [],
					report: null,
					budget: budgetFor(request.depth),
					createdAt: now,
					updatedAt: now
				});
				await table.put(id, project);
				return snapshot(project);
			});
		}
		/**
		* Replace an unconfirmed project plan.
		* @param request - replacement plan and project identity.
		* @returns the updated detached project.
		*/
		updatePlan(request) {
			return this.update(request.id, (project) => {
				if (project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is confirmed`);
				return {
					...project,
					goal: request.goal.trim(),
					constraints: request.constraints.trim(),
					depth: request.depth,
					questions: this.buildQuestions(request.questions),
					budget: budgetFor(request.depth),
					phase: "awaiting_plan_confirm"
				};
			});
		}
		/**
		* Lock the plan and make the project ready for investigation.
		* @param request - project identity to confirm.
		* @returns the updated detached project.
		*/
		confirmPlan(request) {
			return this.update(request.id, (project) => ({
				...project,
				planConfirmed: true,
				phase: "investigating"
			}));
		}
		/**
		* Attach one source-backed claim to a planned sub-question.
		* @param request - evidence attribution and claim content.
		* @returns the updated detached project.
		*/
		addEvidence(request) {
			return this.update(request.id, (project) => {
				if (!project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is not confirmed`);
				if (project.evidence.length >= this.config.maxEvidencePerProject) throw new RangeError(`deepresearch: evidence limit ${this.config.maxEvidencePerProject} reached`);
				const question = project.questions.find((item) => item.id === request.questionId);
				if (question === void 0) throw new Error(`deepresearch: question ${request.questionId} not found`);
				const criteria = new Set(question.criteria.map((item) => item.id));
				for (const id of request.criterionIds ?? []) if (!criteria.has(id)) throw new Error(`deepresearch: criterion ${id} not found`);
				const evidence = {
					id: ResearchEvidenceId(`evidence-${randomUUID()}`),
					questionId: request.questionId,
					criterionIds: [...request.criterionIds ?? []],
					source: requiredText(request.source, "source"),
					url: optionalText(request.url) || null,
					snippet: optionalText(request.snippet),
					claim: requiredText(request.claim, "claim"),
					confidence: request.confidence,
					createdAt: Date.now()
				};
				return {
					...project,
					phase: "investigating",
					evidence: [...project.evidence, evidence],
					budget: {
						...project.budget,
						fetchesUsed: Math.min(project.budget.maxFetches, project.budget.fetchesUsed + (evidence.url === null ? 0 : 1))
					}
				};
			});
		}
		/**
		* Update sub-question and criterion coverage after evidence review.
		* @param request - reviewed question progress and criteria.
		* @returns the updated detached project.
		*/
		updateQuestion(request) {
			return this.update(request.id, (project) => {
				const index = project.questions.findIndex((item) => item.id === request.questionId);
				if (index < 0) throw new Error(`deepresearch: question ${request.questionId} not found`);
				const current = project.questions[index];
				const questions = [...project.questions];
				questions[index] = {
					...current,
					status: request.status,
					criteria: request.criteria ?? current.criteria
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
		/**
		* Save a final or explicitly partial report with conclusions and limitations.
		* @param request - report content and completion state.
		* @returns the completed detached project.
		*/
		complete(request) {
			return this.update(request.id, (project) => {
				const report = requiredText(request.report, "report");
				if (report.length > this.config.maxReportChars) throw new RangeError(`deepresearch: report exceeds ${this.config.maxReportChars} characters`);
				if (project.evidence.length === 0) throw new Error(`deepresearch: project ${project.id} has no evidence`);
				return {
					...project,
					phase: request.partial === true ? "incomplete" : "done",
					report,
					conclusions: normalizeList(request.conclusions ?? project.conclusions),
					limitations: normalizeList(request.limitations ?? project.limitations)
				};
			});
		}
		/**
		* Record an aborted or failed investigation without losing evidence.
		* @param request - failure reason and termination type.
		* @returns the updated detached project.
		*/
		fail(request) {
			return this.update(request.id, (project) => ({
				...project,
				phase: request.aborted === true ? "aborted" : "failed",
				limitations: normalizeList([...project.limitations, requiredText(request.reason, "reason")])
			}));
		}
		/**
		* Delete a project; absence is a stable successful outcome.
		* @param request - project identity to delete.
		* @returns whether the project existed.
		*/
		delete(request) {
			return this.enqueue(async () => {
				const table = this.requireTable();
				const deleted = table.get(request.id) !== void 0;
				if (deleted) await table.delete(request.id);
				return { deleted };
			});
		}
		registerTools() {
			this.ctx.tools.register(defineTool({
				name: "deep_research_start",
				description: "Create a durable Deep Research project with explicit sub-questions and success criteria.",
				parameters: {
					title: { type: "string" },
					question: {
						type: "string",
						required: true
					},
					goal: { type: "string" },
					constraints: { type: "string" },
					seedText: { type: "string" },
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
				execute: async (args) => ({ text: projectSummary(await this.start(args)) }),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Plan deep research",
					rawInput: args.question
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_list",
				description: "List durable research projects before resuming or starting duplicate work.",
				parameters: {
					query: { type: "string" },
					phase: {
						type: "string",
						enum: [
							"planning",
							"awaiting_plan_confirm",
							"investigating",
							"ready_for_report",
							"incomplete",
							"writing",
							"done",
							"failed",
							"aborted"
						]
					}
				},
				output: {
					schema: TEXT_OUTPUT,
					render: (_args, value) => [{
						type: "text",
						text: value.text
					}]
				},
				execute: (args) => Promise.resolve({ text: this.list(args).projects.map(projectSummary).join("\n\n") || "No research projects matched." }),
				presentCall: (args) => ({
					card: "generic",
					kind: "search",
					title: "List research projects",
					rawInput: args.query ?? args.phase
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_confirm_plan",
				description: "Confirm a reviewed project plan before gathering evidence.",
				parameters: { id: {
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
				execute: async (args) => ({ text: projectSummary(await this.confirmPlan({ id: ResearchId(args.id) })) }),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Confirm research plan",
					rawInput: args.id
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_add_evidence",
				description: "Attach a source-backed claim to one planned sub-question and its criteria.",
				parameters: {
					id: {
						type: "string",
						required: true
					},
					questionId: {
						type: "string",
						required: true
					},
					criterionIds: {
						type: "array",
						items: { type: "string" }
					},
					source: {
						type: "string",
						required: true
					},
					url: { type: "string" },
					snippet: { type: "string" },
					claim: {
						type: "string",
						required: true
					},
					confidence: {
						type: "string",
						required: true,
						enum: [
							"low",
							"medium",
							"high"
						]
					}
				},
				output: {
					schema: TEXT_OUTPUT,
					render: (_args, value) => [{
						type: "text",
						text: value.text
					}]
				},
				execute: async (args) => ({ text: projectSummary(await this.addEvidence({
					...args,
					id: ResearchId(args.id),
					questionId: ResearchQuestionId(args.questionId)
				})) }),
				presentCall: (args) => ({
					card: "generic",
					kind: "search",
					title: "Add research evidence",
					rawInput: args.source
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_update_coverage",
				description: "Record reviewed question and success-criterion coverage.",
				parameters: {
					id: {
						type: "string",
						required: true
					},
					questionId: {
						type: "string",
						required: true
					},
					status: {
						type: "string",
						required: true,
						enum: [
							"pending",
							"running",
							"covered",
							"partial",
							"blocked",
							"failed"
						]
					}
				},
				output: {
					schema: TEXT_OUTPUT,
					render: (_args, value) => [{
						type: "text",
						text: value.text
					}]
				},
				execute: async (args) => ({ text: projectSummary(await this.updateQuestion({
					id: ResearchId(args.id),
					questionId: ResearchQuestionId(args.questionId),
					status: args.status
				})) }),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Update research coverage",
					rawInput: args.questionId
				})
			}));
			this.ctx.tools.register(defineTool({
				name: "deep_research_complete",
				description: "Save the evidence-based report, conclusions, and limitations.",
				parameters: {
					id: {
						type: "string",
						required: true
					},
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
				execute: async (args) => ({ text: projectSummary(await this.complete({
					...args,
					id: ResearchId(args.id)
				})) }),
				presentCall: (args) => ({
					card: "generic",
					kind: "edit",
					title: "Complete deep research",
					rawInput: args.id
				})
			}));
		}
		buildQuestions(input) {
			if (input.length === 0) throw new TypeError("deepresearch: plan must contain at least one question");
			if (input.length > this.config.maxQuestions) throw new RangeError(`deepresearch: question limit ${this.config.maxQuestions} reached`);
			const ids = input.map(() => ResearchQuestionId(`rq-${randomUUID()}`));
			return input.map((item, index) => {
				if (item.criteria.length === 0) throw new TypeError(`deepresearch: questions[${index}] requires criteria`);
				if (item.criteria.length > this.config.maxCriteriaPerQuestion) throw new RangeError(`deepresearch: criterion limit ${this.config.maxCriteriaPerQuestion} reached`);
				return {
					id: ids[index],
					text: requiredText(item.text, `questions[${index}].text`),
					dependsOn: (item.dependsOn ?? []).map((dep) => {
						const id = ids[dep];
						if (id === void 0 || dep >= index) throw new TypeError(`deepresearch: questions[${index}] has invalid dependency ${dep}`);
						return id;
					}),
					status: "pending",
					criteria: item.criteria.map((text, criterionIndex) => ({
						id: `c${index + 1}.${criterionIndex + 1}`,
						text: requiredText(text, `questions[${index}].criteria[${criterionIndex}]`),
						status: "missing",
						summary: "",
						gap: ""
					}))
				};
			});
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
				return snapshot(project);
			});
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
function budgetFor(depth) {
	const limits = depth === "quick" ? [8, 6] : depth === "deep" ? [30, 24] : [18, 14];
	return {
		maxSearches: limits[0],
		maxFetches: limits[1],
		searchesUsed: 0,
		fetchesUsed: 0
	};
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
		...project.questions.flatMap((question) => [question.text, ...question.criteria.flatMap((criterion) => [
			criterion.text,
			criterion.summary,
			criterion.gap
		])]),
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
function snapshot(project) {
	return Object.freeze({
		...project,
		questions: project.questions.map((question) => Object.freeze({
			...question,
			dependsOn: [...question.dependsOn],
			criteria: question.criteria.map((criterion) => Object.freeze({ ...criterion }))
		})),
		evidence: project.evidence.map((item) => Object.freeze({
			...item,
			criterionIds: [...item.criterionIds]
		})),
		conclusions: [...project.conclusions],
		limitations: [...project.limitations],
		budget: Object.freeze({ ...project.budget })
	});
}
//#endregion
export { DeepResearchService, DeepResearchService as default, ResearchEvidenceId, ResearchId, ResearchQuestionId, deepResearchDomainSpec, researchCriterionSchema, researchEvidenceSchema, researchProjectSchema, researchQuestionSchema };
