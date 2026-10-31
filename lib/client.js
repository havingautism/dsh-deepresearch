window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-deepresearch",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let zod = require("zod");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region ../deepseek-harness/packages/typert/protocol/lib/types/remote-info.js
		/** Lazy assembly of generated Remote definitions using caller-supplied Zod; no runtime imports. */
		/**
		* Retain one generated definition per endpoint without constructing parsers or projections.
		* The class instance builds its shared descriptor/method index on first access;
		* input schemas and JSON Schema projections are cached only when requested.
		* @param spec - compiler-produced method facts and Zod factories.
		* @param zod - the generated artifact's Zod runtime for named-input parsers.
		* @returns a lazy, mountable info instance with no registration or transport effects.
		*/
		function createTypertRemoteInfo(spec, zod) {
			return new RemoteInfo(spec, zod);
		}
		var RemoteInfo = class {
			spec;
			zod;
			index;
			constructor(spec, zod) {
				this.spec = spec;
				this.zod = zod;
			}
			get package() {
				return this.spec.package;
			}
			get descriptors() {
				return this.resolve().descriptors;
			}
			get methods() {
				return this.resolve().methods;
			}
			resolve() {
				if (this.index !== void 0) return this.index;
				const zod = this.zod;
				const descriptors = [];
				const methods = Object.create(null);
				for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
					const separator = endpoint.indexOf("/");
					const namespace = endpoint.slice(0, separator);
					const method = endpoint.slice(separator + 1);
					const parameters = definition.parameters.map((parameter) => ({
						...parameter,
						wire: parameter.wire ?? parameter.name
					}));
					const descriptor = {
						...definition,
						id: `${this.spec.package}#${endpoint}`,
						namespace,
						method,
						parameters,
						result: definition.result.description === void 0 ? definition.result : new ResultValue(definition.result)
					};
					if (definition.invocation.kind === "direct") {
						const inputs = [];
						methods[endpoint] = Object.assign(descriptor, {
							input(options) {
								const strict = options?.strict === true;
								return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
							},
							invoke(remote, input, signal) {
								const named = input;
								const values = parameters.map((parameter) => named[parameter.wire]);
								if (definition.cancellation !== void 0) values.push(signal);
								const receiver = Reflect.get(remote, namespace);
								return Reflect.get(receiver, method).apply(receiver, values);
							}
						});
					}
					descriptors.push(descriptor);
				}
				return this.index = {
					descriptors,
					methods
				};
			}
		};
		function optional(parameter) {
			return parameter.source === "json" && parameter.acceptsUndefined === true;
		}
		var NamedInput = class {
			parameters;
			strict;
			zod;
			schema;
			projection;
			constructor(parameters, strict, zod) {
				this.parameters = parameters;
				this.strict = strict;
				this.zod = zod;
			}
			codec(parameter) {
				return this.strict ? parameter.strictCodec : parameter.codec;
			}
			create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
				const value = this.codec(parameter).create();
				return [parameter.wire, optional(parameter) ? value.optional() : value.nonoptional()];
			})));
			get jsonSchema() {
				return this.project().jsonSchema;
			}
			get jsonSchemaError() {
				return this.project().jsonSchemaError;
			}
			project() {
				if (this.projection !== void 0) return this.projection;
				const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === void 0);
				if (unavailable !== void 0) return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
				return this.projection = { jsonSchema: {
					type: "object",
					properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
						...this.codec(parameter).jsonSchema,
						...parameter.description === void 0 ? {} : { description: parameter.description }
					}])),
					required: this.parameters.filter((parameter) => !optional(parameter)).map((parameter) => parameter.wire),
					additionalProperties: false
				} };
			}
		};
		var ResultValue = class {
			spec;
			projection;
			constructor(spec) {
				this.spec = spec;
			}
			get mode() {
				return this.spec.mode;
			}
			get typeSymbol() {
				return this.spec.typeSymbol;
			}
			get create() {
				return this.spec.create;
			}
			get decode() {
				return this.spec.decode;
			}
			get encode() {
				return this.spec.encode;
			}
			get description() {
				return this.spec.description;
			}
			get jsonSchemaError() {
				return this.spec.jsonSchemaError;
			}
			get jsonSchema() {
				if (this.projection === void 0) {
					const schema = this.spec.jsonSchema;
					this.projection = { value: schema === void 0 ? void 0 : {
						...schema,
						description: this.spec.description
					} };
				}
				return this.projection.value;
			}
		};
		//#endregion
		//#region lib/typert.remote-client.js
		let _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"questionId": zod.z.string().readonly(),
			"criterionIds": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.string())]).readonly().optional(),
			"source": zod.z.string().readonly(),
			"url": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional(),
			"snippet": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional(),
			"sources": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.object({
				"url": zod.z.string().readonly(),
				"snippet": zod.z.string().readonly(),
				"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
			}))]).readonly().optional(),
			"claim": zod.z.string().readonly(),
			"confidence": zod.z.union([
				zod.z.literal("low"),
				zod.z.literal("medium"),
				zod.z.literal("high")
			]).readonly(),
			"status": zod.z.union([
				zod.z.undefined(),
				zod.z.literal("rejected"),
				zod.z.literal("candidate"),
				zod.z.literal("accepted")
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"report": zod.z.string().readonly(),
			"conclusions": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.string())]).readonly().optional(),
			"limitations": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.string())]).readonly().optional(),
			"partial": zod.z.union([
				zod.z.undefined(),
				zod.z.literal(false),
				zod.z.literal(true)
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_complete_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_complete_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_complete_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_delete_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_delete_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_delete_result$schema$value ??= zod.z.object({ "deleted": zod.z.boolean().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"reason": zod.z.string().readonly(),
			"aborted": zod.z.boolean().readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_fail_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_fail_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_fail_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_get_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_get_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_get_result$schema$value ??= zod.z.union([zod.z.literal(null), zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		})]);
		let _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0$schema$value ??= zod.z.object({
			"query": zod.z.string().readonly().optional(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_list_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_list_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_list_result$schema$value ??= zod.z.object({ "projects": zod.z.array(zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		})).readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_resume_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_resume_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_resume_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0$schema$value ??= zod.z.object({
			"title": zod.z.string().readonly().optional(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly().optional(),
			"constraints": zod.z.string().readonly().optional(),
			"seedText": zod.z.string().readonly().optional(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"questions": zod.z.array(zod.z.object({
				"text": zod.z.string().readonly(),
				"criteria": zod.z.array(zod.z.string()).readonly(),
				"dependsOn": zod.z.array(zod.z.number()).readonly().optional()
			})).readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_start_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_start_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_start_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"questions": zod.z.array(zod.z.object({
				"text": zod.z.string().readonly(),
				"criteria": zod.z.array(zod.z.string()).readonly(),
				"dependsOn": zod.z.array(zod.z.number()).readonly().optional()
			})).readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"questionId": zod.z.string().readonly(),
			"status": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("running"),
				zod.z.literal("pending"),
				zod.z.literal("blocked"),
				zod.z.literal("covered"),
				zod.z.literal("partial")
			]).readonly(),
			"criteria": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"status": zod.z.union([
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial"),
					zod.z.literal("missing"),
					zod.z.literal("conflicted")
				]).readonly(),
				"summary": zod.z.string().readonly(),
				"gap": zod.z.string().readonly(),
				"warning": zod.z.string().readonly(),
				"verification": zod.z.union([
					zod.z.literal(""),
					zod.z.literal("PASS"),
					zod.z.literal("WARNING"),
					zod.z.literal("FAIL")
				]).readonly(),
				"toolCount": zod.z.number().readonly()
			})).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0$schema$value ??= zod.z.object({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_result$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_result$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_result$schema$value ??= zod.z.object({
			"id": zod.z.string().readonly(),
			"title": zod.z.string().readonly(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"seedText": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly(),
			"runState": zod.z.union([
				zod.z.literal("running"),
				zod.z.literal("paused"),
				zod.z.literal("idle")
			]).readonly(),
			"planConfirmed": zod.z.boolean().readonly(),
			"questions": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"dependsOn": zod.z.array(zod.z.string()).readonly(),
				"status": zod.z.union([
					zod.z.literal("failed"),
					zod.z.literal("running"),
					zod.z.literal("pending"),
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial")
				]).readonly(),
				"criteria": zod.z.array(zod.z.object({
					"id": zod.z.string().readonly(),
					"text": zod.z.string().readonly(),
					"status": zod.z.union([
						zod.z.literal("blocked"),
						zod.z.literal("covered"),
						zod.z.literal("partial"),
						zod.z.literal("missing"),
						zod.z.literal("conflicted")
					]).readonly(),
					"summary": zod.z.string().readonly(),
					"gap": zod.z.string().readonly(),
					"warning": zod.z.string().readonly(),
					"verification": zod.z.union([
						zod.z.literal(""),
						zod.z.literal("PASS"),
						zod.z.literal("WARNING"),
						zod.z.literal("FAIL")
					]).readonly(),
					"toolCount": zod.z.number().readonly()
				})).readonly(),
				"gaps": zod.z.array(zod.z.string()).readonly(),
				"handoff": zod.z.string().readonly()
			})).readonly(),
			"evidence": zod.z.array(zod.z.object({
				"id": zod.z.string().readonly(),
				"questionId": zod.z.string().readonly(),
				"criterionIds": zod.z.array(zod.z.string()).readonly(),
				"source": zod.z.string().readonly(),
				"url": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
				"snippet": zod.z.string().readonly(),
				"sources": zod.z.array(zod.z.object({
					"url": zod.z.string().readonly(),
					"snippet": zod.z.string().readonly(),
					"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
				})).readonly(),
				"claim": zod.z.string().readonly(),
				"confidence": zod.z.union([
					zod.z.literal("low"),
					zod.z.literal("medium"),
					zod.z.literal("high")
				]).readonly(),
				"status": zod.z.union([
					zod.z.literal("rejected"),
					zod.z.literal("candidate"),
					zod.z.literal("accepted")
				]).readonly(),
				"createdAt": zod.z.number().readonly()
			})).readonly(),
			"conclusions": zod.z.array(zod.z.string()).readonly(),
			"limitations": zod.z.array(zod.z.string()).readonly(),
			"report": zod.z.union([zod.z.literal(null), zod.z.string()]).readonly(),
			"budget": zod.z.object({
				"maxSearches": zod.z.number().readonly(),
				"maxFetches": zod.z.number().readonly(),
				"searchesUsed": zod.z.number().readonly(),
				"fetchesUsed": zod.z.number().readonly()
			}).readonly(),
			"progress": zod.z.object({
				"running": zod.z.number().readonly(),
				"waiting": zod.z.number().readonly(),
				"scouts": zod.z.array(zod.z.object({
					"questionId": zod.z.string().readonly(),
					"role": zod.z.union([
						zod.z.literal("waiting"),
						zod.z.literal("writing"),
						zod.z.literal("scout"),
						zod.z.literal("evaluator")
					]).readonly(),
					"status": zod.z.union([
						zod.z.literal("running"),
						zod.z.literal("blocked"),
						zod.z.literal("waiting"),
						zod.z.literal("done"),
						zod.z.literal("partial"),
						zod.z.literal("verifying")
					]).readonly(),
					"waitingOn": zod.z.array(zod.z.string()).readonly(),
					"toolsUsed": zod.z.number().readonly(),
					"toolsCap": zod.z.number().readonly(),
					"activity": zod.z.string().readonly(),
					"tools": zod.z.array(zod.z.object({
						"name": zod.z.string().readonly(),
						"detail": zod.z.string().readonly(),
						"status": zod.z.union([zod.z.literal("running"), zod.z.literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": zod.z.string().readonly(),
					"evaluatorDraft": zod.z.string().readonly(),
					"activeCriterionId": zod.z.string().readonly(),
					"activeCriterionText": zod.z.string().readonly(),
					"dependencySummary": zod.z.string().readonly(),
					"handoff": zod.z.string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": zod.z.number().readonly(),
			"updatedAt": zod.z.number().readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"questionId": zod.z.string().readonly(),
			"criterionIds": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.string())]).readonly().optional(),
			"source": zod.z.string().readonly(),
			"url": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional(),
			"snippet": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional(),
			"sources": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.strictObject({
				"url": zod.z.string().readonly(),
				"snippet": zod.z.string().readonly(),
				"artifactId": zod.z.union([zod.z.undefined(), zod.z.string()]).readonly().optional()
			}))]).readonly().optional(),
			"claim": zod.z.string().readonly(),
			"confidence": zod.z.union([
				zod.z.literal("low"),
				zod.z.literal("medium"),
				zod.z.literal("high")
			]).readonly(),
			"status": zod.z.union([
				zod.z.undefined(),
				zod.z.literal("rejected"),
				zod.z.literal("candidate"),
				zod.z.literal("accepted")
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"report": zod.z.string().readonly(),
			"conclusions": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.string())]).readonly().optional(),
			"limitations": zod.z.union([zod.z.undefined(), zod.z.array(zod.z.string())]).readonly().optional(),
			"partial": zod.z.union([
				zod.z.undefined(),
				zod.z.literal(false),
				zod.z.literal(true)
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"reason": zod.z.string().readonly(),
			"aborted": zod.z.boolean().readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"query": zod.z.string().readonly().optional(),
			"phase": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("planning"),
				zod.z.literal("awaiting_plan_confirm"),
				zod.z.literal("investigating"),
				zod.z.literal("ready_for_report"),
				zod.z.literal("incomplete"),
				zod.z.literal("writing"),
				zod.z.literal("done"),
				zod.z.literal("aborted")
			]).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		let _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"title": zod.z.string().readonly().optional(),
			"question": zod.z.string().readonly(),
			"goal": zod.z.string().readonly().optional(),
			"constraints": zod.z.string().readonly().optional(),
			"seedText": zod.z.string().readonly().optional(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"questions": zod.z.array(zod.z.strictObject({
				"text": zod.z.string().readonly(),
				"criteria": zod.z.array(zod.z.string()).readonly(),
				"dependsOn": zod.z.array(zod.z.number()).readonly().optional()
			})).readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"goal": zod.z.string().readonly(),
			"constraints": zod.z.string().readonly(),
			"depth": zod.z.union([
				zod.z.literal("standard"),
				zod.z.literal("quick"),
				zod.z.literal("deep")
			]).readonly(),
			"questions": zod.z.array(zod.z.strictObject({
				"text": zod.z.string().readonly(),
				"criteria": zod.z.array(zod.z.string()).readonly(),
				"dependsOn": zod.z.array(zod.z.number()).readonly().optional()
			})).readonly()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0_strict$schema$value ??= zod.z.strictObject({
			"id": zod.z.string().readonly(),
			"questionId": zod.z.string().readonly(),
			"status": zod.z.union([
				zod.z.literal("failed"),
				zod.z.literal("running"),
				zod.z.literal("pending"),
				zod.z.literal("blocked"),
				zod.z.literal("covered"),
				zod.z.literal("partial")
			]).readonly(),
			"criteria": zod.z.array(zod.z.strictObject({
				"id": zod.z.string().readonly(),
				"text": zod.z.string().readonly(),
				"status": zod.z.union([
					zod.z.literal("blocked"),
					zod.z.literal("covered"),
					zod.z.literal("partial"),
					zod.z.literal("missing"),
					zod.z.literal("conflicted")
				]).readonly(),
				"summary": zod.z.string().readonly(),
				"gap": zod.z.string().readonly(),
				"warning": zod.z.string().readonly(),
				"verification": zod.z.union([
					zod.z.literal(""),
					zod.z.literal("PASS"),
					zod.z.literal("WARNING"),
					zod.z.literal("FAIL")
				]).readonly(),
				"toolCount": zod.z.number().readonly()
			})).readonly().optional()
		});
		let _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0_strict$schema$value;
		const _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0_strict$schema = () => _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0_strict$schema$value ??= zod.z.strictObject({ "id": zod.z.string().readonly() });
		const TYPERT_REMOTE = createTypertRemoteInfo({
			package: "@deepseek-ai/dsh-deepresearch",
			methods: {
				"deepResearch/addEvidence": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchEvidenceRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"questionId": { "type": "string" },
									"criterionIds": {
										"type": "array",
										"items": { "type": "string" }
									},
									"source": { "type": "string" },
									"url": { "type": "string" },
									"snippet": { "type": "string" },
									"sources": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"url": { "type": "string" },
												"snippet": { "type": "string" },
												"artifactId": { "type": "string" }
											},
											"required": ["url", "snippet"],
											"additionalProperties": true
										}
									},
									"claim": { "type": "string" },
									"confidence": {
										"type": "string",
										"enum": [
											"low",
											"medium",
											"high"
										]
									},
									"status": {
										"type": "string",
										"enum": [
											"rejected",
											"candidate",
											"accepted"
										]
									}
								},
								"required": [
									"id",
									"questionId",
									"source",
									"claim",
									"confidence"
								],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchEvidenceRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"questionId": { "type": "string" },
									"criterionIds": {
										"type": "array",
										"items": { "type": "string" }
									},
									"source": { "type": "string" },
									"url": { "type": "string" },
									"snippet": { "type": "string" },
									"sources": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"url": { "type": "string" },
												"snippet": { "type": "string" },
												"artifactId": { "type": "string" }
											},
											"required": ["url", "snippet"],
											"additionalProperties": false
										}
									},
									"claim": { "type": "string" },
									"confidence": {
										"type": "string",
										"enum": [
											"low",
											"medium",
											"high"
										]
									},
									"status": {
										"type": "string",
										"enum": [
											"rejected",
											"candidate",
											"accepted"
										]
									}
								},
								"required": [
									"id",
									"questionId",
									"source",
									"claim",
									"confidence"
								],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 191,
						"column": 3
					}
				},
				"deepResearch/complete": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchCompleteRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"report": { "type": "string" },
									"conclusions": {
										"type": "array",
										"items": { "type": "string" }
									},
									"limitations": {
										"type": "array",
										"items": { "type": "string" }
									},
									"partial": {
										"type": "boolean",
										"enum": [false, true]
									}
								},
								"required": ["id", "report"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchCompleteRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"report": { "type": "string" },
									"conclusions": {
										"type": "array",
										"items": { "type": "string" }
									},
									"limitations": {
										"type": "array",
										"items": { "type": "string" }
									},
									"partial": {
										"type": "boolean",
										"enum": [false, true]
									}
								},
								"required": ["id", "report"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_complete_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 225,
						"column": 3
					}
				},
				"deepResearch/confirmPlan": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchConfirmRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchConfirmRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 181,
						"column": 9
					}
				},
				"deepResearch/delete": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchDeleteRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchDeleteRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchDeleteResult",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_delete_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": { "deleted": { "type": "boolean" } },
							"required": ["deleted"],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 269,
						"column": 3
					}
				},
				"deepResearch/fail": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchFailRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"reason": { "type": "string" },
									"aborted": { "type": "boolean" }
								},
								"required": ["id", "reason"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchFailRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"reason": { "type": "string" },
									"aborted": { "type": "boolean" }
								},
								"required": ["id", "reason"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_fail_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 235,
						"column": 3
					}
				},
				"deepResearch/get": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchGetRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchGetRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch#deepResearch/get:result",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_get_result$schema,
						jsonSchema: { "oneOf": [{
							"type": "null",
							"const": null
						}, {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}] }
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 144,
						"column": 3
					}
				},
				"deepResearch/list": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchListRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"query": { "type": "string" },
									"phase": {
										"type": "string",
										"enum": [
											"failed",
											"planning",
											"awaiting_plan_confirm",
											"investigating",
											"ready_for_report",
											"incomplete",
											"writing",
											"done",
											"aborted"
										]
									}
								},
								"required": [],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchListRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"query": { "type": "string" },
									"phase": {
										"type": "string",
										"enum": [
											"failed",
											"planning",
											"awaiting_plan_confirm",
											"investigating",
											"ready_for_report",
											"incomplete",
											"writing",
											"done",
											"aborted"
										]
									}
								},
								"required": [],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchListResult",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_list_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": { "projects": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"id": { "type": "string" },
										"title": { "type": "string" },
										"question": { "type": "string" },
										"goal": { "type": "string" },
										"constraints": { "type": "string" },
										"seedText": { "type": "string" },
										"depth": {
											"type": "string",
											"enum": [
												"standard",
												"quick",
												"deep"
											]
										},
										"phase": {
											"type": "string",
											"enum": [
												"failed",
												"planning",
												"awaiting_plan_confirm",
												"investigating",
												"ready_for_report",
												"incomplete",
												"writing",
												"done",
												"aborted"
											]
										},
										"runState": {
											"type": "string",
											"enum": [
												"running",
												"paused",
												"idle"
											]
										},
										"planConfirmed": { "type": "boolean" },
										"questions": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"id": { "type": "string" },
													"text": { "type": "string" },
													"dependsOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"status": {
														"type": "string",
														"enum": [
															"failed",
															"running",
															"pending",
															"blocked",
															"covered",
															"partial"
														]
													},
													"criteria": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"id": { "type": "string" },
																"text": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": [
																		"blocked",
																		"covered",
																		"partial",
																		"missing",
																		"conflicted"
																	]
																},
																"summary": { "type": "string" },
																"gap": { "type": "string" },
																"warning": { "type": "string" },
																"verification": {
																	"type": "string",
																	"enum": [
																		"",
																		"PASS",
																		"WARNING",
																		"FAIL"
																	]
																},
																"toolCount": { "type": "number" }
															},
															"required": [
																"id",
																"text",
																"status",
																"summary",
																"gap",
																"warning",
																"verification",
																"toolCount"
															],
															"additionalProperties": true
														}
													},
													"gaps": {
														"type": "array",
														"items": { "type": "string" }
													},
													"handoff": { "type": "string" }
												},
												"required": [
													"id",
													"text",
													"dependsOn",
													"status",
													"criteria",
													"gaps",
													"handoff"
												],
												"additionalProperties": true
											}
										},
										"evidence": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"id": { "type": "string" },
													"questionId": { "type": "string" },
													"criterionIds": {
														"type": "array",
														"items": { "type": "string" }
													},
													"source": { "type": "string" },
													"url": { "oneOf": [{
														"type": "null",
														"const": null
													}, { "type": "string" }] },
													"snippet": { "type": "string" },
													"sources": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"url": { "type": "string" },
																"snippet": { "type": "string" },
																"artifactId": { "type": "string" }
															},
															"required": ["url", "snippet"],
															"additionalProperties": true
														}
													},
													"claim": { "type": "string" },
													"confidence": {
														"type": "string",
														"enum": [
															"low",
															"medium",
															"high"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"rejected",
															"candidate",
															"accepted"
														]
													},
													"createdAt": { "type": "number" }
												},
												"required": [
													"id",
													"questionId",
													"criterionIds",
													"source",
													"url",
													"snippet",
													"sources",
													"claim",
													"confidence",
													"status",
													"createdAt"
												],
												"additionalProperties": true
											}
										},
										"conclusions": {
											"type": "array",
											"items": { "type": "string" }
										},
										"limitations": {
											"type": "array",
											"items": { "type": "string" }
										},
										"report": { "oneOf": [{
											"type": "null",
											"const": null
										}, { "type": "string" }] },
										"budget": {
											"type": "object",
											"properties": {
												"maxSearches": { "type": "number" },
												"maxFetches": { "type": "number" },
												"searchesUsed": { "type": "number" },
												"fetchesUsed": { "type": "number" }
											},
											"required": [
												"maxSearches",
												"maxFetches",
												"searchesUsed",
												"fetchesUsed"
											],
											"additionalProperties": true
										},
										"progress": {
											"type": "object",
											"properties": {
												"running": { "type": "number" },
												"waiting": { "type": "number" },
												"scouts": {
													"type": "array",
													"items": {
														"type": "object",
														"properties": {
															"questionId": { "type": "string" },
															"role": {
																"type": "string",
																"enum": [
																	"waiting",
																	"writing",
																	"scout",
																	"evaluator"
																]
															},
															"status": {
																"type": "string",
																"enum": [
																	"running",
																	"blocked",
																	"waiting",
																	"done",
																	"partial",
																	"verifying"
																]
															},
															"waitingOn": {
																"type": "array",
																"items": { "type": "string" }
															},
															"toolsUsed": { "type": "number" },
															"toolsCap": { "type": "number" },
															"activity": { "type": "string" },
															"tools": {
																"type": "array",
																"items": {
																	"type": "object",
																	"properties": {
																		"name": { "type": "string" },
																		"detail": { "type": "string" },
																		"status": {
																			"type": "string",
																			"enum": ["running", "done"]
																		}
																	},
																	"required": [
																		"name",
																		"detail",
																		"status"
																	],
																	"additionalProperties": true
																}
															},
															"scoutDraft": { "type": "string" },
															"evaluatorDraft": { "type": "string" },
															"activeCriterionId": { "type": "string" },
															"activeCriterionText": { "type": "string" },
															"dependencySummary": { "type": "string" },
															"handoff": { "type": "string" }
														},
														"required": [
															"questionId",
															"role",
															"status",
															"waitingOn",
															"toolsUsed",
															"toolsCap",
															"activity",
															"tools",
															"scoutDraft",
															"evaluatorDraft",
															"activeCriterionId",
															"activeCriterionText",
															"dependencySummary",
															"handoff"
														],
														"additionalProperties": true
													}
												}
											},
											"required": [
												"running",
												"waiting",
												"scouts"
											],
											"additionalProperties": true
										},
										"createdAt": { "type": "number" },
										"updatedAt": { "type": "number" }
									},
									"required": [
										"id",
										"title",
										"question",
										"goal",
										"constraints",
										"seedText",
										"depth",
										"phase",
										"runState",
										"planConfirmed",
										"questions",
										"evidence",
										"conclusions",
										"limitations",
										"report",
										"budget",
										"progress",
										"createdAt",
										"updatedAt"
									],
									"additionalProperties": true
								}
							} },
							"required": ["projects"],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 138,
						"column": 3
					}
				},
				"deepResearch/resume": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchResumeRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchResumeRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_resume_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 243,
						"column": 9
					}
				},
				"deepResearch/start": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchStartRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"title": { "type": "string" },
									"question": { "type": "string" },
									"goal": { "type": "string" },
									"constraints": { "type": "string" },
									"seedText": { "type": "string" },
									"depth": {
										"type": "string",
										"enum": [
											"standard",
											"quick",
											"deep"
										]
									},
									"questions": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"text": { "type": "string" },
												"criteria": {
													"type": "array",
													"items": { "type": "string" }
												},
												"dependsOn": {
													"type": "array",
													"items": { "type": "number" }
												}
											},
											"required": ["text", "criteria"],
											"additionalProperties": true
										}
									}
								},
								"required": [
									"question",
									"depth",
									"questions"
								],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchStartRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"title": { "type": "string" },
									"question": { "type": "string" },
									"goal": { "type": "string" },
									"constraints": { "type": "string" },
									"seedText": { "type": "string" },
									"depth": {
										"type": "string",
										"enum": [
											"standard",
											"quick",
											"deep"
										]
									},
									"questions": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"text": { "type": "string" },
												"criteria": {
													"type": "array",
													"items": { "type": "string" }
												},
												"dependsOn": {
													"type": "array",
													"items": { "type": "number" }
												}
											},
											"required": ["text", "criteria"],
											"additionalProperties": false
										}
									}
								},
								"required": [
									"question",
									"depth",
									"questions"
								],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_start_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 147,
						"column": 3
					}
				},
				"deepResearch/updatePlan": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchPlanUpdateRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"goal": { "type": "string" },
									"constraints": { "type": "string" },
									"depth": {
										"type": "string",
										"enum": [
											"standard",
											"quick",
											"deep"
										]
									},
									"questions": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"text": { "type": "string" },
												"criteria": {
													"type": "array",
													"items": { "type": "string" }
												},
												"dependsOn": {
													"type": "array",
													"items": { "type": "number" }
												}
											},
											"required": ["text", "criteria"],
											"additionalProperties": true
										}
									}
								},
								"required": [
									"id",
									"goal",
									"constraints",
									"depth",
									"questions"
								],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchPlanUpdateRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"goal": { "type": "string" },
									"constraints": { "type": "string" },
									"depth": {
										"type": "string",
										"enum": [
											"standard",
											"quick",
											"deep"
										]
									},
									"questions": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"text": { "type": "string" },
												"criteria": {
													"type": "array",
													"items": { "type": "string" }
												},
												"dependsOn": {
													"type": "array",
													"items": { "type": "number" }
												}
											},
											"required": ["text", "criteria"],
											"additionalProperties": false
										}
									}
								},
								"required": [
									"id",
									"goal",
									"constraints",
									"depth",
									"questions"
								],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 171,
						"column": 3
					}
				},
				"deepResearch/updateQuestion": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchQuestionUpdateRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"questionId": { "type": "string" },
									"status": {
										"type": "string",
										"enum": [
											"failed",
											"running",
											"pending",
											"blocked",
											"covered",
											"partial"
										]
									},
									"criteria": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"id": { "type": "string" },
												"text": { "type": "string" },
												"status": {
													"type": "string",
													"enum": [
														"blocked",
														"covered",
														"partial",
														"missing",
														"conflicted"
													]
												},
												"summary": { "type": "string" },
												"gap": { "type": "string" },
												"warning": { "type": "string" },
												"verification": {
													"type": "string",
													"enum": [
														"",
														"PASS",
														"WARNING",
														"FAIL"
													]
												},
												"toolCount": { "type": "number" }
											},
											"required": [
												"id",
												"text",
												"status",
												"summary",
												"gap",
												"warning",
												"verification",
												"toolCount"
											],
											"additionalProperties": true
										}
									}
								},
								"required": [
									"id",
									"questionId",
									"status"
								],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchQuestionUpdateRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": {
									"id": { "type": "string" },
									"questionId": { "type": "string" },
									"status": {
										"type": "string",
										"enum": [
											"failed",
											"running",
											"pending",
											"blocked",
											"covered",
											"partial"
										]
									},
									"criteria": {
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"id": { "type": "string" },
												"text": { "type": "string" },
												"status": {
													"type": "string",
													"enum": [
														"blocked",
														"covered",
														"partial",
														"missing",
														"conflicted"
													]
												},
												"summary": { "type": "string" },
												"gap": { "type": "string" },
												"warning": { "type": "string" },
												"verification": {
													"type": "string",
													"enum": [
														"",
														"PASS",
														"WARNING",
														"FAIL"
													]
												},
												"toolCount": { "type": "number" }
											},
											"required": [
												"id",
												"text",
												"status",
												"summary",
												"gap",
												"warning",
												"verification",
												"toolCount"
											],
											"additionalProperties": false
										}
									}
								},
								"required": [
									"id",
									"questionId",
									"status"
								],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 212,
						"column": 3
					}
				},
				"deepResearch/writeReport": {
					service: "deepResearch",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchWriteReportRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": true
							}
						},
						strictCodec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchWriteReportRequest",
							create: _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0_strict$schema,
							jsonSchema: {
								"type": "object",
								"properties": { "id": { "type": "string" } },
								"required": ["id"],
								"additionalProperties": false
							}
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						create: _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_result$schema,
						jsonSchema: {
							"type": "object",
							"properties": {
								"id": { "type": "string" },
								"title": { "type": "string" },
								"question": { "type": "string" },
								"goal": { "type": "string" },
								"constraints": { "type": "string" },
								"seedText": { "type": "string" },
								"depth": {
									"type": "string",
									"enum": [
										"standard",
										"quick",
										"deep"
									]
								},
								"phase": {
									"type": "string",
									"enum": [
										"failed",
										"planning",
										"awaiting_plan_confirm",
										"investigating",
										"ready_for_report",
										"incomplete",
										"writing",
										"done",
										"aborted"
									]
								},
								"runState": {
									"type": "string",
									"enum": [
										"running",
										"paused",
										"idle"
									]
								},
								"planConfirmed": { "type": "boolean" },
								"questions": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"text": { "type": "string" },
											"dependsOn": {
												"type": "array",
												"items": { "type": "string" }
											},
											"status": {
												"type": "string",
												"enum": [
													"failed",
													"running",
													"pending",
													"blocked",
													"covered",
													"partial"
												]
											},
											"criteria": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"id": { "type": "string" },
														"text": { "type": "string" },
														"status": {
															"type": "string",
															"enum": [
																"blocked",
																"covered",
																"partial",
																"missing",
																"conflicted"
															]
														},
														"summary": { "type": "string" },
														"gap": { "type": "string" },
														"warning": { "type": "string" },
														"verification": {
															"type": "string",
															"enum": [
																"",
																"PASS",
																"WARNING",
																"FAIL"
															]
														},
														"toolCount": { "type": "number" }
													},
													"required": [
														"id",
														"text",
														"status",
														"summary",
														"gap",
														"warning",
														"verification",
														"toolCount"
													],
													"additionalProperties": true
												}
											},
											"gaps": {
												"type": "array",
												"items": { "type": "string" }
											},
											"handoff": { "type": "string" }
										},
										"required": [
											"id",
											"text",
											"dependsOn",
											"status",
											"criteria",
											"gaps",
											"handoff"
										],
										"additionalProperties": true
									}
								},
								"evidence": {
									"type": "array",
									"items": {
										"type": "object",
										"properties": {
											"id": { "type": "string" },
											"questionId": { "type": "string" },
											"criterionIds": {
												"type": "array",
												"items": { "type": "string" }
											},
											"source": { "type": "string" },
											"url": { "oneOf": [{
												"type": "null",
												"const": null
											}, { "type": "string" }] },
											"snippet": { "type": "string" },
											"sources": {
												"type": "array",
												"items": {
													"type": "object",
													"properties": {
														"url": { "type": "string" },
														"snippet": { "type": "string" },
														"artifactId": { "type": "string" }
													},
													"required": ["url", "snippet"],
													"additionalProperties": true
												}
											},
											"claim": { "type": "string" },
											"confidence": {
												"type": "string",
												"enum": [
													"low",
													"medium",
													"high"
												]
											},
											"status": {
												"type": "string",
												"enum": [
													"rejected",
													"candidate",
													"accepted"
												]
											},
											"createdAt": { "type": "number" }
										},
										"required": [
											"id",
											"questionId",
											"criterionIds",
											"source",
											"url",
											"snippet",
											"sources",
											"claim",
											"confidence",
											"status",
											"createdAt"
										],
										"additionalProperties": true
									}
								},
								"conclusions": {
									"type": "array",
									"items": { "type": "string" }
								},
								"limitations": {
									"type": "array",
									"items": { "type": "string" }
								},
								"report": { "oneOf": [{
									"type": "null",
									"const": null
								}, { "type": "string" }] },
								"budget": {
									"type": "object",
									"properties": {
										"maxSearches": { "type": "number" },
										"maxFetches": { "type": "number" },
										"searchesUsed": { "type": "number" },
										"fetchesUsed": { "type": "number" }
									},
									"required": [
										"maxSearches",
										"maxFetches",
										"searchesUsed",
										"fetchesUsed"
									],
									"additionalProperties": true
								},
								"progress": {
									"type": "object",
									"properties": {
										"running": { "type": "number" },
										"waiting": { "type": "number" },
										"scouts": {
											"type": "array",
											"items": {
												"type": "object",
												"properties": {
													"questionId": { "type": "string" },
													"role": {
														"type": "string",
														"enum": [
															"waiting",
															"writing",
															"scout",
															"evaluator"
														]
													},
													"status": {
														"type": "string",
														"enum": [
															"running",
															"blocked",
															"waiting",
															"done",
															"partial",
															"verifying"
														]
													},
													"waitingOn": {
														"type": "array",
														"items": { "type": "string" }
													},
													"toolsUsed": { "type": "number" },
													"toolsCap": { "type": "number" },
													"activity": { "type": "string" },
													"tools": {
														"type": "array",
														"items": {
															"type": "object",
															"properties": {
																"name": { "type": "string" },
																"detail": { "type": "string" },
																"status": {
																	"type": "string",
																	"enum": ["running", "done"]
																}
															},
															"required": [
																"name",
																"detail",
																"status"
															],
															"additionalProperties": true
														}
													},
													"scoutDraft": { "type": "string" },
													"evaluatorDraft": { "type": "string" },
													"activeCriterionId": { "type": "string" },
													"activeCriterionText": { "type": "string" },
													"dependencySummary": { "type": "string" },
													"handoff": { "type": "string" }
												},
												"required": [
													"questionId",
													"role",
													"status",
													"waitingOn",
													"toolsUsed",
													"toolsCap",
													"activity",
													"tools",
													"scoutDraft",
													"evaluatorDraft",
													"activeCriterionId",
													"activeCriterionText",
													"dependencySummary",
													"handoff"
												],
												"additionalProperties": true
											}
										}
									},
									"required": [
										"running",
										"waiting",
										"scouts"
									],
									"additionalProperties": true
								},
								"createdAt": { "type": "number" },
								"updatedAt": { "type": "number" }
							},
							"required": [
								"id",
								"title",
								"question",
								"goal",
								"constraints",
								"seedText",
								"depth",
								"phase",
								"runState",
								"planConfirmed",
								"questions",
								"evidence",
								"conclusions",
								"limitations",
								"report",
								"budget",
								"progress",
								"createdAt",
								"updatedAt"
							],
							"additionalProperties": true
						}
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 255,
						"column": 9
					}
				}
			}
		}, zod.z);
		//#endregion
		//#region lib/types/client/project-hydrate.js
		/** Fill fields the stale Remote codec may strip so the workspace never reads undefined. */
		const emptyProgress = {
			running: 0,
			waiting: 0,
			scouts: []
		};
		/** Normalize one wire project after Remote parse. */
		function hydrateResearchProject(project) {
			const progress = project.progress;
			return {
				...project,
				runState: project.runState ?? ([
					"planning",
					"investigating",
					"writing"
				].includes(project.phase) ? "running" : "idle"),
				questions: (project.questions ?? []).map((question) => ({
					...question,
					dependsOn: question.dependsOn ?? [],
					gaps: question.gaps ?? [],
					handoff: question.handoff ?? "",
					criteria: (question.criteria ?? []).map((criterion) => ({
						...criterion,
						warning: criterion.warning ?? "",
						verification: criterion.verification ?? "",
						toolCount: criterion.toolCount ?? 0
					}))
				})),
				evidence: (project.evidence ?? []).map((item) => ({
					...item,
					criterionIds: item.criterionIds ?? [],
					sources: item.sources ?? [],
					status: item.status ?? "accepted"
				})),
				conclusions: project.conclusions ?? [],
				limitations: project.limitations ?? [],
				progress: {
					running: progress?.running ?? 0,
					waiting: progress?.waiting ?? 0,
					scouts: (progress?.scouts ?? emptyProgress.scouts).map((scout) => ({
						questionId: scout.questionId,
						role: scout.role ?? "waiting",
						status: scout.status ?? "waiting",
						waitingOn: scout.waitingOn ?? [],
						toolsUsed: scout.toolsUsed ?? 0,
						toolsCap: scout.toolsCap ?? 0,
						activity: scout.activity ?? "",
						tools: scout.tools ?? [],
						scoutDraft: scout.scoutDraft ?? "",
						evaluatorDraft: scout.evaluatorDraft ?? "",
						activeCriterionId: scout.activeCriterionId ?? "",
						activeCriterionText: scout.activeCriterionText ?? "",
						dependencySummary: scout.dependencySummary ?? "",
						handoff: scout.handoff ?? ""
					}))
				}
			};
		}
		//#endregion
		//#region lib/types/client/locales.js
		/**
		* `deepresearch` namespace dictionaries (view copy + slot tab label).
		*
		* Mirrors the locale pattern of `@deepseek-ai/dsh-client-ui-trajectory`
		* (`src/client/locales.ts`): the key set is declared once as
		* `DeepResearchKey`, both dictionaries are typed `Record<DeepResearchKey,
		* string>`, and the namespace is merged into `LocaleNamespaceMap` so
		* registering `locale: NS` puts the typed `t` seat on the component props.
		*/
		/** Dictionary namespace owned by this plugin. */
		const NS = "deepresearch";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"view.deepResearch": "深度研究",
			"library.title": "研究资料库",
			"library.back": "对话",
			"library.backAria": "返回对话",
			"library.projectCount": "{count} 个研究项目",
			"library.filterAria": "研究状态筛选",
			"filter.all": "全部",
			"filter.planning": "计划中",
			"filter.investigating": "调查中",
			"filter.done": "已完成",
			"toolbar.search": "搜索研究",
			"toolbar.searchAria": "搜索研究",
			"toolbar.sortAria": "研究排序",
			"toolbar.sortRecent": "最近更新",
			"toolbar.sortTitle": "按标题",
			"toolbar.gridView": "网格视图",
			"toolbar.listView": "列表视图",
			"action.start": "发起研究",
			"action.startShort": "发起研究",
			"action.cancel": "取消",
			"action.creating": "创建中…",
			"action.createPlan": "创建研究计划",
			"action.saveChanges": "保存修改",
			"action.confirmStart": "确认并开始",
			"action.savePartial": "保存为部分完成",
			"action.complete": "完成研究",
			"empty.none": "还没有研究项目",
			"empty.noMatch": "没有匹配的研究项目",
			"empty.hintStart": "从一个值得深入的问题开始。",
			"empty.hintNoMatch": "试试其他关键词或清除搜索条件。",
			"card.openAria": "打开研究：{title}",
			"card.evidence": "{count} 条证据 · {date}",
			"composer.title": "发起深度研究",
			"composer.subtitle": "描述问题，先生成一份可审查、可修改的研究计划。",
			"composer.closeAria": "关闭",
			"composer.question": "研究问题",
			"composer.required": "必填",
			"composer.questionPlaceholder": "你想深入研究什么？",
			"composer.context": "添加研究背景",
			"composer.contextCount": " · {count}",
			"composer.contextHint": "目标、深度、限制和已有材料",
			"composer.goal": "研究目标",
			"composer.goalPlaceholder": "希望最终得到什么",
			"composer.depth": "研究深度",
			"depth.quick": "快速",
			"depth.standard": "标准",
			"depth.deep": "深入",
			"composer.constraints": "限制与要求",
			"composer.constraintsPlaceholder": "时间、地域、来源或输出约束",
			"composer.seed": "已有材料",
			"composer.seedPlaceholder": "粘贴已有笔记或摘录（可选）",
			"composer.footer": "计划 → 调查 → 报告",
			"workspace.back": "深度研究",
			"workspace.delete": "删除",
			"delete.title": "删除研究",
			"delete.body": "「{title}」会从资料库里永久移除，包括计划和证据。",
			"delete.confirm": "删除",
			"overlay.crashTitle": "深度研究界面加载失败",
			"overlay.crashHint": "这通常是旧数据字段不完整导致的。你可以返回资料库重试，或删除该项目后重新创建。",
			"overlay.crashBack": "返回资料库",
			"stepper.plan": "1 计划",
			"stepper.investigate": "2 调查",
			"stepper.report": "3 报告",
			"plan.title": "研究计划",
			"plan.subtitle": "确认后，编排器按子问题和验收标准派出 Scout / Evaluator，再用写作包撰写报告。",
			"plan.confirmed": "已确认",
			"plan.goal": "研究目标",
			"plan.constraints": "约束",
			"plan.criteria": "子问题与验收标准",
			"plan.dependsOn": "依赖",
			"plan.dependsOnChip": "需先完成 {label}",
			"plan.dependsOnHint": "上游子问题完成后才会执行；开始时会带上前面题的简要结论，避免重复搜索。",
			"plan.failedTitle": "研究计划生成失败",
			"plan.failedHint": "后台规划 Agent 未能提交计划。查看下方错误后删除该项目并重新创建。",
			"plan.retry": "重新生成计划",
			"plan.stopped": "计划已停止",
			"plan.stoppedHint": "运行已安全停止，可以继续生成计划。",
			"metric.subQuestions": "子问题",
			"metric.evidence": "证据",
			"metric.searchBudget": "检索预算",
			"metric.fetchBudget": "抓取预算",
			"metric.running": "进行中",
			"metric.waiting": "等待依赖",
			"investigate.title": "调查看板",
			"investigate.subtitle": "Scout 检索原文，Evaluator 过审后才写入证据。此页自动刷新过程。",
			"investigate.running": "调查进行中：Scout 检索 / Evaluator 核验。",
			"investigate.readyTitle": "调查已收束",
			"investigate.readyHint": "子问题已落地。部分覆盖和未通过的标准记在限制里，报告会接着写。",
			"investigate.incompleteTitle": "调查未完成",
			"investigate.incompleteHint": "部分标准只部分覆盖或被拒绝，已记入限制。",
			"investigate.stop": "停止调查",
			"investigate.stopReason": "用户停止了调查。",
			"investigate.continue": "继续调查",
			"investigate.pausedHint": "运行已安全停止，计划、证据和检查点均已保留。",
			"investigate.writeReport": "撰写报告",
			"investigate.dependsOn": "依赖 {count} 个上游问题",
			"investigate.waitingOn": "等待上游：{list}",
			"investigate.waitingStatus": "等待依赖",
			"investigate.questions": "子问题",
			"investigate.scouts": "Scout",
			"investigate.verifying": "核验中",
			"investigate.tools": "工具",
			"investigate.handoff": "交接摘要",
			"investigate.dependencySummary": "上游线索",
			"investigate.summary": "摘要",
			"investigate.warning": "警告",
			"investigate.gaps": "缺口",
			"investigate.draft": "草稿",
			"investigate.scoutDraft": "Scout 草稿",
			"investigate.evaluatorDraft": "Evaluator 草稿",
			"investigate.queued": "排队中",
			"investigate.queuedHint": "编排器按依赖和并行上限派出 Scout，检索和核验过程会写在这张卡片上。",
			"investigate.evaluating": "Evaluator 正在核验候选人",
			"investigate.evidenceCount": "{count} 条证据",
			"investigate.coverage": "验收标准",
			"investigate.toolsUsed": "{used}/{cap} 工具",
			"investigate.capReached": "已达上限",
			"investigate.activeNow": "进行中",
			"investigate.toolSearch": "搜索",
			"investigate.toolFetch": "抓取",
			"investigate.toolRead": "读原文",
			"coverage.missing": "未覆盖",
			"coverage.partial": "部分覆盖",
			"coverage.covered": "已覆盖",
			"coverage.conflicted": "有冲突",
			"coverage.blocked": "受阻",
			"verify.pass": "通过",
			"verify.warning": "警告",
			"verify.fail": "未通过",
			"evidence.title": "来源证据",
			"evidence.sourcesTitle": "来源",
			"evidence.empty": "后台研究 Agent 正在检索来源；保存证据后会自动显示在这里。",
			"evidence.open": "打开来源",
			"confidence.high": "高",
			"confidence.medium": "中",
			"confidence.low": "低",
			"report.title": "综合报告",
			"report.subtitle": "根据已核验证据撰写综合报告，并在正文中引用来源。",
			"report.placeholder": "Markdown 研究报告…",
			"report.limitations": "限制与未解决问题",
			"report.limitationsPlaceholder": "每行一项限制",
			"report.limitationsEmpty": "目前没有部分覆盖或被拒绝的标准。",
			"limitation.partialFallback": "证据不足，该标准只部分满足。",
			"limitation.blockedFallback": "核验未通过，该标准被拒绝。",
			"limitation.conflictedFallback": "来源结论冲突，尚未形成一致判断。",
			"limitation.missingFallback": "该标准仍未覆盖。",
			"report.writing": "后台研究 Agent 正在整理证据并撰写报告…",
			"report.empty": "报告尚未生成。",
			"report.retry": "重新撰写报告",
			"markdown.copy": "复制",
			"markdown.copied": "已复制",
			"markdown.code": "代码",
			"markdown.wrap": "自动换行",
			"markdown.unwrap": "取消换行",
			"markdown.footnotes": "脚注",
			"planTemplate.define": "界定核心问题：{question}",
			"planTemplate.defineCriteria": "明确回答范围、关键概念和判定标准",
			"planTemplate.search": "检索并筛选权威来源",
			"planTemplate.searchCriteria": "至少获得两个相互独立且可追溯的来源",
			"planTemplate.crossValidate": "交叉验证关键结论",
			"planTemplate.crossValidateCriteria": "识别一致结论、冲突信息和证据缺口",
			"planTemplate.synthesize": "综合证据并形成报告",
			"planTemplate.synthesizeCriteria": "引用来源并说明限制与不确定性",
			"phase.planning": "计划中",
			"phase.awaitingPlanConfirm": "待确认",
			"phase.investigating": "调查中",
			"phase.readyForReport": "可写报告",
			"phase.incomplete": "部分完成",
			"phase.writing": "撰写中",
			"phase.done": "已完成",
			"phase.failed": "失败",
			"phase.aborted": "已停止",
			"status.pending": "待处理",
			"status.running": "调查中",
			"status.covered": "已覆盖",
			"status.partial": "部分覆盖",
			"status.blocked": "受阻",
			"status.failed": "失败"
		};
		/** English dictionary. */
		const en = {
			"view.deepResearch": "Deep Research",
			"library.title": "Research Library",
			"library.back": "Chat",
			"library.backAria": "Back to chat",
			"library.projectCount": "{count} research projects",
			"library.filterAria": "Filter by research status",
			"filter.all": "All",
			"filter.planning": "Planning",
			"filter.investigating": "Investigating",
			"filter.done": "Done",
			"toolbar.search": "Search research",
			"toolbar.searchAria": "Search research",
			"toolbar.sortAria": "Sort research",
			"toolbar.sortRecent": "Recently updated",
			"toolbar.sortTitle": "By title",
			"toolbar.gridView": "Grid view",
			"toolbar.listView": "List view",
			"action.start": "Start research",
			"action.startShort": "Start research",
			"action.cancel": "Cancel",
			"action.creating": "Creating…",
			"action.createPlan": "Create research plan",
			"action.saveChanges": "Save changes",
			"action.confirmStart": "Confirm & start",
			"action.savePartial": "Save as partially complete",
			"action.complete": "Complete research",
			"empty.none": "No research projects yet",
			"empty.noMatch": "No matching research projects",
			"empty.hintStart": "Start with a question worth digging into.",
			"empty.hintNoMatch": "Try different keywords or clear the search.",
			"card.openAria": "Open research: {title}",
			"card.evidence": "{count} evidence · {date}",
			"composer.title": "Start Deep Research",
			"composer.subtitle": "Describe the question; a reviewable, editable research plan is generated first.",
			"composer.closeAria": "Close",
			"composer.question": "Research question",
			"composer.required": "required",
			"composer.questionPlaceholder": "What would you like to research in depth?",
			"composer.context": "Add research context",
			"composer.contextCount": " · {count}",
			"composer.contextHint": "Goal, depth, constraints, and existing material",
			"composer.goal": "Research goal",
			"composer.goalPlaceholder": "What you want to end up with",
			"composer.depth": "Research depth",
			"depth.quick": "Quick",
			"depth.standard": "Standard",
			"depth.deep": "Deep",
			"composer.constraints": "Constraints & requirements",
			"composer.constraintsPlaceholder": "Time, region, source, or output constraints",
			"composer.seed": "Existing material",
			"composer.seedPlaceholder": "Paste existing notes or excerpts (optional)",
			"composer.footer": "Plan → Investigate → Report",
			"workspace.back": "Deep Research",
			"workspace.delete": "Delete",
			"delete.title": "Delete research",
			"delete.body": "“{title}” will be removed from the library, including its plan and evidence.",
			"delete.confirm": "Delete",
			"overlay.crashTitle": "Deep Research failed to load",
			"overlay.crashHint": "This is usually caused by incomplete stored fields. Go back to the library and retry, or delete the project and start again.",
			"overlay.crashBack": "Back to library",
			"stepper.plan": "1 Plan",
			"stepper.investigate": "2 Investigate",
			"stepper.report": "3 Report",
			"plan.title": "Research plan",
			"plan.subtitle": "Once confirmed, the orchestrator runs Scout / Evaluator per criterion, then writes the report from the verified pack.",
			"plan.confirmed": "Confirmed",
			"plan.goal": "Research goal",
			"plan.constraints": "Constraints",
			"plan.criteria": "Sub-questions & acceptance criteria",
			"plan.dependsOn": "Depends on",
			"plan.dependsOnChip": "Needs {label} first",
			"plan.dependsOnHint": "Runs only after the listed upstream sub-questions finish. When it starts, it gets a short summary of their confirmed findings.",
			"plan.failedTitle": "Research plan generation failed",
			"plan.failedHint": "The background planning agent did not submit a plan. Review the error below, then delete this project and create it again.",
			"plan.retry": "Retry planning",
			"plan.stopped": "Planning stopped",
			"plan.stoppedHint": "The run stopped safely. You can retry planning.",
			"metric.subQuestions": "Sub-questions",
			"metric.evidence": "Evidence",
			"metric.searchBudget": "Search budget",
			"metric.fetchBudget": "Fetch budget",
			"metric.running": "Running",
			"metric.waiting": "Waiting on deps",
			"investigate.title": "Investigation board",
			"investigate.subtitle": "Scouts fetch sources; the Evaluator accepts evidence. This page refreshes the live process.",
			"investigate.running": "Investigation in progress: Scout search / Evaluator review.",
			"investigate.readyTitle": "Investigation settled",
			"investigate.readyHint": "Sub-questions have landed. Partial and rejected criteria are recorded as limitations; the report comes next.",
			"investigate.incompleteTitle": "Investigation incomplete",
			"investigate.incompleteHint": "Some criteria are only partial or were rejected, and are recorded as limitations.",
			"investigate.stop": "Stop investigation",
			"investigate.stopReason": "The user stopped the investigation.",
			"investigate.continue": "Continue investigation",
			"investigate.pausedHint": "The run stopped safely. Completed plans, evidence, and checkpoints were preserved.",
			"investigate.writeReport": "Write report",
			"investigate.dependsOn": "Depends on {count} upstream question(s)",
			"investigate.waitingOn": "Waiting on: {list}",
			"investigate.waitingStatus": "Waiting on deps",
			"investigate.questions": "Sub-questions",
			"investigate.scouts": "Scouts",
			"investigate.verifying": "Verifying",
			"investigate.tools": "tools",
			"investigate.handoff": "Handoff",
			"investigate.dependencySummary": "Upstream clues",
			"investigate.summary": "Summary",
			"investigate.warning": "Warning",
			"investigate.gaps": "Gaps",
			"investigate.draft": "Draft",
			"investigate.scoutDraft": "Scout draft",
			"investigate.evaluatorDraft": "Evaluator draft",
			"investigate.queued": "Queued",
			"investigate.queuedHint": "The orchestrator dispatches Scouts by dependency and parallelism. Search and review appear on this card.",
			"investigate.evaluating": "Evaluator is reviewing candidates",
			"investigate.evidenceCount": "{count} evidence",
			"investigate.coverage": "Coverage",
			"investigate.toolsUsed": "{used}/{cap} tools",
			"investigate.capReached": "cap reached",
			"investigate.activeNow": "In progress",
			"investigate.toolSearch": "Search",
			"investigate.toolFetch": "Fetch",
			"investigate.toolRead": "Read source",
			"coverage.missing": "Missing",
			"coverage.partial": "Partial",
			"coverage.covered": "Covered",
			"coverage.conflicted": "Conflicted",
			"coverage.blocked": "Blocked",
			"verify.pass": "PASS",
			"verify.warning": "WARNING",
			"verify.fail": "FAIL",
			"evidence.title": "Source evidence",
			"evidence.sourcesTitle": "Sources",
			"evidence.empty": "The background research agent is finding sources. Saved evidence appears here automatically.",
			"evidence.open": "Open source",
			"confidence.high": "High",
			"confidence.medium": "Medium",
			"confidence.low": "Low",
			"report.title": "Synthesis report",
			"report.subtitle": "Write from verified evidence and cite sources in the report.",
			"report.placeholder": "Markdown research report…",
			"report.limitations": "Limitations & open questions",
			"report.limitationsPlaceholder": "One limitation per line",
			"report.limitationsEmpty": "No partially covered or rejected criteria.",
			"limitation.partialFallback": "Evidence is incomplete, so this criterion is only partially met.",
			"limitation.blockedFallback": "Verification rejected this criterion.",
			"limitation.conflictedFallback": "Sources disagree, so this criterion is still unresolved.",
			"limitation.missingFallback": "This criterion is still uncovered.",
			"report.writing": "The background research agent is synthesizing evidence and writing the report…",
			"report.empty": "No report has been generated yet.",
			"report.retry": "Retry report writing",
			"markdown.copy": "Copy",
			"markdown.copied": "Copied",
			"markdown.code": "Code",
			"markdown.wrap": "Wrap",
			"markdown.unwrap": "Unwrap",
			"markdown.footnotes": "Footnotes",
			"planTemplate.define": "Define the core question: {question}",
			"planTemplate.defineCriteria": "Clarify the answer scope, key concepts, and success criteria",
			"planTemplate.search": "Search and filter authoritative sources",
			"planTemplate.searchCriteria": "Obtain at least two independent, traceable sources",
			"planTemplate.crossValidate": "Cross-validate key conclusions",
			"planTemplate.crossValidateCriteria": "Identify consistent conclusions, conflicting information, and evidence gaps",
			"planTemplate.synthesize": "Synthesize evidence and produce a report",
			"planTemplate.synthesizeCriteria": "Cite sources and state limitations and uncertainty",
			"phase.planning": "Planning",
			"phase.awaitingPlanConfirm": "Awaiting confirmation",
			"phase.investigating": "Investigating",
			"phase.readyForReport": "Report ready",
			"phase.incomplete": "Partially complete",
			"phase.writing": "Writing",
			"phase.done": "Done",
			"phase.failed": "Failed",
			"phase.aborted": "Stopped",
			"status.pending": "Pending",
			"status.running": "Investigating",
			"status.covered": "Covered",
			"status.partial": "Partially covered",
			"status.blocked": "Blocked",
			"status.failed": "Failed"
		};
		//#endregion
		//#region lib/types/client/ui-store.js
		/** Root-scoped overlay route: open/close plus the selected project, synced to the URL hash. */
		const HASH_ROOT = "#deepresearch";
		/** Parse `#deepresearch` and `#deepresearch/<id>` from the current location. */
		function readDeepResearchRoute(hash = typeof window === "undefined" ? "" : window.location.hash) {
			if (hash === HASH_ROOT || hash === `${HASH_ROOT}/`) return {
				open: true,
				projectId: null
			};
			if (hash.startsWith(`${HASH_ROOT}/`)) {
				const projectId = decodeURIComponent(hash.slice(14));
				return {
					open: true,
					projectId: projectId === "" ? null : projectId
				};
			}
			return {
				open: false,
				projectId: null
			};
		}
		function hashFor(route) {
			if (!route.open) return "";
			return route.projectId === null ? HASH_ROOT : `${HASH_ROOT}/${encodeURIComponent(route.projectId)}`;
		}
		function writeHash(route, mode) {
			if (typeof window === "undefined") return;
			const next = hashFor(route);
			if (window.location.hash === next) return;
			const url = `${window.location.pathname}${window.location.search}${next}`;
			if (mode === "push") window.history.pushState(null, "", url);
			else window.history.replaceState(null, "", url);
		}
		/** Prefer the project id encoded in the current hash when the overlay is being opened. */
		function projectIdFromHashOrCurrent(current) {
			const routed = readDeepResearchRoute();
			return routed.open ? routed.projectId : current;
		}
		/** Create one overlay store shared by the sidebar entry and shell overlay. */
		function createDeepResearchUiStore() {
			const initial = readDeepResearchRoute();
			let open = initial.open;
			let projectId = initial.projectId;
			const listeners = /* @__PURE__ */ new Set();
			let writing = false;
			const emit = () => {
				for (const listener of listeners) listener();
			};
			const applyRoute = (next, mode) => {
				const changed = open !== next.open || projectId !== next.projectId;
				open = next.open;
				projectId = next.open ? next.projectId : null;
				if (mode !== "silent") {
					writing = true;
					writeHash({
						open,
						projectId
					}, mode);
					writing = false;
				}
				if (changed) emit();
			};
			if (typeof window !== "undefined") {
				const syncFromLocation = () => {
					if (writing) return;
					applyRoute(readDeepResearchRoute(), "silent");
				};
				window.addEventListener("popstate", syncFromLocation);
				window.addEventListener("hashchange", syncFromLocation);
			}
			return {
				getOpen: () => open,
				getProjectId: () => projectId,
				setOpen: (next) => {
					if (!next) {
						if (!open) return;
						applyRoute({
							open: false,
							projectId: null
						}, "push");
						return;
					}
					const nextProjectId = projectIdFromHashOrCurrent(projectId);
					if (open && nextProjectId === projectId) return;
					applyRoute({
						open: true,
						projectId: nextProjectId
					}, open ? "replace" : "push");
				},
				setProjectId: (id) => {
					if (open && id === projectId) return;
					applyRoute({
						open: true,
						projectId: id
					}, "push");
				},
				subscribe: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				}
			};
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-deepresearch/src/client/sidebar-entry.module.css.mjs
		const css$2 = "._09BIJW_layer{flex:none;align-items:center;width:100%;height:42px;margin:8px 0 0;display:flex;position:relative}._09BIJW_badge{width:calc(100% + 4px);height:42px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;align-items:center;gap:8px;margin:0 -2px;padding:0 10px 0 8px;font-family:inherit;font-size:14px;display:inline-flex;overflow:hidden}._09BIJW_badge:hover,._09BIJW_badge[data-active]{background:var(--dsw-alias-interactive-bg-hover)}._09BIJW_badgeLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}._09BIJW_layer._09BIJW_rail{width:36px;height:36px;margin:0}._09BIJW_rail ._09BIJW_badge{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;padding:0}";
		const tagId$2 = "@deepseek-ai/dsh-deepresearch/sidebar-entry.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-deepresearch";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var sidebar_entry_module_css_default = {
			"badge": "_09BIJW_badge",
			"badgeLabel": "_09BIJW_badgeLabel",
			"layer": "_09BIJW_layer",
			"rail": "_09BIJW_rail"
		};
		//#endregion
		//#region lib/types/client/DeepResearchSidebarEntry.js
		/** Sidebar foot control that opens the global Deep Research workspace. */
		/** Render the sidebar launch button for the frame-wide research overlay. */
		function DeepResearchSidebarEntry({ wide, t, ...face }) {
			const open = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getOpen);
			return (0, react_jsx_runtime.jsx)("div", {
				className: wide ? sidebar_entry_module_css_default.layer : `${sidebar_entry_module_css_default.layer} ${sidebar_entry_module_css_default.rail}`,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: sidebar_entry_module_css_default.badge,
					"data-active": open || void 0,
					"aria-pressed": open,
					"aria-label": t("view.deepResearch"),
					onClick: () => {
						face.store.setOpen(!open);
					},
					children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleMedium, { size: 16 }), wide ? (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_entry_module_css_default.badgeLabel,
						children: t("view.deepResearch")
					}) : null]
				})
			});
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
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-deepresearch/src/client/views.module.css.mjs
		const css$1 = "._vQxFa_shell{box-sizing:border-box;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);flex:1;overflow:auto}._vQxFa_content,._vQxFa_workspace{width:min(1540px,100%);margin-inline:auto}._vQxFa_libraryTopBar{justify-content:flex-start;margin-bottom:8px;display:flex}._vQxFa_content{box-sizing:border-box;padding:24px clamp(18px,3vw,40px) 48px}._vQxFa_toolbar,._vQxFa_toolbarActions,._vQxFa_filters,._vQxFa_viewToggle,._vQxFa_libraryTitle,._vQxFa_workspaceHeader,._vQxFa_modalHeader,._vQxFa_modalHeading,._vQxFa_modalFooter,._vQxFa_modalFooter>div,._vQxFa_sectionHeader,._vQxFa_headerActions{align-items:center;display:flex}._vQxFa_toolbar{justify-content:space-between;gap:20px}._vQxFa_filters,._vQxFa_toolbarActions,._vQxFa_viewToggle,._vQxFa_headerActions,._vQxFa_modalFooter>div{gap:7px}._vQxFa_filters{min-width:0;overflow-x:auto}._vQxFa_primaryButton,._vQxFa_secondaryButton,._vQxFa_iconButton,._vQxFa_modalCloseButton,._vQxFa_modalCancelButton,._vQxFa_modalSubmitButton,._vQxFa_backButton,._vQxFa_deleteButton,._vQxFa_deleteText,._vQxFa_stopButton,._vQxFa_chip,._vQxFa_activeChip,._vQxFa_createCard,._vQxFa_contextCard>button,._vQxFa_stepper button{color:inherit;font:inherit;cursor:pointer;border:0}._vQxFa_primaryButton{background:var(--dsw-alias-label-primary);min-height:36px;color:var(--dsw-alias-bg-base);box-shadow:0 4px 14px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent);border-radius:999px;align-items:center;gap:6px;padding:0 14px;font-size:12px;font-weight:600;transition:opacity .16s,transform .16s,box-shadow .16s;display:inline-flex}._vQxFa_backButton,._vQxFa_confirmed,._vQxFa_evidenceCard a{align-items:center;gap:6px;display:inline-flex}._vQxFa_primaryButton:hover{opacity:.86}._vQxFa_primaryButton:active{transform:scale(.98)}._vQxFa_primaryButton:disabled,._vQxFa_secondaryButton:disabled,._vQxFa_iconButton:disabled,._vQxFa_modalCloseButton:disabled,._vQxFa_modalCancelButton:disabled,._vQxFa_modalSubmitButton:disabled,._vQxFa_stopButton:disabled{cursor:default;opacity:.4;pointer-events:none}._vQxFa_secondaryButton,._vQxFa_backButton{background:var(--dsw-alias-interactive-bg-hover-solid);min-height:36px;color:var(--dsw-alias-label-secondary);border-radius:999px;padding:0 13px;font-size:12px}._vQxFa_chip,._vQxFa_activeChip{min-height:34px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:999px;flex:none;padding:0 14px;font-size:12px}._vQxFa_chip:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}._vQxFa_activeChip{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent);color:var(--dsw-alias-label-primary)}._vQxFa_search,._vQxFa_select,._vQxFa_input,._vQxFa_questionInput,._vQxFa_textareaSmall,._vQxFa_planEditorLarge,._vQxFa_reportEditor,._vQxFa_limitationsEditor,._vQxFa_planPane textarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;outline:none}._vQxFa_search,._vQxFa_select{border-radius:999px;height:38px}._vQxFa_search{width:min(230px,25vw);padding:0 14px}._vQxFa_select{color:var(--dsw-alias-label-secondary);padding:0 13px}._vQxFa_viewToggle{border:1px solid var(--dsw-alias-border-l1);border-radius:999px;gap:0;overflow:hidden}._vQxFa_iconButton{width:32px;height:32px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:50%;place-items:center;padding:0;transition:background-color .16s,color .16s,transform .16s;display:inline-grid}._vQxFa_viewToggle ._vQxFa_iconButton{border-radius:0;width:38px;height:38px}._vQxFa_viewToggle ._vQxFa_iconButton+._vQxFa_iconButton{border-left:1px solid var(--dsw-alias-border-l1)}._vQxFa_iconButton:hover,._vQxFa_iconButton[data-active=true]{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-state-business-primary)}._vQxFa_search:focus,._vQxFa_select:focus,._vQxFa_input:focus,._vQxFa_questionInput:focus,._vQxFa_textareaSmall:focus,._vQxFa_planEditorLarge:focus,._vQxFa_reportEditor:focus,._vQxFa_limitationsEditor:focus,._vQxFa_planPane textarea:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)}._vQxFa_library{margin-top:34px}._vQxFa_libraryTitle{justify-content:space-between}._vQxFa_libraryTitle h2{letter-spacing:-.025em;margin:0;font-size:24px;font-weight:600}._vQxFa_libraryTitle p{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:12px}._vQxFa_projectGrid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:22px;display:grid}._vQxFa_projectList{flex-direction:column;gap:10px;margin-top:22px;display:flex}._vQxFa_createCard{border:1px solid var(--dsw-alias-border-l1);min-height:208px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;display:flex}._vQxFa_createCard:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}._vQxFa_createCard span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:54px;height:54px;color:var(--dsw-alias-state-business-primary);border-radius:50%;place-items:center;margin-bottom:14px;font-size:24px;display:grid}._vQxFa_createCard strong{font-size:14px}._vQxFa_projectCard{--card-tint:#5b8def;isolation:isolate;box-sizing:border-box;border:1px solid color-mix(in srgb, var(--card-tint) 24%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--card-tint) 15%, var(--dsw-alias-bg-base));border-radius:16px;flex-direction:column;min-height:208px;padding:18px;transition:transform .18s,border-color .18s;display:flex;position:relative;overflow:hidden}._vQxFa_projectCard:hover{border-color:color-mix(in srgb, var(--card-tint) 50%, var(--dsw-alias-border-l1));transform:translateY(-2px)}._vQxFa_projectCard[data-list]{flex-direction:row;align-items:center;gap:14px;min-height:86px}._vQxFa_cardOpen{z-index:0;cursor:pointer;background:0 0;border:0;position:absolute;inset:0}._vQxFa_cardEmoji{z-index:1;background:color-mix(in srgb, var(--card-tint) 18%, transparent);pointer-events:none;border-radius:13px;flex:none;place-items:center;width:48px;height:48px;font-size:28px;display:grid}._vQxFa_cardInfo{z-index:1;pointer-events:none;min-width:0;margin-top:auto}._vQxFa_projectCard[data-list] ._vQxFa_cardInfo{flex:1;margin-top:0}._vQxFa_cardInfo h3{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;margin:12px 0 6px;font-size:16px;font-weight:600;overflow:hidden}._vQxFa_projectCard[data-list] ._vQxFa_cardInfo h3{margin-top:0}._vQxFa_cardInfo p{color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:1.5;display:-webkit-box;overflow:hidden}._vQxFa_cardInfo>div{color:var(--dsw-alias-label-caption);align-items:center;gap:7px;margin-top:12px;font-size:10px;display:flex}._vQxFa_phase,._vQxFa_confirmed{background:var(--dsw-specific-tip);width:fit-content;color:var(--dsw-alias-label-tertiary);border-radius:999px;align-items:center;padding:0 8px;font-size:10px;line-height:21px;display:inline-flex}._vQxFa_confirmed{color:var(--dsw-alias-state-success-primary)}._vQxFa_deleteButton{z-index:2;width:28px;height:28px;color:var(--dsw-alias-label-caption);background:0 0;border-radius:50%;position:absolute;top:10px;right:10px}._vQxFa_deleteButton:hover,._vQxFa_deleteText:hover{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary)}._vQxFa_emptyState{border:1px dashed var(--dsw-alias-border-l1);text-align:center;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;min-height:260px;margin-top:22px;padding:28px;display:flex}._vQxFa_emptyState>span{background:var(--dsw-specific-tip);width:48px;height:48px;color:var(--dsw-alias-label-caption);border-radius:14px;place-items:center;font-size:22px;display:grid}._vQxFa_emptyState strong{margin-top:14px;font-size:13px}._vQxFa_emptyState p{color:var(--dsw-alias-label-caption);margin:6px 0 16px;font-size:12px}._vQxFa_emptyText{color:var(--dsw-alias-label-caption);text-align:center;font-size:12px}._vQxFa_error,._vQxFa_modalError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary);border-radius:10px;padding:10px 12px;font-size:12px}._vQxFa_error{margin-top:16px}._vQxFa_modalBackdrop{z-index:100;box-sizing:border-box;backdrop-filter:blur(6px);background:#00000059;place-items:center;padding:8px;animation:.18s ease-out both _vQxFa_modal-backdrop-in;display:grid;position:fixed;inset:0}._vQxFa_modal{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);width:min(660px,100%);max-height:min(760px,100dvh - 16px);box-shadow:var(--dsw-shadow-lv3,0 24px 80px #00000047);transform-origin:50%;border-radius:20px;flex-direction:column;animation:.2s cubic-bezier(.2,.8,.2,1) both _vQxFa_modal-content-in;display:flex;overflow:hidden}._vQxFa_modalHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;padding:16px 20px}._vQxFa_modalHeading{gap:12px;min-width:0}._vQxFa_modalHeading>span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:36px;height:36px;color:var(--dsw-alias-state-business-primary);border-radius:11px;flex:none;place-items:center;display:grid}._vQxFa_modalHeading h3{letter-spacing:-.012em;margin:0;font-size:17px;font-weight:600;line-height:24px}._vQxFa_modalHeading p{color:var(--dsw-alias-label-caption);margin:2px 0 0;font-size:12px;line-height:20px}._vQxFa_modalCloseButton{background:color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);width:32px;height:32px;color:var(--dsw-alias-label-tertiary);border-radius:50%;flex:none;place-items:center;padding:0;transition:background-color .16s,color .16s,transform .16s,box-shadow .16s;display:inline-grid;box-shadow:0 1px 2px #0000000d}._vQxFa_modalCloseButton:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);color:var(--dsw-alias-label-primary);box-shadow:0 1px 3px #0000001a}._vQxFa_modalCloseButton:active{transform:scale(.95)}._vQxFa_modalBody{min-height:0;padding:20px;overflow-y:auto}._vQxFa_fieldLabel{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:8px;font-size:11px;display:flex}._vQxFa_fieldLabel>span{letter-spacing:.08em;text-transform:uppercase;justify-content:space-between;font-weight:650;display:flex}._vQxFa_fieldLabel b{color:var(--dsw-alias-label-caption);letter-spacing:normal;text-transform:none;font-weight:400}._vQxFa_questionInput,._vQxFa_textareaSmall,._vQxFa_planEditorLarge,._vQxFa_reportEditor,._vQxFa_limitationsEditor,._vQxFa_planPane textarea{resize:vertical;border-radius:12px;width:100%;padding:11px 13px;line-height:1.55}._vQxFa_questionInput{resize:none;border-radius:16px;min-height:124px;padding:13px 15px;font-size:15px;line-height:24px;transition:border-color .16s,box-shadow .16s,background-color .16s}._vQxFa_input{border-radius:10px;width:100%;height:38px;padding:0 11px}._vQxFa_textareaSmall{min-height:82px}._vQxFa_contextCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:16px;margin-top:16px;overflow:hidden}._vQxFa_contextCard>button{text-align:left;background:0 0;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:11px;width:100%;padding:12px 14px;display:grid}._vQxFa_contextCard>button:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}._vQxFa_contextCard>button>span:first-child{background:var(--dsw-alias-bg-base);width:28px;height:28px;color:var(--dsw-alias-label-tertiary);border-radius:9px;place-items:center;display:grid}._vQxFa_contextCard>button>span:nth-child(2){flex-direction:column;gap:3px;min-width:0;display:flex}._vQxFa_contextCard strong{font-size:12px}._vQxFa_contextCard small{color:var(--dsw-alias-label-caption);font-size:10px}._vQxFa_contextFields{border-top:1px solid var(--dsw-alias-border-l1);grid-template-columns:1fr 1fr;gap:14px;padding:14px;display:grid}._vQxFa_contextFields label{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:6px;font-size:11px;display:flex}._vQxFa_modalError{margin-top:14px}._vQxFa_modalFooter{border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-caption);flex:none;justify-content:space-between;gap:14px;padding:12px 20px;font-size:10px}._vQxFa_modalCancelButton,._vQxFa_modalSubmitButton{border-radius:999px;justify-content:center;align-items:center;gap:8px;height:36px;padding:0 16px;font-size:12px;transition:background-color .16s,color .16s,opacity .16s,transform .16s;display:inline-flex}._vQxFa_modalCancelButton{color:var(--dsw-alias-label-secondary);background:0 0;font-weight:500}._vQxFa_modalCancelButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}._vQxFa_modalSubmitButton{background:var(--dsw-alias-label-primary);min-width:112px;color:var(--dsw-alias-bg-base);font-weight:650;box-shadow:0 1px 2px #00000014}._vQxFa_modalSubmitButton:hover{opacity:.9}._vQxFa_modalSubmitButton:active{transform:scale(.98)}._vQxFa_modalDangerButton{background:var(--dsw-alias-state-error-primary);min-width:112px;color:var(--dsw-alias-bg-base);font-weight:650;box-shadow:0 1px 2px #00000014}._vQxFa_modalDangerButton:hover{opacity:.9}._vQxFa_modalDangerButton:active{transform:scale(.98)}._vQxFa_projectLoading{min-height:220px;color:var(--dsw-alias-label-caption);justify-content:center;align-items:center;gap:10px;font-size:12px;display:flex}._vQxFa_confirmBackdrop{z-index:110;backdrop-filter:blur(10px);background:#0c0a096b;place-items:center;padding:24px;animation:.16s ease-out both _vQxFa_modal-backdrop-in;display:grid;position:fixed;inset:0}._vQxFa_confirmCard{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 18%, var(--dsw-alias-border-l1));background:var(--dsw-alias-bg-base);border-radius:18px;gap:10px;width:min(380px,100%);padding:22px 22px 18px;animation:.2s cubic-bezier(.2,.8,.2,1) both _vQxFa_modal-content-in;display:grid;position:relative;overflow:hidden;box-shadow:0 18px 50px #00000038}._vQxFa_confirmCard:before{background:var(--dsw-alias-state-error-primary);content:\"\";width:3px;position:absolute;inset:0 auto 0 0}._vQxFa_confirmMark{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);border-radius:11px;place-items:center;width:36px;height:36px;display:grid}._vQxFa_confirmMark:after{border:1.5px solid var(--dsw-alias-state-error-primary);background:radial-gradient(circle at 50% 32%, var(--dsw-alias-state-error-primary) 1.3px, transparent 1.5px) no-repeat, linear-gradient(var(--dsw-alias-state-error-primary), var(--dsw-alias-state-error-primary)) 50% 72% / 1.5px 5px no-repeat;content:\"\";border-radius:50%;width:14px;height:14px}._vQxFa_confirmCard h3{letter-spacing:-.02em;margin:2px 0 0;font-size:16px;font-weight:620}._vQxFa_confirmCard p{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}._vQxFa_confirmActions{justify-content:flex-end;gap:8px;margin-top:8px;display:flex}._vQxFa_confirmCancel,._vQxFa_confirmDelete{border-radius:10px;justify-content:center;align-items:center;gap:6px;height:34px;padding:0 14px;font-size:12px;font-weight:600;display:inline-flex}._vQxFa_confirmCancel{color:var(--dsw-alias-label-secondary);background:0 0}._vQxFa_confirmCancel:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}._vQxFa_confirmDelete{background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-bg-base)}._vQxFa_confirmDelete:hover{opacity:.9}._vQxFa_confirmDelete:active{transform:scale(.98)}._vQxFa_confirmCancel:disabled,._vQxFa_confirmDelete:disabled{opacity:.55}@keyframes _vQxFa_modal-backdrop-in{0%{opacity:0}to{opacity:1}}@keyframes _vQxFa_modal-content-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}._vQxFa_workspace{box-sizing:border-box;background:var(--dsw-alias-bg-base);flex-direction:column;width:100%;height:100%;min-height:0;display:flex;overflow:hidden}._vQxFa_workspaceHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;align-items:center;gap:18px;padding:14px 24px}._vQxFa_projectHeading{text-align:center;flex:1;min-width:0}._vQxFa_workspaceHeader h2{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;margin:3px 0 0;font-size:17px;font-weight:620;overflow:hidden}._vQxFa_workspaceHeader p,._vQxFa_sectionHeader p{color:var(--dsw-alias-label-caption);margin:5px 0 0;font-size:11px}._vQxFa_eyebrow{color:var(--dsw-alias-state-business-primary);letter-spacing:.12em;margin:0;font-size:10px;font-weight:700}._vQxFa_backButton{background:0 0}._vQxFa_deleteText,._vQxFa_stopButton{color:var(--dsw-alias-state-error-primary);background:0 0;border-radius:9px;padding:8px 10px}._vQxFa_progressBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;padding:10px 24px}._vQxFa_stepper{background:var(--dsw-specific-tip);border-radius:12px;gap:4px;max-width:100%;padding:4px;display:inline-flex;overflow-x:auto}._vQxFa_stepper button{color:var(--dsw-alias-label-caption);background:0 0;border-radius:8px;padding:7px 12px;font-size:11px}._vQxFa_stepper button[data-active=true]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1)}._vQxFa_stepper button:disabled{cursor:default;opacity:.48}._vQxFa_detailBody{overscroll-behavior:contain;min-height:0;padding:24px clamp(18px,3vw,32px) 32px;overflow:hidden auto}._vQxFa_planPane,._vQxFa_reportPane{gap:18px;max-width:1120px;margin:0 auto;display:grid}._vQxFa_planningState{border:1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary) 15%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 4.5%, transparent);border-radius:16px;align-items:flex-start;gap:16px;min-height:180px;padding:28px 20px;display:flex}._vQxFa_planningIcon{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);width:44px;height:44px;color:var(--dsw-alias-state-business-primary);border-radius:12px;flex:none;place-items:center;display:grid}._vQxFa_planningState h3{margin:1px 0 6px;font-size:14px}._vQxFa_planningState p{color:var(--dsw-alias-label-caption);margin:0;font-size:11px;line-height:1.65}._vQxFa_planFailure{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 6%, transparent);border-radius:16px;gap:8px;padding:20px;display:grid}._vQxFa_planFailure h3,._vQxFa_planFailure p{margin:0}._vQxFa_planFailure h3{color:var(--dsw-alias-state-error-primary);font-size:14px}._vQxFa_planFailure p{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.6}._vQxFa_planFailure code{overflow-wrap:anywhere;color:var(--dsw-alias-label-caption);font:11px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace}._vQxFa_spinner{flex:none;animation:.8s linear infinite _vQxFa_research-spin}._vQxFa_runningBanner{color:var(--dsw-alias-label-secondary);align-items:center;gap:9px;font-size:11px;display:flex}._vQxFa_pausedBanner,._vQxFa_readyBanner,._vQxFa_incompleteBanner{border-bottom:1px solid var(--dsw-alias-border-l1);align-items:flex-start;gap:10px;padding-bottom:18px;display:flex}._vQxFa_bannerActions{flex-wrap:wrap;gap:8px;margin-left:auto;display:flex}._vQxFa_pausedBanner>:first-child{color:#c27a4a;margin-top:1px}._vQxFa_pausedBanner strong{font-size:12px;font-weight:620;display:block}._vQxFa_pausedBanner p{color:var(--dsw-alias-label-caption);margin:3px 0 0;font-size:10px;line-height:1.55}._vQxFa_planningState ._vQxFa_primaryButton{margin-top:14px}._vQxFa_readyBanner>:first-child{color:var(--dsw-alias-label-secondary);margin-top:1px}._vQxFa_incompleteBanner>:first-child{color:#b85c7a;margin-top:1px}._vQxFa_runningBanner ._vQxFa_stopButton{margin-left:auto}._vQxFa_readyBanner,._vQxFa_incompleteBanner{color:var(--dsw-alias-label-secondary);align-items:flex-start;gap:10px;padding-bottom:4px;display:flex}._vQxFa_readyBanner strong,._vQxFa_incompleteBanner strong{font-size:12px;font-weight:620;display:block}._vQxFa_readyBanner p,._vQxFa_incompleteBanner p{color:var(--dsw-alias-label-caption);margin:3px 0 0;font-size:10px;line-height:1.55}._vQxFa_readyBanner svg{color:var(--dsw-alias-label-secondary);flex:none;margin-top:1px}._vQxFa_incompleteBanner svg{color:#c27a4a;flex:none;margin-top:1px}@keyframes _vQxFa_research-spin{to{transform:rotate(360deg)}}._vQxFa_sectionHeader{justify-content:space-between;gap:16px}._vQxFa_sectionHeader h3{margin:0;font-size:15px}._vQxFa_headerActions ._vQxFa_primaryButton,._vQxFa_headerActions ._vQxFa_secondaryButton{border-radius:8px;height:36px}._vQxFa_headerActions ._vQxFa_secondaryButton{border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:0 0}._vQxFa_headerActions ._vQxFa_secondaryButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}._vQxFa_formGrid{grid-template-columns:1fr 1fr;gap:12px;display:grid}._vQxFa_formGrid label{color:var(--dsw-alias-label-secondary);gap:6px;font-size:11px;display:grid}._vQxFa_planEditorLarge{min-height:210px}._vQxFa_planEyebrow{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;margin:0 0 6px;font-size:10px;font-weight:650}._vQxFa_planQuestionTitle{letter-spacing:-.02em;max-width:780px;margin:0;font-size:18px;font-weight:620;line-height:1.5}._vQxFa_planDepth{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-tertiary);white-space:nowrap;border-radius:999px;flex:none;align-items:center;padding:0 10px;font-size:10px;line-height:22px;display:inline-flex}._vQxFa_goalBlock{gap:6px;display:grid}._vQxFa_goalBlock>span{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;font-size:10px;font-weight:650}._vQxFa_goalBlock textarea{min-height:72px}._vQxFa_criteriaList{color:var(--dsw-alias-label-tertiary);gap:6px;margin:0;padding-left:18px;font-size:11px;line-height:1.65;display:grid}._vQxFa_depBlock{gap:5px;display:grid}._vQxFa_depLabel{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;font-size:10px;font-weight:650}._vQxFa_depChips{flex-wrap:wrap;gap:6px;margin:0;display:flex}._vQxFa_questionCard ._vQxFa_depChips{margin:6px 0 0}._vQxFa_depChip{border:1px solid var(--dsw-alias-border-l1);max-width:100%;color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;border-radius:999px;padding:0 9px;font-size:10px;line-height:20px;overflow:hidden}._vQxFa_depHint{color:var(--dsw-alias-label-caption);font-size:10px}._vQxFa_planList{border-top:1px solid var(--dsw-alias-border-l1)}._vQxFa_planListLabel{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;padding:18px 0 6px;font-size:10px;font-weight:650;display:block}._vQxFa_planQuestion{border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:38px minmax(0,1fr);gap:10px;padding:18px 0;display:grid}._vQxFa_planQuestion>span{color:var(--dsw-alias-label-caption);font-variant-numeric:tabular-nums;padding-top:8px;font-size:11px}._vQxFa_planQuestion>div{gap:10px;display:grid}._vQxFa_planQuestion textarea{resize:vertical;width:100%;min-height:62px}._vQxFa_planQuestion label{color:var(--dsw-alias-label-caption);gap:6px;font-size:10px;display:grid}._vQxFa_planQuestion label textarea{min-height:76px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1.65}._vQxFa_planQuestion small{color:var(--dsw-alias-label-caption);font-size:10px}._vQxFa_investigatePane{gap:22px;width:100%;min-width:0;max-width:1152px;margin:0 auto;display:grid;overflow-x:hidden}._vQxFa_questionHeader{border-bottom:1px solid var(--dsw-alias-border-l1);min-width:0;padding-bottom:18px}._vQxFa_questionHeader>span{color:var(--dsw-alias-label-caption);text-transform:uppercase;letter-spacing:.08em;font-size:10px;font-weight:600}._vQxFa_questionHeader h3{letter-spacing:-.02em;overflow-wrap:anywhere;max-width:850px;margin:5px 0 0;font-size:18px;line-height:1.55}._vQxFa_questionHeader p{max-width:780px;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere;margin:7px 0 0;font-size:11px;line-height:1.65}._vQxFa_metrics{border-block:1px solid var(--dsw-alias-border-l1);grid-template-columns:repeat(3,minmax(0,1fr));display:grid}._vQxFa_metrics div{flex-direction:column-reverse;gap:3px;min-width:0;padding:12px 16px;display:flex}._vQxFa_metrics div+div{border-left:1px solid var(--dsw-alias-border-l1)}._vQxFa_metrics strong{font-variant-numeric:tabular-nums;font-size:15px}._vQxFa_metrics span{color:var(--dsw-alias-label-caption);text-overflow:ellipsis;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;font-size:9px;overflow:hidden}._vQxFa_boardGrid{border-top:1px solid var(--dsw-alias-border-l1);grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:28px;padding-top:6px;display:grid}._vQxFa_questions,._vQxFa_evidencePane,._vQxFa_scoutPane,._vQxFa_timeline{min-width:0}._vQxFa_timeline{gap:0;display:grid}._vQxFa_evidenceGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;display:grid}._vQxFa_boardHeading{color:var(--dsw-alias-label-secondary);margin:0 0 10px;font-size:12px;font-weight:620}._vQxFa_boardHeading span{color:var(--dsw-alias-label-caption);font-weight:500}._vQxFa_waitingLine,._vQxFa_gapLine{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:10px;line-height:1.55}._vQxFa_gapLine{color:#c27a4a}._vQxFa_scoutPane{max-height:min(720px,100dvh - 260px);padding-right:4px;position:sticky;top:0;overflow:auto}._vQxFa_scoutCard{border-bottom:1px solid var(--dsw-alias-border-l1);background:0 0;min-width:0;margin:0;overflow:hidden}._vQxFa_scoutCard[data-status=waiting]{opacity:.94}._vQxFa_scoutCard[data-live=true]{border-left:2px solid color-mix(in srgb, var(--dsw-alias-label-primary) 55%, transparent);margin-left:-12px;padding-left:10px}._vQxFa_scoutSummary{cursor:pointer;align-items:flex-start;gap:10px;min-width:0;padding:14px 2px;list-style:none;display:flex}._vQxFa_scoutSummary::-webkit-details-marker{display:none}._vQxFa_scoutIcon{width:20px;height:20px;color:var(--dsw-alias-label-caption);flex:none;place-items:center;margin-top:1px;display:grid}._vQxFa_scoutIcon[data-status=running]{color:var(--dsw-alias-label-primary)}._vQxFa_scoutIcon[data-status=waiting],._vQxFa_scoutIcon[data-status=partial]{color:#c27a4a}._vQxFa_scoutIcon[data-status=blocked]{color:#b85c7a}._vQxFa_scoutIcon[data-status=done]{color:var(--dsw-alias-label-secondary)}._vQxFa_scoutSummaryBody{flex:1;min-width:0}._vQxFa_scoutSummaryBody strong{text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:620;display:block;overflow:hidden}._vQxFa_scoutMetaRow{flex-wrap:wrap;gap:6px;min-width:0;margin-top:6px;display:flex}._vQxFa_scoutChip{background:var(--dsw-specific-tip);max-width:100%;color:var(--dsw-alias-label-caption);text-overflow:ellipsis;white-space:nowrap;border-radius:999px;padding:1px 8px;font-size:10px;line-height:18px;overflow:hidden}._vQxFa_scoutChip[data-kind=verify],._vQxFa_scoutChip[data-kind=criterion]{background:color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);color:var(--dsw-alias-label-secondary)}._vQxFa_scoutStatus{color:var(--dsw-alias-label-caption);flex:none;margin-top:4px;font-size:10px;font-weight:560}._vQxFa_scoutStatus[data-live=true]{color:var(--dsw-alias-label-primary)}._vQxFa_scoutSummary>svg{color:var(--dsw-alias-label-caption);flex:none;margin-top:3px;transition:transform .15s}._vQxFa_scoutCard[open] ._vQxFa_scoutSummary>svg{transform:rotate(180deg)}._vQxFa_scoutBody{border-top:1px solid var(--dsw-alias-border-l1);gap:10px;min-width:0;padding:0 4px 16px 32px;display:grid}._vQxFa_scoutEvidence{gap:0;display:grid}._vQxFa_scoutHead{justify-content:space-between;align-items:flex-start;gap:10px;display:flex}._vQxFa_scoutHead strong{font-size:12px;font-weight:620;line-height:1.45}._vQxFa_scoutHead span{color:var(--dsw-alias-label-caption);flex:none;font-size:10px}._vQxFa_scoutMeta{color:var(--dsw-alias-label-tertiary);margin:0;font-size:11px;line-height:1.5}._vQxFa_scoutActivity{background:color-mix(in srgb, var(--dsw-specific-tip) 70%, transparent);min-width:0;color:var(--dsw-alias-label-secondary);border-radius:10px;align-items:flex-start;gap:8px;margin:0;padding:8px 10px;font-size:11px;line-height:1.5;display:flex}._vQxFa_scoutActivity span{overflow-wrap:anywhere;min-width:0}._vQxFa_scoutActivity[data-live=true]{border:1px solid color-mix(in srgb, var(--dsw-alias-label-primary) 12%, var(--dsw-alias-border-l1))}._vQxFa_coverage{gap:2px;margin-top:2px;display:grid}._vQxFa_coverage h5{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;margin:6px 0 0;font-size:10px;font-weight:620}._vQxFa_coverageList{gap:0;margin:0;padding:0;list-style:none;display:grid}._vQxFa_coverageItem{border-top:1px solid var(--dsw-alias-border-l1);gap:3px;padding:8px 0;display:grid}._vQxFa_coverageItem[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);box-shadow:inset 2px 0 0 var(--dsw-alias-label-primary);border-radius:8px;margin-inline:-8px;padding-inline:8px}._vQxFa_coverageHead{grid-template-columns:minmax(0,1fr);align-items:start;gap:4px;display:grid}._vQxFa_coverageHead b{min-width:0;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere;font-size:11px;font-weight:560;line-height:1.45}._vQxFa_coverageHead span{min-width:0;color:var(--dsw-alias-label-caption);font-variant-numeric:tabular-nums;overflow-wrap:anywhere;font-size:10px}._vQxFa_coverageItem p,._vQxFa_coverageItem em{color:var(--dsw-alias-label-caption);margin:0;font-size:10px;font-style:normal;line-height:1.45}._vQxFa_coverageItem em[data-tone=warning],._vQxFa_coverageItem em[data-tone=gap]{color:#c27a4a}._vQxFa_coverageItem[data-status=covered] ._vQxFa_coverageHead span{color:var(--dsw-alias-label-secondary)}._vQxFa_coverageItem[data-status=partial] ._vQxFa_coverageHead span{color:#c27a4a}._vQxFa_coverageItem[data-status=blocked] ._vQxFa_coverageHead span,._vQxFa_coverageItem[data-status=conflicted] ._vQxFa_coverageHead span{color:#b85c7a}._vQxFa_coverageItem[data-active=true] ._vQxFa_coverageHead span{color:var(--dsw-alias-label-primary)}._vQxFa_toolList{gap:6px;min-width:0;margin:4px 0 0;padding:0;list-style:none;display:grid}._vQxFa_toolList li{background:color-mix(in srgb, var(--dsw-specific-tip) 55%, transparent);min-width:0;color:var(--dsw-alias-label-tertiary);border-radius:8px;grid-template-columns:auto minmax(0,1fr);align-items:start;gap:8px;padding:6px 8px;font-size:11px;line-height:1.45;display:grid}._vQxFa_toolList li[data-status=running]{border:1px solid color-mix(in srgb, var(--dsw-alias-label-primary) 14%, var(--dsw-alias-border-l1))}._vQxFa_toolList b{color:var(--dsw-alias-label-secondary);letter-spacing:.02em;font-size:10px;font-weight:620}._vQxFa_toolList span{overflow-wrap:anywhere;min-width:0}._vQxFa_handoff{min-width:0;color:var(--dsw-alias-label-caption);margin-top:6px;font-size:10px}._vQxFa_handoff summary{cursor:pointer}._vQxFa_handoff pre{overflow-wrap:anywhere;white-space:pre-wrap;max-height:180px;font:inherit;margin:6px 0 0;overflow:auto}._vQxFa_questionCard{border-top:1px solid var(--dsw-alias-border-l1);min-width:0;padding:10px 0}._vQxFa_questionCard[data-live=true]{border-left:2px solid color-mix(in srgb, var(--dsw-alias-label-primary) 55%, transparent);margin-left:-12px;padding-left:10px}._vQxFa_questionCard:last-child{border-bottom:1px solid var(--dsw-alias-border-l1)}._vQxFa_questionTitle{grid-template-columns:24px minmax(0,1fr) auto;align-items:start;gap:10px;min-width:0;display:grid}._vQxFa_questionTitle>span{color:var(--dsw-alias-label-caption);font-variant-numeric:tabular-nums;font-size:10px}._vQxFa_questionTitle h4{overflow-wrap:anywhere;margin:0;font-size:11px;font-weight:500;line-height:1.5}._vQxFa_questionTitle strong{width:fit-content;max-width:100%;color:var(--dsw-alias-label-caption);font-size:10px;font-weight:500;display:block}._vQxFa_questionTitle strong[data-status=running]{color:var(--dsw-alias-label-primary)}._vQxFa_questionTitle strong[data-status=covered]{color:var(--dsw-alias-label-secondary)}._vQxFa_questionTitle strong[data-status=waiting],._vQxFa_questionTitle strong[data-status=partial]{color:#c27a4a}._vQxFa_questionTitle strong[data-status=blocked],._vQxFa_questionTitle strong[data-status=failed]{color:#b85c7a}._vQxFa_questionLimits{flex-wrap:wrap;gap:6px;margin:8px 0 0 40px;display:flex}._vQxFa_questionLimits span{background:var(--dsw-specific-tip);max-width:100%;color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;border-radius:999px;padding:3px 8px;font-size:10px;overflow:hidden}._vQxFa_questionLimits span[data-status=partial]{color:#c27a4a;background:#c27a4a29}._vQxFa_questionLimits span[data-status=blocked],._vQxFa_questionLimits span[data-status=conflicted]{color:#b85c7a;background:#b85c7a29}._vQxFa_questionCard>p{color:var(--dsw-alias-label-caption);margin:7px 0 0 40px;font-size:10px}._vQxFa_questionCard ul{gap:7px;margin:12px 0 0 40px;padding:0;list-style:none;display:grid}._vQxFa_questionCard li{color:var(--dsw-alias-label-tertiary);grid-template-columns:16px minmax(0,1fr);gap:7px;font-size:11px;line-height:1.55;display:grid}._vQxFa_questionCard li>span{color:var(--dsw-alias-label-caption)}._vQxFa_questionCard li b{color:var(--dsw-alias-label-secondary);font-weight:500}._vQxFa_questionCard li p,._vQxFa_questionCard li em{margin:3px 0 0;font-size:10px;font-style:normal;display:block}._vQxFa_evidencePane{min-width:0;padding-top:6px}._vQxFa_evidencePane>h3{margin:0 0 10px;font-size:13px}._vQxFa_evidencePane>h3 span{color:var(--dsw-alias-label-caption);font-weight:500}._vQxFa_evidenceEmpty{border:1px dashed var(--dsw-alias-border-l1);text-align:center;border-radius:14px;align-content:center;place-items:center;min-height:154px;padding:18px;display:grid}._vQxFa_evidenceEmpty>span{background:var(--dsw-specific-tip);width:34px;height:34px;color:var(--dsw-alias-label-caption);border-radius:10px;place-items:center;display:grid}._vQxFa_evidenceEmpty p{max-width:300px;color:var(--dsw-alias-label-caption);margin:9px 0 0;font-size:11px;line-height:1.6}._vQxFa_evidenceCard{border-top:1px solid var(--dsw-alias-border-l1);flex-direction:column;min-width:0;padding:13px 0;display:flex}._vQxFa_evidenceCard>div{align-items:center;gap:8px;min-width:0;display:flex}._vQxFa_evidenceCard>div span{color:var(--dsw-alias-label-caption);text-overflow:ellipsis;white-space:nowrap;font-size:10px;overflow:hidden}._vQxFa_evidenceCard>div span[data-confidence]{flex:none;font-weight:600}._vQxFa_evidenceCard p{color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:4;overflow-wrap:anywhere;-webkit-box-orient:vertical;margin:6px 0 0;font-size:11px;line-height:1.6;display:-webkit-box;overflow:hidden}._vQxFa_evidenceCard a{max-width:100%;color:var(--dsw-alias-label-secondary);align-items:center;gap:6px;margin-top:8px;font-size:10px;text-decoration:none;display:inline-flex;overflow:hidden}._vQxFa_evidenceCard a span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}._vQxFa_evidenceCard a:hover{text-decoration:underline}._vQxFa_reportDocument{max-width:860px;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}._vQxFa_reportPending{min-height:160px;color:var(--dsw-alias-label-caption);align-items:center;gap:10px;font-size:12px;display:flex}._vQxFa_reportLimitations{border-top:1px solid var(--dsw-alias-border-l1);padding-top:18px}._vQxFa_reportLimitations h4{margin:0 0 8px;font-size:12px}._vQxFa_reportLimitations ul{color:var(--dsw-alias-label-tertiary);gap:6px;margin:0;padding-left:18px;font-size:11px;line-height:1.6;display:grid}._vQxFa_limitationsBoard{min-width:0}._vQxFa_investigatePane>._vQxFa_limitationsBoard{border-top:1px solid var(--dsw-alias-border-l1);padding-top:22px}._vQxFa_limitationsBoard h4{color:var(--dsw-alias-label-secondary);align-items:baseline;gap:8px;margin:0 0 10px;font-size:12px;font-weight:620;display:flex}._vQxFa_limitationsBoard h4 span{color:var(--dsw-alias-label-caption);font-weight:500}._vQxFa_limitationsEmpty{color:var(--dsw-alias-label-caption);margin:0;font-size:11px;line-height:1.55}._vQxFa_limitationList{gap:0;margin:0;padding:0;list-style:none;display:grid}._vQxFa_limitationItem{border-top:1px solid var(--dsw-alias-border-l1);gap:4px;padding:10px 0;display:grid}._vQxFa_limitationHead{flex-wrap:wrap;align-items:center;gap:8px;display:flex}._vQxFa_limitationHead span,._vQxFa_limitationHead b{color:var(--dsw-alias-label-caption);font-size:10px;font-weight:560;line-height:1.45}._vQxFa_limitationItem p{color:#8a5a32;overflow-wrap:anywhere;margin:0;font-size:12px;line-height:1.55}@media (width<=900px){._vQxFa_toolbar{flex-direction:column;align-items:flex-start}._vQxFa_toolbarActions{flex-wrap:wrap;width:100%}._vQxFa_search{flex:1;width:auto}._vQxFa_boardGrid,._vQxFa_formGrid{grid-template-columns:1fr}._vQxFa_evidencePane,._vQxFa_scoutPane{max-height:none;position:static}._vQxFa_metrics{grid-template-columns:1fr}._vQxFa_metrics div+div{border-top:1px solid var(--dsw-alias-border-l1);border-left:0}._vQxFa_evidenceGrid{grid-template-columns:1fr}}@media (width<=620px){._vQxFa_content{padding:16px 12px 36px}._vQxFa_toolbarActions{align-items:stretch}._vQxFa_search{flex-basis:100%;width:100%}._vQxFa_select{flex:1}._vQxFa_projectGrid,._vQxFa_contextFields{grid-template-columns:1fr}._vQxFa_modalHeader,._vQxFa_modalBody,._vQxFa_modalFooter{padding-inline:16px}._vQxFa_modalFooter{flex-direction:column;align-items:stretch}._vQxFa_modalFooter>div{justify-content:flex-end}._vQxFa_detailBody,._vQxFa_workspaceHeader,._vQxFa_progressBar{padding-inline:14px}._vQxFa_projectHeading{text-align:left}._vQxFa_workspaceHeader ._vQxFa_phase{display:none}}@media (prefers-reduced-motion:reduce){._vQxFa_projectCard{transition:none}._vQxFa_spinner,._vQxFa_modalBackdrop,._vQxFa_modal{animation:none}}";
		const tagId$1 = "@deepseek-ai/dsh-deepresearch/views.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-deepresearch";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var views_module_css_default = {
			"activeChip": "_vQxFa_activeChip",
			"backButton": "_vQxFa_backButton",
			"bannerActions": "_vQxFa_bannerActions",
			"boardGrid": "_vQxFa_boardGrid",
			"boardHeading": "_vQxFa_boardHeading",
			"cardEmoji": "_vQxFa_cardEmoji",
			"cardInfo": "_vQxFa_cardInfo",
			"cardOpen": "_vQxFa_cardOpen",
			"chip": "_vQxFa_chip",
			"confirmActions": "_vQxFa_confirmActions",
			"confirmBackdrop": "_vQxFa_confirmBackdrop",
			"confirmCancel": "_vQxFa_confirmCancel",
			"confirmCard": "_vQxFa_confirmCard",
			"confirmDelete": "_vQxFa_confirmDelete",
			"confirmMark": "_vQxFa_confirmMark",
			"confirmed": "_vQxFa_confirmed",
			"content": "_vQxFa_content",
			"contextCard": "_vQxFa_contextCard",
			"contextFields": "_vQxFa_contextFields",
			"coverage": "_vQxFa_coverage",
			"coverageHead": "_vQxFa_coverageHead",
			"coverageItem": "_vQxFa_coverageItem",
			"coverageList": "_vQxFa_coverageList",
			"createCard": "_vQxFa_createCard",
			"criteriaList": "_vQxFa_criteriaList",
			"deleteButton": "_vQxFa_deleteButton",
			"deleteText": "_vQxFa_deleteText",
			"depBlock": "_vQxFa_depBlock",
			"depChip": "_vQxFa_depChip",
			"depChips": "_vQxFa_depChips",
			"depHint": "_vQxFa_depHint",
			"depLabel": "_vQxFa_depLabel",
			"detailBody": "_vQxFa_detailBody",
			"emptyState": "_vQxFa_emptyState",
			"emptyText": "_vQxFa_emptyText",
			"error": "_vQxFa_error",
			"evidenceCard": "_vQxFa_evidenceCard",
			"evidenceEmpty": "_vQxFa_evidenceEmpty",
			"evidenceGrid": "_vQxFa_evidenceGrid",
			"evidencePane": "_vQxFa_evidencePane",
			"eyebrow": "_vQxFa_eyebrow",
			"fieldLabel": "_vQxFa_fieldLabel",
			"filters": "_vQxFa_filters",
			"formGrid": "_vQxFa_formGrid",
			"gapLine": "_vQxFa_gapLine",
			"goalBlock": "_vQxFa_goalBlock",
			"handoff": "_vQxFa_handoff",
			"headerActions": "_vQxFa_headerActions",
			"iconButton": "_vQxFa_iconButton",
			"incompleteBanner": "_vQxFa_incompleteBanner",
			"input": "_vQxFa_input",
			"investigatePane": "_vQxFa_investigatePane",
			"library": "_vQxFa_library",
			"libraryTitle": "_vQxFa_libraryTitle",
			"libraryTopBar": "_vQxFa_libraryTopBar",
			"limitationHead": "_vQxFa_limitationHead",
			"limitationItem": "_vQxFa_limitationItem",
			"limitationList": "_vQxFa_limitationList",
			"limitationsBoard": "_vQxFa_limitationsBoard",
			"limitationsEditor": "_vQxFa_limitationsEditor",
			"limitationsEmpty": "_vQxFa_limitationsEmpty",
			"metrics": "_vQxFa_metrics",
			"modal": "_vQxFa_modal",
			"modal-backdrop-in": "_vQxFa_modal-backdrop-in",
			"modal-content-in": "_vQxFa_modal-content-in",
			"modalBackdrop": "_vQxFa_modalBackdrop",
			"modalBody": "_vQxFa_modalBody",
			"modalCancelButton": "_vQxFa_modalCancelButton",
			"modalCloseButton": "_vQxFa_modalCloseButton",
			"modalDangerButton": "_vQxFa_modalDangerButton",
			"modalError": "_vQxFa_modalError",
			"modalFooter": "_vQxFa_modalFooter",
			"modalHeader": "_vQxFa_modalHeader",
			"modalHeading": "_vQxFa_modalHeading",
			"modalSubmitButton": "_vQxFa_modalSubmitButton",
			"pausedBanner": "_vQxFa_pausedBanner",
			"phase": "_vQxFa_phase",
			"planDepth": "_vQxFa_planDepth",
			"planEditorLarge": "_vQxFa_planEditorLarge",
			"planEyebrow": "_vQxFa_planEyebrow",
			"planFailure": "_vQxFa_planFailure",
			"planList": "_vQxFa_planList",
			"planListLabel": "_vQxFa_planListLabel",
			"planPane": "_vQxFa_planPane",
			"planQuestion": "_vQxFa_planQuestion",
			"planQuestionTitle": "_vQxFa_planQuestionTitle",
			"planningIcon": "_vQxFa_planningIcon",
			"planningState": "_vQxFa_planningState",
			"primaryButton": "_vQxFa_primaryButton",
			"progressBar": "_vQxFa_progressBar",
			"projectCard": "_vQxFa_projectCard",
			"projectGrid": "_vQxFa_projectGrid",
			"projectHeading": "_vQxFa_projectHeading",
			"projectList": "_vQxFa_projectList",
			"projectLoading": "_vQxFa_projectLoading",
			"questionCard": "_vQxFa_questionCard",
			"questionHeader": "_vQxFa_questionHeader",
			"questionInput": "_vQxFa_questionInput",
			"questionLimits": "_vQxFa_questionLimits",
			"questionTitle": "_vQxFa_questionTitle",
			"questions": "_vQxFa_questions",
			"readyBanner": "_vQxFa_readyBanner",
			"reportDocument": "_vQxFa_reportDocument",
			"reportEditor": "_vQxFa_reportEditor",
			"reportLimitations": "_vQxFa_reportLimitations",
			"reportPane": "_vQxFa_reportPane",
			"reportPending": "_vQxFa_reportPending",
			"research-spin": "_vQxFa_research-spin",
			"runningBanner": "_vQxFa_runningBanner",
			"scoutActivity": "_vQxFa_scoutActivity",
			"scoutBody": "_vQxFa_scoutBody",
			"scoutCard": "_vQxFa_scoutCard",
			"scoutChip": "_vQxFa_scoutChip",
			"scoutEvidence": "_vQxFa_scoutEvidence",
			"scoutHead": "_vQxFa_scoutHead",
			"scoutIcon": "_vQxFa_scoutIcon",
			"scoutMeta": "_vQxFa_scoutMeta",
			"scoutMetaRow": "_vQxFa_scoutMetaRow",
			"scoutPane": "_vQxFa_scoutPane",
			"scoutStatus": "_vQxFa_scoutStatus",
			"scoutSummary": "_vQxFa_scoutSummary",
			"scoutSummaryBody": "_vQxFa_scoutSummaryBody",
			"search": "_vQxFa_search",
			"secondaryButton": "_vQxFa_secondaryButton",
			"sectionHeader": "_vQxFa_sectionHeader",
			"select": "_vQxFa_select",
			"shell": "_vQxFa_shell",
			"spinner": "_vQxFa_spinner",
			"stepper": "_vQxFa_stepper",
			"stopButton": "_vQxFa_stopButton",
			"textareaSmall": "_vQxFa_textareaSmall",
			"timeline": "_vQxFa_timeline",
			"toolList": "_vQxFa_toolList",
			"toolbar": "_vQxFa_toolbar",
			"toolbarActions": "_vQxFa_toolbarActions",
			"viewToggle": "_vQxFa_viewToggle",
			"waitingLine": "_vQxFa_waitingLine",
			"workspace": "_vQxFa_workspace",
			"workspaceHeader": "_vQxFa_workspaceHeader"
		};
		//#endregion
		//#region lib/types/client/ResearchView.js
		/** Codemini-aligned Deep Research library, plan review, and live investigation workspace. */
		function markdownLabels(t) {
			return {
				code: {
					copyLabel: t("markdown.copy"),
					copiedLabel: t("markdown.copied"),
					toolbarLabels: {
						codeLabel: t("markdown.code"),
						wrapLabel: t("markdown.wrap"),
						unwrapLabel: t("markdown.unwrap")
					}
				},
				footnotes: t("markdown.footnotes")
			};
		}
		/** Render the research library, reviewable plan, live investigation board, and report. */
		function ResearchView({ t, projectId, onSelectProject, onClose, ...api }) {
			const [projects, setProjects] = (0, react.useState)([]);
			const [selected, setSelected] = (0, react.useState)(null);
			const [query, setQuery] = (0, react.useState)("");
			const [filter, setFilter] = (0, react.useState)("all");
			const [viewMode, setViewMode] = (0, react.useState)("grid");
			const [sort, setSort] = (0, react.useState)("recent");
			const [composerOpen, setComposerOpen] = (0, react.useState)(false);
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const [pendingDelete, setPendingDelete] = (0, react.useState)(null);
			const [deleteBusy, setDeleteBusy] = (0, react.useState)(false);
			const [projectLoading, setProjectLoading] = (0, react.useState)(false);
			const openProject = (0, react.useCallback)((project) => {
				setSelected(project === null ? null : hydrateResearchProject(project));
				onSelectProject?.(project?.id ?? null);
			}, [onSelectProject]);
			const apiRef = (0, react.useRef)(api);
			apiRef.current = api;
			const refresh = (0, react.useCallback)(async (nextQuery) => {
				setError(null);
				try {
					const next = (await apiRef.current.list(nextQuery)).map(hydrateResearchProject);
					setProjects(next);
					setSelected((current) => {
						if (current === null) return null;
						const listed = next.find((item) => item.id === current.id);
						return listed !== void 0 && listed.updatedAt > current.updatedAt ? listed : current;
					});
				} catch (cause) {
					setError(messageOf(cause));
				}
			}, []);
			(0, react.useEffect)(() => {
				if (selected !== null) return;
				const timer = window.setTimeout(() => {
					refresh(query);
				}, query === "" ? 0 : 250);
				return () => {
					window.clearTimeout(timer);
				};
			}, [
				query,
				refresh,
				selected
			]);
			(0, react.useEffect)(() => {
				if (projectId === void 0) return;
				if (projectId === null) {
					setSelected(null);
					setProjectLoading(false);
					return;
				}
				const listed = projects.find((item) => item.id === projectId);
				if (listed !== void 0) {
					setSelected((current) => current?.id === listed.id && current.updatedAt >= listed.updatedAt ? current : hydrateResearchProject(listed));
					setProjectLoading(false);
					return;
				}
				let active = true;
				setProjectLoading(true);
				apiRef.current.get(ResearchId(projectId)).then((project) => {
					if (!active) return;
					if (project === null) {
						setSelected(null);
						setError(t("empty.noMatch"));
					} else setSelected(hydrateResearchProject(project));
					setProjectLoading(false);
				}, (cause) => {
					if (active) {
						setError(messageOf(cause));
						setProjectLoading(false);
					}
				});
				return () => {
					active = false;
				};
			}, [
				projectId,
				projects,
				t
			]);
			const requestDelete = (0, react.useCallback)((target) => {
				setError(null);
				setPendingDelete(target);
			}, []);
			const confirmDelete = (0, react.useCallback)(async () => {
				if (pendingDelete === null || deleteBusy) return;
				setDeleteBusy(true);
				setError(null);
				try {
					await api.delete(pendingDelete.id);
					if (selected?.id === pendingDelete.id) openProject(null);
					setPendingDelete(null);
					await refresh(query);
				} catch (cause) {
					setError(messageOf(cause));
				} finally {
					setDeleteBusy(false);
				}
			}, [
				api,
				deleteBusy,
				openProject,
				pendingDelete,
				query,
				refresh,
				selected?.id
			]);
			const visible = (0, react.useMemo)(() => {
				const phaseMatch = (phase) => filter === "all" || filter === "planning" && ["planning", "awaiting_plan_confirm"].includes(phase) || filter === "investigating" && [
					"investigating",
					"ready_for_report",
					"writing"
				].includes(phase) || filter === "done" && ["done", "incomplete"].includes(phase);
				const filtered = projects.filter((project) => phaseMatch(project.phase));
				return sort === "title" ? filtered.toSorted((left, right) => left.title.localeCompare(right.title)) : filtered.toSorted((left, right) => right.updatedAt - left.updatedAt);
			}, [
				filter,
				projects,
				sort
			]);
			const updateSelected = (0, react.useCallback)((project) => {
				const next = hydrateResearchProject(project);
				setSelected((current) => current?.id === next.id && current.updatedAt === next.updatedAt ? current : next);
				setProjects((current) => current.map((item) => item.id === next.id ? next : item));
			}, []);
			if (projectId !== void 0 && projectId !== null && selected === null && projectLoading) return (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.shell,
				children: (0, react_jsx_runtime.jsx)("div", {
					className: views_module_css_default.content,
					children: (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.projectLoading,
						role: "status",
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
							className: views_module_css_default.spinner,
							size: 16
						}), (0, react_jsx_runtime.jsx)("span", { children: t("phase.planning") })]
					})
				})
			});
			if (selected !== null) return (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.shell,
				children: [(0, react_jsx_runtime.jsx)(ResearchWorkspace, {
					project: selected,
					api,
					t,
					onChange: updateSelected,
					onBack: () => {
						openProject(null);
					},
					onDelete: () => {
						requestDelete({
							id: selected.id,
							title: selected.title
						});
					},
					error,
					setError
				}), pendingDelete === null ? null : (0, react_jsx_runtime.jsx)(DeleteConfirmDialog, {
					pending: pendingDelete,
					busy: deleteBusy,
					t,
					onCancel: () => {
						if (!deleteBusy) setPendingDelete(null);
					},
					onConfirm: () => {
						confirmDelete();
					}
				})]
			});
			return (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.shell,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.content,
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								"data-deepresearch-view": "",
								hidden: true
							}),
							onClose === void 0 ? null : (0, react_jsx_runtime.jsx)("div", {
								className: views_module_css_default.libraryTopBar,
								children: (0, react_jsx_runtime.jsxs)("button", {
									className: views_module_css_default.backButton,
									type: "button",
									"aria-label": t("library.backAria"),
									onClick: onClose,
									children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineMedium, { size: 15 }), t("library.back")]
								})
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.toolbar,
								children: [(0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.filters,
									"aria-label": t("library.filterAria"),
									children: [
										["all", "filter.all"],
										["planning", "filter.planning"],
										["investigating", "filter.investigating"],
										["done", "filter.done"]
									].map(([id, key]) => (0, react_jsx_runtime.jsx)("button", {
										className: filter === id ? views_module_css_default.activeChip : views_module_css_default.chip,
										type: "button",
										"aria-current": filter === id ? "page" : void 0,
										onClick: () => {
											setFilter(id);
										},
										children: t(key)
									}, id))
								}), (0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.toolbarActions,
									children: [
										(0, react_jsx_runtime.jsx)("input", {
											className: views_module_css_default.search,
											value: query,
											onChange: (event) => {
												setQuery(event.target.value);
											},
											placeholder: t("toolbar.search"),
											"aria-label": t("toolbar.searchAria")
										}),
										(0, react_jsx_runtime.jsxs)("select", {
											className: views_module_css_default.select,
											value: sort,
											onChange: (event) => {
												setSort(event.target.value);
											},
											"aria-label": t("toolbar.sortAria"),
											children: [(0, react_jsx_runtime.jsx)("option", {
												value: "recent",
												children: t("toolbar.sortRecent")
											}), (0, react_jsx_runtime.jsx)("option", {
												value: "title",
												children: t("toolbar.sortTitle")
											})]
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: views_module_css_default.viewToggle,
											children: [(0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.iconButton,
												type: "button",
												"aria-label": t("toolbar.gridView"),
												"aria-pressed": viewMode === "grid",
												"data-active": viewMode === "grid",
												onClick: () => {
													setViewMode("grid");
												},
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDataOutlineMedium, { size: 16 })
											}), (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.iconButton,
												type: "button",
												"aria-label": t("toolbar.listView"),
												"aria-pressed": viewMode === "list",
												"data-active": viewMode === "list",
												onClick: () => {
													setViewMode("list");
												},
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutlineMedium, { size: 16 })
											})]
										}),
										(0, react_jsx_runtime.jsxs)("button", {
											className: views_module_css_default.primaryButton,
											type: "button",
											onClick: () => {
												setError(null);
												setComposerOpen(true);
											},
											children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 15 }), t("action.start")]
										})
									]
								})]
							}),
							(0, react_jsx_runtime.jsxs)("section", {
								className: views_module_css_default.library,
								children: [
									(0, react_jsx_runtime.jsx)("header", {
										className: views_module_css_default.libraryTitle,
										children: (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: t("library.title") }), (0, react_jsx_runtime.jsx)("p", { children: t("library.projectCount", { count: visible.length }) })] })
									}),
									error === null || composerOpen ? null : (0, react_jsx_runtime.jsx)("div", {
										className: views_module_css_default.error,
										role: "alert",
										children: error
									}),
									visible.length === 0 ? (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.emptyState,
										children: [
											(0, react_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleMedium, { size: 22 })
											}),
											(0, react_jsx_runtime.jsx)("strong", { children: query === "" ? t("empty.none") : t("empty.noMatch") }),
											(0, react_jsx_runtime.jsx)("p", { children: query === "" ? t("empty.hintStart") : t("empty.hintNoMatch") }),
											query === "" ? (0, react_jsx_runtime.jsxs)("button", {
												className: views_module_css_default.primaryButton,
												type: "button",
												onClick: () => {
													setComposerOpen(true);
												},
												children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 15 }), t("action.start")]
											}) : null
										]
									}) : (0, react_jsx_runtime.jsxs)("div", {
										className: viewMode === "grid" ? views_module_css_default.projectGrid : views_module_css_default.projectList,
										children: [viewMode === "grid" ? (0, react_jsx_runtime.jsxs)("button", {
											className: views_module_css_default.createCard,
											type: "button",
											onClick: () => {
												setComposerOpen(true);
											},
											children: [(0, react_jsx_runtime.jsx)("span", { children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutlineMedium, { size: 22 }) }), (0, react_jsx_runtime.jsx)("strong", { children: t("action.startShort") })]
										}) : null, visible.map((project, index) => (0, react_jsx_runtime.jsx)(ProjectCard, {
											project,
											index,
											list: viewMode === "list",
											t,
											onOpen: () => {
												openProject(project);
											},
											onDelete: () => {
												requestDelete({
													id: project.id,
													title: project.title
												});
											}
										}, project.id))]
									})
								]
							})
						]
					}),
					composerOpen ? (0, react_jsx_runtime.jsx)(ResearchComposer, {
						busy,
						error,
						setBusy,
						t,
						onClose: () => {
							if (!busy) setComposerOpen(false);
						},
						onCreate: async (request) => {
							const project = await api.start(request);
							setComposerOpen(false);
							await refresh(query);
							openProject(project);
						},
						setError
					}) : null,
					pendingDelete === null ? null : (0, react_jsx_runtime.jsx)(DeleteConfirmDialog, {
						pending: pendingDelete,
						busy: deleteBusy,
						t,
						onCancel: () => {
							if (!deleteBusy) setPendingDelete(null);
						},
						onConfirm: () => {
							confirmDelete();
						}
					})
				]
			});
		}
		function ProjectCard({ project, index, list, t, onOpen, onDelete }) {
			const [emoji, title] = splitEmoji(project.title);
			return (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.projectCard,
				"data-list": list || void 0,
				style: { "--card-tint": CARD_TONES[index % CARD_TONES.length] },
				children: [
					(0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.cardOpen,
						type: "button",
						onClick: onOpen,
						"aria-label": t("card.openAria", { title: project.title })
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.cardEmoji,
						children: emoji || (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleMedium, { size: 25 })
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.cardInfo,
						children: [
							(0, react_jsx_runtime.jsx)("h3", { children: title }),
							(0, react_jsx_runtime.jsx)("p", { children: project.goal || project.question }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", {
								className: views_module_css_default.phase,
								"data-phase": project.runState === "paused" ? "aborted" : project.phase,
								children: phaseLabel(project, t)
							}), (0, react_jsx_runtime.jsx)("span", { children: t("card.evidence", {
								count: project.evidence.length,
								date: formatDate(project.updatedAt)
							}) })] })
						]
					}),
					(0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.deleteButton,
						type: "button",
						"aria-label": t("workspace.delete"),
						onClick: (event) => {
							event.stopPropagation();
							onDelete();
						},
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 15 })
					})
				]
			});
		}
		function ResearchComposer({ busy, error, setBusy, t, onClose, onCreate, setError }) {
			const [question, setQuestion] = (0, react.useState)("");
			const [goal, setGoal] = (0, react.useState)("");
			const [constraints, setConstraints] = (0, react.useState)("");
			const [seedText, setSeedText] = (0, react.useState)("");
			const [depth, setDepth] = (0, react.useState)("standard");
			const [contextOpen, setContextOpen] = (0, react.useState)(false);
			const contextCount = [
				goal,
				constraints,
				seedText
			].filter((value) => value.trim() !== "").length;
			const submit = (event) => {
				event.preventDefault();
				const trimmed = question.trim();
				if (busy || trimmed === "") return;
				setBusy(true);
				setError(null);
				onCreate({
					question: trimmed,
					goal: goal.trim(),
					constraints: constraints.trim(),
					seedText: seedText.trim(),
					depth,
					questions: []
				}).catch((cause) => {
					setError(messageOf(cause));
				}).finally(() => {
					setBusy(false);
				});
			};
			return (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.modalBackdrop,
				role: "presentation",
				children: (0, react_jsx_runtime.jsxs)("form", {
					className: views_module_css_default.modal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "new-research-title",
					onSubmit: submit,
					children: [
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalHeader,
							children: [(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.modalHeading,
								children: [(0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleMedium, { size: 18 })
								}), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", {
									id: "new-research-title",
									children: t("composer.title")
								}), (0, react_jsx_runtime.jsx)("p", { children: t("composer.subtitle") })] })]
							}), (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.modalCloseButton,
								type: "button",
								"aria-label": t("composer.closeAria"),
								disabled: busy,
								onClick: onClose,
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineMedium, { size: 16 })
							})]
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalBody,
							children: [
								(0, react_jsx_runtime.jsxs)("label", {
									className: views_module_css_default.fieldLabel,
									children: [(0, react_jsx_runtime.jsxs)("span", { children: [
										t("composer.question"),
										" ",
										(0, react_jsx_runtime.jsx)("b", { children: t("composer.required") })
									] }), (0, react_jsx_runtime.jsx)("textarea", {
										autoFocus: true,
										className: views_module_css_default.questionInput,
										value: question,
										onChange: (event) => {
											setQuestion(event.target.value);
										},
										placeholder: t("composer.questionPlaceholder")
									})]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.contextCard,
									children: [(0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-expanded": contextOpen,
										onClick: () => {
											setContextOpen((value) => !value);
										},
										children: [
											(0, react_jsx_runtime.jsx)("span", { children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 15 }) }),
											(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsxs)("strong", { children: [t("composer.context"), contextCount === 0 ? "" : t("composer.contextCount", { count: contextCount })] }), (0, react_jsx_runtime.jsx)("small", { children: t("composer.contextHint") })] }),
											(0, react_jsx_runtime.jsx)("b", { children: contextOpen ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronUpOutlineMedium, { size: 14 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineMedium, { size: 14 }) })
										]
									}), contextOpen ? (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.contextFields,
										children: [
											(0, react_jsx_runtime.jsxs)("label", { children: [t("composer.goal"), (0, react_jsx_runtime.jsx)("input", {
												className: views_module_css_default.input,
												value: goal,
												onChange: (event) => {
													setGoal(event.target.value);
												},
												placeholder: t("composer.goalPlaceholder")
											})] }),
											(0, react_jsx_runtime.jsxs)("label", { children: [t("composer.depth"), (0, react_jsx_runtime.jsxs)("select", {
												className: views_module_css_default.input,
												value: depth,
												onChange: (event) => {
													setDepth(event.target.value);
												},
												children: [
													(0, react_jsx_runtime.jsx)("option", {
														value: "quick",
														children: t("depth.quick")
													}),
													(0, react_jsx_runtime.jsx)("option", {
														value: "standard",
														children: t("depth.standard")
													}),
													(0, react_jsx_runtime.jsx)("option", {
														value: "deep",
														children: t("depth.deep")
													})
												]
											})] }),
											(0, react_jsx_runtime.jsxs)("label", { children: [t("composer.constraints"), (0, react_jsx_runtime.jsx)("textarea", {
												className: views_module_css_default.textareaSmall,
												value: constraints,
												onChange: (event) => {
													setConstraints(event.target.value);
												},
												placeholder: t("composer.constraintsPlaceholder")
											})] }),
											(0, react_jsx_runtime.jsxs)("label", { children: [t("composer.seed"), (0, react_jsx_runtime.jsx)("textarea", {
												className: views_module_css_default.textareaSmall,
												value: seedText,
												onChange: (event) => {
													setSeedText(event.target.value);
												},
												placeholder: t("composer.seedPlaceholder")
											})] })
										]
									}) : null]
								}),
								error === null ? null : (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.modalError,
									role: "alert",
									children: error
								})
							]
						}),
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalFooter,
							children: [(0, react_jsx_runtime.jsx)("span", { children: t("composer.footer") }), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.modalCancelButton,
								type: "button",
								disabled: busy,
								onClick: onClose,
								children: t("action.cancel")
							}), (0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.modalSubmitButton,
								type: "submit",
								disabled: busy || question.trim() === "",
								children: [busy ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
									className: views_module_css_default.spinner,
									size: 14
								}) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleMedium, { size: 14 }), busy ? t("action.creating") : t("action.createPlan")]
							})] })]
						})
					]
				})
			});
		}
		function DeleteConfirmDialog({ pending, busy, t, onCancel, onConfirm }) {
			const [, title] = splitEmoji(pending.title);
			const name = title || pending.title;
			return (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.confirmBackdrop,
				role: "presentation",
				onClick: () => {
					if (!busy) onCancel();
				},
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.confirmCard,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "delete-research-title",
					onClick: (event) => {
						event.stopPropagation();
					},
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.confirmMark,
							"aria-hidden": "true"
						}),
						(0, react_jsx_runtime.jsx)("h3", {
							id: "delete-research-title",
							children: t("delete.title")
						}),
						(0, react_jsx_runtime.jsx)("p", { children: t("delete.body", { title: name }) }),
						(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.confirmActions,
							children: [(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.confirmCancel,
								type: "button",
								disabled: busy,
								onClick: onCancel,
								children: t("action.cancel")
							}), (0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.confirmDelete,
								type: "button",
								disabled: busy,
								onClick: onConfirm,
								children: [busy ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
									className: views_module_css_default.spinner,
									size: 14
								}) : null, t("delete.confirm")]
							})]
						})
					]
				})
			});
		}
		function ResearchWorkspace({ project, api, t, onChange, onBack, onDelete, error, setError }) {
			const [focus, setFocus] = (0, react.useState)(stepFor(project));
			const [goal, setGoal] = (0, react.useState)(project.goal);
			const [questions, setQuestions] = (0, react.useState)(() => editablePlan(project));
			const [busy, setBusy] = (0, react.useState)(false);
			const prevPhase = (0, react.useRef)(project.phase);
			(0, react.useEffect)(() => {
				setGoal(project.goal);
				setQuestions(editablePlan(project));
				const from = prevPhase.current;
				prevPhase.current = project.phase;
				setFocus((current) => {
					const target = stepFor(project);
					if (from !== project.phase && target === "investigate" && current === "plan") return "investigate";
					if (from !== project.phase && target === "report" && current !== "report") return "report";
					return reachableStep(project, current) ? current : target;
				});
			}, [
				project.phase,
				project.goal,
				project.id,
				project.updatedAt
			]);
			const seenUpdatedAt = (0, react.useRef)(project.updatedAt);
			seenUpdatedAt.current = project.updatedAt;
			const applyLatest = (0, react.useCallback)((latest) => {
				if (latest.id !== project.id || latest.updatedAt === seenUpdatedAt.current) return;
				onChange(latest);
			}, [onChange, project.id]);
			(0, react.useEffect)(() => {
				let active = true;
				const unsubscribe = api.subscribeProgress((latest) => {
					if (active) applyLatest(latest);
				});
				return () => {
					active = false;
					unsubscribe();
				};
			}, [api.subscribeProgress, applyLatest]);
			(0, react.useEffect)(() => {
				if (project.runState !== "running") return;
				let active = true;
				let inFlight = false;
				const sync = () => {
					if (!active || inFlight) return;
					inFlight = true;
					api.get(project.id).then((latest) => {
						if (active && latest !== null) applyLatest(latest);
					}).finally(() => {
						inFlight = false;
					});
				};
				sync();
				const timer = window.setInterval(sync, 2500);
				return () => {
					active = false;
					window.clearInterval(timer);
				};
			}, [
				api,
				applyLatest,
				project.id,
				project.runState
			]);
			const run = (0, react.useCallback)(async (operation) => {
				setBusy(true);
				setError(null);
				try {
					onChange(await operation());
				} catch (cause) {
					setError(messageOf(cause));
				} finally {
					setBusy(false);
				}
			}, [onChange, setError]);
			const planRequest = (0, react.useCallback)(() => ({
				id: project.id,
				goal: goal.trim(),
				constraints: project.constraints,
				depth: project.depth,
				questions: questions.map((question) => ({
					...question,
					text: question.text.trim(),
					criteria: question.criteria.map((item) => item.trim()).filter(Boolean)
				})).filter((question) => question.text !== "" && question.criteria.length > 0)
			}), [
				goal,
				project.constraints,
				project.depth,
				project.id,
				questions
			]);
			const savePlan = (0, react.useCallback)(() => {
				run(() => api.updatePlan(planRequest()));
			}, [
				api,
				planRequest,
				run
			]);
			const confirmAndStart = (0, react.useCallback)(async () => {
				if (busy) return;
				setBusy(true);
				setError(null);
				try {
					const saved = await api.updatePlan(planRequest());
					onChange(await api.confirmPlan(saved.id));
					setFocus("investigate");
				} catch (cause) {
					setError(messageOf(cause));
				} finally {
					setBusy(false);
				}
			}, [
				api,
				busy,
				onChange,
				planRequest,
				setError
			]);
			const running = project.runState === "running";
			const paused = project.runState === "paused";
			const canContinue = paused && [
				"planning",
				"investigating",
				"incomplete",
				"writing",
				"aborted",
				"failed"
			].includes(project.phase);
			const canWrite = project.planConfirmed && !running && [
				"ready_for_report",
				"writing",
				"done",
				"incomplete",
				"investigating"
			].includes(project.phase);
			const stopRun = (0, react.useCallback)(() => {
				run(() => api.fail(project.id, t("investigate.stopReason"), true));
			}, [
				api,
				project.id,
				run,
				t
			]);
			const resumeRun = (0, react.useCallback)(() => {
				run(() => api.resume(project.id));
			}, [
				api,
				project.id,
				run
			]);
			const rewriteReport = (0, react.useCallback)(() => {
				run(async () => {
					const next = await api.writeReport(project.id);
					setFocus("report");
					return next;
				});
			}, [
				api,
				project.id,
				run
			]);
			const activeStep = reachableStep(project, focus) ? focus : stepFor(project);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.workspace,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: views_module_css_default.workspaceHeader,
						children: [
							(0, react_jsx_runtime.jsxs)("button", {
								className: views_module_css_default.backButton,
								type: "button",
								onClick: onBack,
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineMedium, { size: 15 }), t("workspace.back")]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.projectHeading,
								children: [(0, react_jsx_runtime.jsx)("p", {
									className: views_module_css_default.eyebrow,
									children: "RESEARCH PROJECT"
								}), (0, react_jsx_runtime.jsx)("h2", { children: project.title })]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.headerActions,
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: views_module_css_default.phase,
										"data-phase": paused ? "aborted" : project.phase,
										children: phaseLabel(project, t)
									}),
									running ? (0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.stopButton,
										type: "button",
										disabled: busy,
										onClick: stopRun,
										children: t("investigate.stop")
									}) : null,
									canContinue ? (0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.secondaryButton,
										type: "button",
										disabled: busy,
										onClick: resumeRun,
										children: project.planConfirmed ? t("investigate.continue") : t("plan.retry")
									}) : null,
									canWrite && (project.phase === "ready_for_report" || project.phase === "writing" || project.phase === "done" || project.phase === "incomplete") ? (0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.primaryButton,
										type: "button",
										disabled: busy,
										onClick: rewriteReport,
										children: project.report ? t("report.retry") : t("investigate.writeReport")
									}) : null,
									(0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.deleteText,
										type: "button",
										onClick: onDelete,
										children: t("workspace.delete")
									})
								]
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.progressBar,
						children: (0, react_jsx_runtime.jsx)("nav", {
							className: views_module_css_default.stepper,
							children: [
								["plan", "stepper.plan"],
								["investigate", "stepper.investigate"],
								["report", "stepper.report"]
							].map(([id, key]) => {
								return (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !reachableStep(project, id),
									"data-active": activeStep === id,
									onClick: () => {
										setFocus(id);
									},
									children: t(key)
								}, id);
							})
						})
					}),
					error === null ? null : (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.error,
						children: error
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.detailBody,
						children: [
							(0, react_jsx_runtime.jsx)("span", {
								"data-deepresearch-view": "",
								hidden: true
							}),
							activeStep !== "plan" ? null : (0, react_jsx_runtime.jsx)(PlanStep, {
								project,
								t,
								busy,
								goal,
								setGoal,
								questions,
								setQuestions,
								onSave: savePlan,
								onConfirm: () => {
									confirmAndStart();
								},
								onRetry: resumeRun
							}),
							activeStep !== "investigate" ? null : (0, react_jsx_runtime.jsx)(InvestigatePane, {
								project,
								t,
								busy,
								onStop: stopRun,
								onContinue: resumeRun,
								onWrite: rewriteReport
							}),
							activeStep !== "report" ? null : (0, react_jsx_runtime.jsx)(ReportPane, {
								project,
								t,
								busy,
								onRewrite: rewriteReport
							})
						]
					})
				]
			});
		}
		/** Plan step: waiting shell, planner failure, or the reviewable plan itself. */
		function PlanStep({ project, t, busy, goal, setGoal, questions, setQuestions, onSave, onConfirm, onRetry }) {
			if (project.phase === "planning" && project.questions.length === 0) {
				const stopped = project.runState !== "running";
				return (0, react_jsx_runtime.jsx)("section", {
					className: views_module_css_default.planPane,
					children: (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.planningState,
						children: [(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.planningIcon,
							"aria-hidden": "true",
							children: stopped ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 22 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
								className: views_module_css_default.spinner,
								size: 22
							})
						}), (0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("h3", { children: stopped ? t("plan.stopped") : t("phase.planning") }),
							(0, react_jsx_runtime.jsx)("p", { children: stopped ? t("plan.stoppedHint") : t("plan.subtitle") }),
							stopped ? (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.primaryButton,
								type: "button",
								disabled: busy,
								onClick: onRetry,
								children: t("plan.retry")
							}) : null
						] })]
					})
				});
			}
			if (project.phase === "failed" && !project.planConfirmed && project.questions.length === 0) return (0, react_jsx_runtime.jsx)("section", {
				className: views_module_css_default.planPane,
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.planFailure,
					role: "alert",
					children: [
						(0, react_jsx_runtime.jsx)("h3", { children: t("plan.failedTitle") }),
						(0, react_jsx_runtime.jsx)("p", { children: t("plan.failedHint") }),
						project.limitations.map((item) => (0, react_jsx_runtime.jsx)("code", { children: item }, item))
					]
				})
			});
			const locked = project.planConfirmed || busy;
			const updateQuestion = (index, patch) => {
				setQuestions((current) => current.map((item, itemIndex) => itemIndex === index ? {
					...item,
					...patch
				} : item));
			};
			return (0, react_jsx_runtime.jsxs)("section", {
				className: views_module_css_default.planPane,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.sectionHeader,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("p", {
								className: views_module_css_default.planEyebrow,
								children: t("plan.title")
							}),
							(0, react_jsx_runtime.jsx)("h3", {
								className: views_module_css_default.planQuestionTitle,
								children: project.question
							}),
							(0, react_jsx_runtime.jsx)("p", { children: t("plan.subtitle") })
						] }), (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.headerActions,
							children: [(0, react_jsx_runtime.jsx)("span", {
								className: views_module_css_default.planDepth,
								children: `${t("composer.depth")} · ${depthLabel(project.depth, t)}`
							}), project.planConfirmed ? (0, react_jsx_runtime.jsxs)("span", {
								className: views_module_css_default.confirmed,
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineMedium, { size: 13 }), t("plan.confirmed")]
							}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.secondaryButton,
								type: "button",
								disabled: busy,
								onClick: onSave,
								children: t("action.saveChanges")
							}), (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.primaryButton,
								type: "button",
								disabled: busy || questions.length === 0,
								onClick: onConfirm,
								children: t("action.confirmStart")
							})] })]
						})]
					}),
					(0, react_jsx_runtime.jsxs)("label", {
						className: views_module_css_default.goalBlock,
						children: [(0, react_jsx_runtime.jsx)("span", { children: t("plan.goal") }), (0, react_jsx_runtime.jsx)("textarea", {
							value: goal,
							disabled: locked,
							onChange: (event) => {
								setGoal(event.target.value);
							}
						})]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.planList,
						children: [(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.planListLabel,
							children: t("plan.criteria")
						}), questions.map((question, index) => {
							const criteria = question.criteria.filter((item) => item.trim() !== "");
							const deps = question.dependsOn ?? [];
							return (0, react_jsx_runtime.jsxs)("section", {
								className: views_module_css_default.planQuestion,
								children: [(0, react_jsx_runtime.jsx)("span", { children: ordinal(index) }), (0, react_jsx_runtime.jsxs)("div", { children: [
									project.planConfirmed ? (0, react_jsx_runtime.jsx)("h4", { children: question.text }) : (0, react_jsx_runtime.jsx)("textarea", {
										value: question.text,
										disabled: busy,
										onChange: (event) => {
											updateQuestion(index, { text: event.target.value });
										}
									}),
									project.planConfirmed ? (0, react_jsx_runtime.jsx)("ul", {
										className: views_module_css_default.criteriaList,
										children: criteria.map((item, itemIndex) => (0, react_jsx_runtime.jsx)("li", { children: item }, `${index}-${itemIndex}`))
									}) : (0, react_jsx_runtime.jsxs)("label", { children: [t("plan.criteria"), (0, react_jsx_runtime.jsx)("textarea", {
										value: question.criteria.join("\n"),
										disabled: busy,
										onChange: (event) => {
											updateQuestion(index, { criteria: event.target.value.split("\n") });
										}
									})] }),
									deps.length === 0 ? null : (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.depBlock,
										children: [
											(0, react_jsx_runtime.jsx)("span", {
												className: views_module_css_default.depLabel,
												children: t("plan.dependsOn")
											}),
											(0, react_jsx_runtime.jsx)("div", {
												className: views_module_css_default.depChips,
												children: deps.map((dep) => (0, react_jsx_runtime.jsx)("span", {
													className: views_module_css_default.depChip,
													children: t("plan.dependsOnChip", { label: formatDepLabel(dep, questions[dep]?.text ?? "") })
												}, `${index}-${dep}`))
											}),
											(0, react_jsx_runtime.jsx)("small", {
												className: views_module_css_default.depHint,
												children: t("plan.dependsOnHint")
											})
										]
									})
								] })]
							}, `${project.id}-${index}`);
						})]
					})
				]
			});
		}
		/** Investigate step: timeline first, then questions + limitations, then evidence. */
		function InvestigatePane({ project, t, busy, onStop, onContinue, onWrite }) {
			const indexOf = (0, react.useMemo)(() => new Map(project.questions.map((question, index) => [question.id, index])), [project.questions]);
			const scouts = (0, react.useMemo)(() => boardScouts(project), [project]);
			const scoutOf = (0, react.useMemo)(() => new Map(scouts.map((scout) => [scout.questionId, scout])), [scouts]);
			const settledQuestions = project.questions.filter((item) => isSettledQuestion(item.status)).length;
			const settledScouts = scouts.filter((item) => item.status === "done" || item.status === "partial" || item.status === "blocked").length;
			const accepted = project.evidence.filter((item) => item.status !== "candidate" && item.status !== "rejected").length;
			const limitations = boardLimitations(project, t, project.phase === "investigating");
			return (0, react_jsx_runtime.jsxs)("section", {
				className: views_module_css_default.investigatePane,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: views_module_css_default.questionHeader,
						children: [
							(0, react_jsx_runtime.jsx)("span", { children: t("composer.question") }),
							(0, react_jsx_runtime.jsx)("h3", { children: project.question }),
							project.goal === "" ? null : (0, react_jsx_runtime.jsx)("p", { children: project.goal })
						]
					}),
					project.phase === "investigating" && project.runState === "running" ? (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.runningBanner,
						role: "status",
						children: [
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
								className: views_module_css_default.spinner,
								size: 16
							}),
							(0, react_jsx_runtime.jsx)("span", { children: t("investigate.running") }),
							(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.stopButton,
								type: "button",
								disabled: busy,
								onClick: onStop,
								children: t("investigate.stop")
							})
						]
					}) : null,
					project.runState === "paused" && [
						"investigating",
						"incomplete",
						"writing",
						"aborted"
					].includes(project.phase) ? (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.pausedBanner,
						role: "status",
						children: [
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 15 }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: t("phase.aborted") }), (0, react_jsx_runtime.jsx)("p", { children: t("investigate.pausedHint") })] }),
							(0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.bannerActions,
								children: [(0, react_jsx_runtime.jsx)("button", {
									className: views_module_css_default.secondaryButton,
									type: "button",
									disabled: busy,
									onClick: onContinue,
									children: t("investigate.continue")
								}), project.questions.every((item) => isSettledQuestion(item.status)) ? (0, react_jsx_runtime.jsx)("button", {
									className: views_module_css_default.primaryButton,
									type: "button",
									disabled: busy,
									onClick: onWrite,
									children: t("investigate.writeReport")
								}) : null]
							})
						]
					}) : null,
					project.phase === "ready_for_report" && project.runState !== "running" ? (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.readyBanner,
						role: "status",
						children: [
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineMedium, { size: 15 }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: t("investigate.readyTitle") }), (0, react_jsx_runtime.jsx)("p", { children: t("investigate.readyHint") })] }),
							(0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.primaryButton,
								type: "button",
								disabled: busy,
								onClick: onWrite,
								children: t("investigate.writeReport")
							})
						]
					}) : null,
					project.phase === "incomplete" && project.runState !== "paused" ? (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.incompleteBanner,
						role: "status",
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 15 }), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: t("investigate.incompleteTitle") }), (0, react_jsx_runtime.jsx)("p", { children: t("investigate.incompleteHint") })] })]
					}) : null,
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.metrics,
						children: [
							(0, react_jsx_runtime.jsx)(Metric, {
								label: t("metric.subQuestions"),
								value: `${settledQuestions}/${project.questions.length}`
							}),
							(0, react_jsx_runtime.jsx)(Metric, {
								label: t("metric.evidence"),
								value: String(accepted)
							}),
							(0, react_jsx_runtime.jsx)(Metric, {
								label: t("investigate.scouts"),
								value: `${settledScouts}/${scouts.length}`
							})
						]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: views_module_css_default.timeline,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: views_module_css_default.sectionHeader,
							children: (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", { children: t("investigate.title") }), (0, react_jsx_runtime.jsx)("p", { children: t("investigate.subtitle") })] })
						}), scouts.map((scout) => (0, react_jsx_runtime.jsx)(ScoutCard, {
							project,
							scout,
							indexOf,
							t
						}, scout.questionId))]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.boardGrid,
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.questions,
							children: [(0, react_jsx_runtime.jsxs)("h4", {
								className: views_module_css_default.boardHeading,
								children: [
									t("investigate.questions"),
									" ",
									(0, react_jsx_runtime.jsx)("span", { children: project.questions.length })
								]
							}), project.questions.map((question, index) => (0, react_jsx_runtime.jsx)(QuestionCard, {
								project,
								question,
								index,
								indexOf,
								scout: scoutOf.get(question.id),
								t
							}, question.id))]
						}), (0, react_jsx_runtime.jsx)(LimitationsBoard, {
							items: limitations,
							t,
							always: true
						})]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: views_module_css_default.evidencePane,
						children: [(0, react_jsx_runtime.jsxs)("h4", {
							className: views_module_css_default.boardHeading,
							children: [
								t("evidence.title"),
								" ",
								(0, react_jsx_runtime.jsx)("span", { children: project.evidence.length })
							]
						}), project.evidence.length === 0 ? (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.evidenceEmpty,
							children: [(0, react_jsx_runtime.jsx)("span", { children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 17 }) }), (0, react_jsx_runtime.jsx)("p", { children: t("evidence.empty") })]
						}) : (0, react_jsx_runtime.jsx)("div", {
							className: views_module_css_default.evidenceGrid,
							children: project.evidence.map((item) => (0, react_jsx_runtime.jsx)(EvidenceCard, {
								evidence: item,
								t
							}, item.id))
						})]
					})
				]
			});
		}
		function QuestionCard({ project, question, index, indexOf, scout, t }) {
			const deps = resolveIndexes(question.dependsOn, indexOf);
			const waiting = resolveIndexes(scout?.waitingOn ?? [], indexOf);
			const gaps = question.gaps ?? [];
			const label = (at) => formatDepLabel(at, project.questions[at]?.text ?? "");
			const waitingOnDeps = waiting.length > 0;
			const queued = !waitingOnDeps && scout?.status === "waiting";
			return (0, react_jsx_runtime.jsx)("article", {
				className: views_module_css_default.questionCard,
				"data-status": waitingOnDeps ? "waiting" : question.status,
				"data-live": question.status === "running" || void 0,
				children: (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.questionTitle,
					children: [
						(0, react_jsx_runtime.jsx)("span", { children: ordinal(index) }),
						(0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("h4", { children: question.text }),
							deps.length === 0 ? null : (0, react_jsx_runtime.jsx)("div", {
								className: views_module_css_default.depChips,
								children: deps.map((at) => (0, react_jsx_runtime.jsx)("span", {
									className: views_module_css_default.depChip,
									children: t("plan.dependsOnChip", { label: label(at) })
								}, at))
							}),
							waiting.length === 0 ? null : (0, react_jsx_runtime.jsx)("p", {
								className: views_module_css_default.waitingLine,
								children: t("investigate.waitingOn", { list: waiting.map(label).join("、") })
							}),
							gaps.length === 0 ? null : (0, react_jsx_runtime.jsx)("p", {
								className: views_module_css_default.gapLine,
								children: `${t("investigate.gaps")}: ${gaps.join(" · ")}`
							})
						] }),
						(0, react_jsx_runtime.jsx)("strong", {
							"data-status": waitingOnDeps ? "waiting" : queued ? "pending" : question.status,
							children: waitingOnDeps ? t("investigate.waitingStatus") : queued ? t("investigate.queued") : statusLabel(question.status, t)
						})
					]
				})
			});
		}
		function ScoutCard({ project, scout, indexOf, t }) {
			const at = indexOf.get(scout.questionId);
			const question = at === void 0 ? void 0 : project.questions[at];
			const title = question?.text ?? String(scout.questionId);
			const waiting = scout.status === "waiting";
			const verifying = scout.status === "verifying" || scout.role === "evaluator";
			const live = scout.status === "running" || verifying;
			const failed = scout.status === "blocked";
			const partial = scout.status === "partial";
			const accepted = project.evidence.filter((item) => item.questionId === scout.questionId && item.status !== "candidate" && item.status !== "rejected");
			const activity = scout.activity.trim() !== "" ? scout.activity : verifying ? t("investigate.evaluating") : waiting ? scout.waitingOn.length > 0 ? t("investigate.waitingOn", { list: resolveIndexes(scout.waitingOn, indexOf).map((item) => formatDepLabel(item, project.questions[item]?.text ?? "")).join("、") }) : t("investigate.queuedHint") : live ? scout.activeCriterionText || t("investigate.running") : "";
			const scoutDraft = readableDraft(scout.scoutDraft);
			const evaluatorDraft = readableDraft(scout.evaluatorDraft);
			const criterionLabel = clipLabel(scout.activeCriterionText, 36);
			return (0, react_jsx_runtime.jsxs)("details", {
				className: views_module_css_default.scoutCard,
				"data-status": scout.status,
				"data-role": scout.role,
				"data-live": live || void 0,
				open: live || waiting || failed || void 0,
				children: [(0, react_jsx_runtime.jsxs)("summary", {
					className: views_module_css_default.scoutSummary,
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.scoutIcon,
							"data-status": waiting ? "waiting" : live ? "running" : failed || partial ? scout.status : "done",
							children: live ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
								className: views_module_css_default.spinner,
								size: 14
							}) : failed || partial ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 14 }) : waiting ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 14 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineMedium, { size: 14 })
						}),
						(0, react_jsx_runtime.jsxs)("span", {
							className: views_module_css_default.scoutSummaryBody,
							children: [(0, react_jsx_runtime.jsx)("strong", { children: title }), (0, react_jsx_runtime.jsxs)("span", {
								className: views_module_css_default.scoutMetaRow,
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: views_module_css_default.scoutChip,
										"data-kind": verifying ? "verify" : "role",
										children: verifying ? t("investigate.verifying") : t("investigate.scouts")
									}),
									(0, react_jsx_runtime.jsx)("span", {
										className: views_module_css_default.scoutChip,
										children: t("investigate.toolsUsed", {
											used: scout.toolsUsed,
											cap: scout.toolsCap || 10
										})
									}),
									(0, react_jsx_runtime.jsx)("span", {
										className: views_module_css_default.scoutChip,
										children: t("investigate.evidenceCount", { count: accepted.length })
									}),
									criterionLabel === "" || !live ? null : (0, react_jsx_runtime.jsx)("span", {
										className: views_module_css_default.scoutChip,
										"data-kind": "criterion",
										children: criterionLabel
									})
								]
							})]
						}),
						(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.scoutStatus,
							"data-live": live || void 0,
							children: scoutStatusLabel(scout, t)
						}),
						(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineMedium, { size: 14 })
					]
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.scoutBody,
					children: [
						activity === "" ? null : (0, react_jsx_runtime.jsxs)("p", {
							className: views_module_css_default.scoutActivity,
							"data-live": live || void 0,
							children: [live ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
								className: views_module_css_default.spinner,
								size: 12
							}) : waiting ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutlineMedium, { size: 12 }) : null, (0, react_jsx_runtime.jsx)("span", { children: activity })]
						}),
						question === void 0 || question.criteria.length === 0 ? null : (0, react_jsx_runtime.jsx)(CriterionList, {
							criteria: question.criteria,
							scout,
							t
						}),
						(scout.tools ?? []).length === 0 ? null : (0, react_jsx_runtime.jsx)("ul", {
							className: views_module_css_default.toolList,
							children: scout.tools.map((tool, index) => (0, react_jsx_runtime.jsxs)("li", {
								"data-status": tool.status,
								children: [(0, react_jsx_runtime.jsx)("b", { children: toolLabel(tool.name, t) }), (0, react_jsx_runtime.jsx)("span", { children: tool.detail })]
							}, `${tool.name}-${index}`))
						}),
						accepted.length === 0 ? null : (0, react_jsx_runtime.jsx)("div", {
							className: views_module_css_default.scoutEvidence,
							children: accepted.slice(0, 8).map((item) => (0, react_jsx_runtime.jsx)(EvidenceCard, {
								evidence: item,
								t
							}, item.id))
						}),
						scout.dependencySummary === "" ? null : (0, react_jsx_runtime.jsxs)("details", {
							className: views_module_css_default.handoff,
							open: waiting || void 0,
							children: [(0, react_jsx_runtime.jsx)("summary", { children: t("investigate.dependencySummary") }), (0, react_jsx_runtime.jsx)("pre", { children: scout.dependencySummary })]
						}),
						scoutDraft === "" ? null : (0, react_jsx_runtime.jsxs)("details", {
							className: views_module_css_default.handoff,
							children: [(0, react_jsx_runtime.jsx)("summary", { children: t("investigate.scoutDraft") }), (0, react_jsx_runtime.jsx)("pre", { children: scoutDraft })]
						}),
						evaluatorDraft === "" ? null : (0, react_jsx_runtime.jsxs)("details", {
							className: views_module_css_default.handoff,
							children: [(0, react_jsx_runtime.jsx)("summary", { children: t("investigate.evaluatorDraft") }), (0, react_jsx_runtime.jsx)("pre", { children: evaluatorDraft })]
						}),
						scout.handoff === "" ? null : (0, react_jsx_runtime.jsxs)("details", {
							className: views_module_css_default.handoff,
							children: [(0, react_jsx_runtime.jsx)("summary", { children: t("investigate.handoff") }), (0, react_jsx_runtime.jsx)("pre", { children: scout.handoff })]
						})
					]
				})]
			});
		}
		function CriterionList({ criteria, scout, t }) {
			const live = scout?.status === "running" || scout?.status === "verifying";
			const verifying = scout?.status === "verifying" || scout?.role === "evaluator";
			const cap = Math.max(1, scout?.toolsCap || 10);
			if (criteria.length === 0) return null;
			return (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.coverage,
				children: [(0, react_jsx_runtime.jsx)("h5", { children: t("investigate.coverage") }), (0, react_jsx_runtime.jsx)("ul", {
					className: views_module_css_default.coverageList,
					children: criteria.map((criterion) => {
						const active = Boolean(live && scout !== void 0 && scout.activeCriterionId === criterion.id);
						const used = active && scout !== void 0 ? scout.toolsUsed : criterion.toolCount ?? 0;
						const atCap = used >= cap;
						const status = active && verifying ? t("investigate.verifying") : coverageLabel(criterion.status, t);
						const verification = verificationLabel(criterion.verification, t);
						return (0, react_jsx_runtime.jsxs)("li", {
							className: views_module_css_default.coverageItem,
							"data-status": criterion.status,
							"data-active": active || void 0,
							"data-verify": criterion.verification || void 0,
							children: [
								(0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.coverageHead,
									children: [(0, react_jsx_runtime.jsx)("b", { children: criterion.text }), (0, react_jsx_runtime.jsxs)("span", { children: [
										active ? `${t("investigate.activeNow")} · ` : "",
										status,
										verification === "" ? "" : ` · ${verification}`,
										` · ${t("investigate.toolsUsed", {
											used,
											cap
										})}`,
										atCap ? ` · ${t("investigate.capReached")}` : ""
									] })]
								}),
								criterion.summary === "" ? null : (0, react_jsx_runtime.jsx)("p", { children: `${t("investigate.summary")}: ${criterion.summary}` }),
								criterion.warning === "" ? null : (0, react_jsx_runtime.jsx)("em", {
									"data-tone": "warning",
									children: `${t("investigate.warning")}: ${criterion.warning}`
								}),
								criterion.gap === "" ? null : (0, react_jsx_runtime.jsx)("em", {
									"data-tone": "gap",
									children: `${t("investigate.gaps")}: ${criterion.gap}`
								})
							]
						}, criterion.id);
					})
				})]
			});
		}
		function EvidenceCard({ evidence, t }) {
			const url = primaryEvidenceUrl(evidence);
			const host = sourceHostname(url);
			return (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.evidenceCard,
				"data-status": evidence.status,
				children: [
					(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", {
						"data-confidence": evidence.confidence,
						children: confidenceLabel(evidence.confidence, t)
					}), host === "" ? null : (0, react_jsx_runtime.jsx)("span", {
						title: url,
						children: host
					})] }),
					(0, react_jsx_runtime.jsx)("p", { children: evidence.claim }),
					url === "" ? null : (0, react_jsx_runtime.jsxs)("a", {
						href: url,
						target: "_blank",
						rel: "noreferrer",
						title: url,
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutlineMedium, { size: 12 }), (0, react_jsx_runtime.jsx)("span", { children: host || url })]
					})
				]
			});
		}
		function ReportPane({ project, t, busy, onRewrite }) {
			const accepted = project.evidence.filter((item) => item.status !== "candidate" && item.status !== "rejected");
			const writing = project.phase === "writing" && project.runState === "running";
			const labels = (0, react.useMemo)(() => markdownLabels(t), [t]);
			return (0, react_jsx_runtime.jsxs)("section", {
				className: views_module_css_default.reportPane,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.sectionHeader,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h3", { children: t("report.title") }), (0, react_jsx_runtime.jsx)("p", { children: t("report.subtitle") })] }), project.planConfirmed && !writing ? (0, react_jsx_runtime.jsx)("button", {
							className: views_module_css_default.primaryButton,
							type: "button",
							disabled: busy,
							onClick: onRewrite,
							children: project.report ? t("report.retry") : t("investigate.writeReport")
						}) : null]
					}),
					project.report !== null ? (0, react_jsx_runtime.jsx)("article", {
						className: views_module_css_default.reportDocument,
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
							text: project.report,
							streaming: writing,
							labels
						})
					}) : writing ? (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.reportPending,
						role: "status",
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutlineMedium, {
							className: views_module_css_default.spinner,
							size: 16
						}), (0, react_jsx_runtime.jsx)("span", { children: t("report.writing") })]
					}) : (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.reportPending,
						children: t("report.empty")
					}),
					accepted.length === 0 ? null : (0, react_jsx_runtime.jsxs)("section", {
						className: views_module_css_default.evidencePane,
						children: [(0, react_jsx_runtime.jsxs)("h4", {
							className: views_module_css_default.boardHeading,
							children: [
								t("evidence.sourcesTitle"),
								" ",
								(0, react_jsx_runtime.jsx)("span", { children: accepted.length })
							]
						}), (0, react_jsx_runtime.jsx)("div", {
							className: views_module_css_default.evidenceGrid,
							children: accepted.map((item) => (0, react_jsx_runtime.jsx)(EvidenceCard, {
								evidence: item,
								t
							}, item.id))
						})]
					})
				]
			});
		}
		function LimitationsBoard({ items, t, always }) {
			if (!always && items.length === 0) return null;
			return (0, react_jsx_runtime.jsxs)("section", {
				className: views_module_css_default.limitationsBoard,
				children: [(0, react_jsx_runtime.jsxs)("h4", { children: [t("report.limitations"), items.length === 0 ? null : (0, react_jsx_runtime.jsx)("span", { children: items.length })] }), items.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
					className: views_module_css_default.limitationsEmpty,
					children: t("report.limitationsEmpty")
				}) : (0, react_jsx_runtime.jsx)("ul", {
					className: views_module_css_default.limitationList,
					children: items.map((item) => (0, react_jsx_runtime.jsxs)("li", {
						className: views_module_css_default.limitationItem,
						"data-status": item.status || void 0,
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.limitationHead,
							children: [item.ref === "" ? null : (0, react_jsx_runtime.jsx)("span", { children: item.ref }), item.status === "" ? null : (0, react_jsx_runtime.jsx)("b", { children: coverageLabel(item.status, t) })]
						}), (0, react_jsx_runtime.jsx)("p", { children: item.text })]
					}, item.key))
				})]
			});
		}
		function Metric({ label, value }) {
			return (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", { children: label }), (0, react_jsx_runtime.jsx)("strong", { children: value })] });
		}
		const CARD_TONES = [
			"#5b8def",
			"#3d9b8f",
			"#c27a4a",
			"#8b6bc9",
			"#4a9b6e",
			"#b85c7a"
		];
		/** Render a dependency reference as `01 · question text`, clipped to `max` characters. */
		function formatDepLabel(index, text, max = 42) {
			const number = ordinal(index);
			const clipped = clipLabel(text, max);
			return clipped === "" ? number : `${number} · ${clipped}`;
		}
		function clipLabel(text, max) {
			const characters = Array.from(text.trim());
			if (characters.length === 0) return "";
			return characters.length > max ? `${characters.slice(0, max - 1).join("")}…` : characters.join("");
		}
		function readableDraft(text) {
			const value = text.trim();
			if (value === "") return "";
			if (/^(Search|Fetch|Read artifact|Evaluator read)\b/i.test(value)) return "";
			if (value.startsWith("{") || value.startsWith("[")) return "";
			return value;
		}
		function toolLabel(name, t) {
			if (name === "research_web_search") return t("investigate.toolSearch");
			if (name === "research_web_fetch") return t("investigate.toolFetch");
			if (name === "read_artifact") return t("investigate.toolRead");
			return name;
		}
		function isSettledQuestion(status) {
			return status === "covered" || status === "partial" || status === "blocked";
		}
		function limitationFallback(status, t) {
			if (status === "partial") return t("limitation.partialFallback");
			if (status === "blocked") return t("limitation.blockedFallback");
			if (status === "conflicted") return t("limitation.conflictedFallback");
			return t("limitation.missingFallback");
		}
		function boardLimitations(project, t, live) {
			const rows = [];
			for (const [index, question] of project.questions.entries()) for (const criterion of question.criteria) {
				if (criterion.status === "covered") continue;
				const note = [criterion.gap, criterion.warning].map((item) => item.trim()).filter(Boolean).join(" ");
				if (criterion.status === "missing" && live && note === "") continue;
				const text = note || limitationFallback(criterion.status, t);
				rows.push({
					key: `${question.id}:${criterion.id}`,
					status: criterion.status,
					ref: `${formatDepLabel(index, question.text, 36)} · ${clipLabel(criterion.text, 28)}`,
					text
				});
			}
			for (const [index, item] of project.limitations.entries()) {
				const text = item.trim();
				if (!text || rows.some((row) => row.text === text || text.endsWith(row.text))) continue;
				rows.push({
					key: `note:${index}:${text}`,
					status: "",
					ref: "",
					text
				});
			}
			return rows;
		}
		function boardScouts(project) {
			const live = new Map((project.progress?.scouts ?? []).map((scout) => [scout.questionId, scout]));
			return project.questions.map((question) => {
				const existing = live.get(question.id);
				if (existing !== void 0) return existing;
				return {
					questionId: question.id,
					role: question.status === "running" ? "scout" : "waiting",
					status: question.status === "running" ? "running" : question.status === "covered" ? "done" : question.status === "partial" ? "partial" : question.status === "blocked" || question.status === "failed" ? "blocked" : "waiting",
					waitingOn: question.dependsOn ?? [],
					toolsUsed: 0,
					toolsCap: 10,
					activity: "",
					tools: [],
					scoutDraft: "",
					evaluatorDraft: "",
					activeCriterionId: "",
					activeCriterionText: "",
					dependencySummary: "",
					handoff: question.handoff ?? ""
				};
			});
		}
		function ordinal(index) {
			return String(index + 1).padStart(2, "0");
		}
		function resolveIndexes(ids, indexOf) {
			return ids.flatMap((id) => {
				const at = indexOf.get(id);
				return at === void 0 ? [] : [at];
			});
		}
		function editablePlan(project) {
			return project.questions.map((question) => ({
				text: question.text,
				criteria: question.criteria.map((item) => item.text),
				dependsOn: question.dependsOn.map((id) => project.questions.findIndex((candidate) => candidate.id === id)).filter((index) => index >= 0)
			}));
		}
		function stepFor(project) {
			return ["planning", "awaiting_plan_confirm"].includes(project.phase) || ["failed", "aborted"].includes(project.phase) && !project.planConfirmed ? "plan" : ["writing", "done"].includes(project.phase) ? "report" : "investigate";
		}
		function reachableStep(project, step) {
			if (project.planConfirmed && [
				"done",
				"incomplete",
				"failed",
				"aborted",
				"writing",
				"ready_for_report"
			].includes(project.phase)) return true;
			const order = [
				"plan",
				"investigate",
				"report"
			];
			const unlocked = project.phase === "ready_for_report" ? "investigate" : stepFor(project);
			return order.indexOf(step) <= order.indexOf(unlocked);
		}
		function depthLabel(depth, t) {
			return t({
				quick: "depth.quick",
				standard: "depth.standard",
				deep: "depth.deep"
			}[depth]);
		}
		function phaseLabel(project, t) {
			if (project.runState === "paused") return t("phase.aborted");
			return t({
				planning: "phase.planning",
				awaiting_plan_confirm: "phase.awaitingPlanConfirm",
				investigating: "phase.investigating",
				ready_for_report: "phase.readyForReport",
				incomplete: "phase.incomplete",
				writing: "phase.writing",
				done: "phase.done",
				failed: "phase.failed",
				aborted: "phase.aborted"
			}[project.phase]);
		}
		function statusLabel(status, t) {
			return t({
				pending: "status.pending",
				running: "status.running",
				covered: "status.covered",
				partial: "status.partial",
				blocked: "status.blocked",
				failed: "status.failed"
			}[status]);
		}
		function scoutStatusLabel(scout, t) {
			if (scout.status === "waiting" && scout.waitingOn.length === 0) return t("investigate.queued");
			return t({
				waiting: "investigate.waitingStatus",
				running: "status.running",
				verifying: "investigate.verifying",
				done: "status.covered",
				partial: "status.partial",
				blocked: "status.blocked"
			}[scout.status]);
		}
		function coverageLabel(status, t) {
			return t(`coverage.${status}`);
		}
		function confidenceLabel(value, t) {
			return t(value === "high" ? "confidence.high" : value === "low" ? "confidence.low" : "confidence.medium");
		}
		function primaryEvidenceUrl(evidence) {
			const seen = /* @__PURE__ */ new Set();
			for (const source of evidence.sources ?? []) {
				const url = source.url.trim();
				if (url === "" || seen.has(url)) continue;
				seen.add(url);
				return url;
			}
			return evidence.url?.trim() ?? "";
		}
		function sourceHostname(url) {
			try {
				return new URL(url).hostname.replace(/^www\./, "");
			} catch {
				return url.replace(/^https?:\/\//, "").split("/")[0] ?? "";
			}
		}
		function verificationLabel(value, t) {
			return value === "PASS" ? t("verify.pass") : value === "WARNING" ? t("verify.warning") : value === "FAIL" ? t("verify.fail") : "";
		}
		function splitEmoji(value) {
			const first = Array.from(value.trim())[0] ?? "";
			return /\p{Extended_Pictographic}/u.test(first) ? [first, value.trim().slice(first.length).trim() || value] : ["", value];
		}
		function formatDate(value) {
			return new Intl.DateTimeFormat(void 0, {
				month: "short",
				day: "numeric"
			}).format(value);
		}
		function messageOf(value) {
			return value instanceof Error ? value.message : String(value);
		}
		//#endregion
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/dsh-deepresearch/src/client/overlay.module.css.mjs
		const css = ".hza4LW_overlay{background:var(--dsw-alias-bg-base);pointer-events:auto;flex-direction:column;min-height:0;display:flex;position:absolute;inset:0;overflow:hidden}.hza4LW_crash{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, var(--dsw-alias-border-l1));background:var(--dsw-alias-bg-base);border-radius:16px;gap:10px;width:min(520px,100% - 48px);margin:auto;padding:22px 24px;display:grid;box-shadow:0 18px 48px #00000029}.hza4LW_crash h3{margin:0;font-size:16px;font-weight:620}.hza4LW_crash p{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}.hza4LW_crash code{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;word-break:break-word;border-radius:10px;padding:10px 12px;font-size:11px;line-height:1.45}.hza4LW_crash button{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border:0;border-radius:10px;justify-self:start;margin-top:4px;padding:8px 14px;font-size:12px;font-weight:600}";
		const tagId = "@deepseek-ai/dsh-deepresearch/overlay.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-deepresearch";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var overlay_module_css_default = {
			"crash": "hza4LW_crash",
			"overlay": "hza4LW_overlay"
		};
		//#endregion
		//#region lib/types/client/DeepResearchOverlay.js
		/** Frame-wide overlay hosting the Deep Research library and workspace. */
		/** Keep render failures inside the overlay instead of abdicating the shell slot. */
		var ResearchViewCrashBoundary = class extends react.Component {
			state = { error: null };
			static getDerivedStateFromError(error) {
				return { error };
			}
			render() {
				if (this.state.error === null) return this.props.children;
				return (0, react_jsx_runtime.jsxs)("div", {
					className: overlay_module_css_default.crash,
					role: "alert",
					children: [
						(0, react_jsx_runtime.jsx)("h3", { children: this.props.t("overlay.crashTitle") }),
						(0, react_jsx_runtime.jsx)("p", { children: this.props.t("overlay.crashHint") }),
						(0, react_jsx_runtime.jsx)("code", { children: this.state.error.message }),
						(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								this.setState({ error: null });
								this.props.onReset();
							},
							children: this.props.t("overlay.crashBack")
						})
					]
				});
			}
		};
		/** Render the research workspace when the sidebar entry opens the overlay. */
		function DeepResearchOverlay({ t, ...face }) {
			const open = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getOpen);
			const projectId = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getProjectId);
			if (!open) return null;
			return (0, react_jsx_runtime.jsx)("div", {
				className: overlay_module_css_default.overlay,
				"data-deepresearch-overlay": true,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": t("view.deepResearch"),
				children: (0, react_jsx_runtime.jsx)(ResearchViewCrashBoundary, {
					t,
					onReset: () => {
						face.store.setProjectId(null);
					},
					children: (0, react_jsx_runtime.jsx)(ResearchView, {
						t,
						...face.api,
						projectId,
						onSelectProject: (id) => {
							face.store.setProjectId(id);
						},
						onClose: () => {
							face.store.setOpen(false);
						}
					})
				})
			});
		}
		//#endregion
		//#region lib/types/client/index.js
		/** Client mount for the deep-research Remote contribution. */
		/** Required services: the typed Remote client, slot registry, and locale service. */
		const inject = [
			"remote",
			"slots",
			"locale"
		];
		/** Return one successful Remote value or surface the carrier failure. */
		function remoteValue(operation, result) {
			if (!result.ok) throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`);
			return result.value;
		}
		function createApi(clientRemote, deepResearch) {
			return {
				list: async (query) => remoteValue("deepResearch.list", await deepResearch.list({ ...query === "" ? {} : { query } })).projects.map(hydrateResearchProject),
				get: async (id) => {
					const project = remoteValue("deepResearch.get", await deepResearch.get({ id }));
					return project === null ? null : hydrateResearchProject(project);
				},
				start: async (request) => hydrateResearchProject(remoteValue("deepResearch.start", await deepResearch.start(request))),
				updatePlan: async (request) => hydrateResearchProject(remoteValue("deepResearch.updatePlan", await deepResearch.updatePlan(request))),
				confirmPlan: async (id) => hydrateResearchProject(remoteValue("deepResearch.confirmPlan", await deepResearch.confirmPlan({ id }))),
				complete: async (request) => hydrateResearchProject(remoteValue("deepResearch.complete", await deepResearch.complete(request))),
				fail: async (id, reason, aborted) => hydrateResearchProject(remoteValue("deepResearch.fail", await deepResearch.fail({
					id,
					reason,
					aborted
				}))),
				resume: async (id) => hydrateResearchProject(remoteValue("deepResearch.resume", await deepResearch.resume({ id }))),
				writeReport: async (id) => hydrateResearchProject(remoteValue("deepResearch.writeReport", await deepResearch.writeReport({ id }))),
				delete: async (id) => remoteValue("deepResearch.delete", await deepResearch.delete({ id })),
				subscribeProgress: (listener) => clientRemote.$on("deepResearch/progress", (project) => {
					listener(hydrateResearchProject(project));
				})
			};
		}
		/**
		* Mount the deep-research Remote namespace and its global sidebar/overlay surfaces.
		* @param ctx - Web client root carrying Remote, slot, and locale services.
		* @returns disposer after the namespace is ready.
		*/
		async function apply(ctx) {
			const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "deepresearch: dictionaries");
			const store = createDeepResearchUiStore();
			const view = ctx.inject(["remote.deepResearch", "slots"], (remoteCtx) => {
				const api = createApi(ctx.remote, remoteCtx.remote.deepResearch);
				const face = () => ({
					store,
					api
				});
				remoteCtx.slots.inject("sidebar.footer.action", () => remoteCtx.slots.register({
					name: "sidebar.footer.action",
					id: "deepresearch",
					order: 20,
					locale: NS,
					inject: face
				}, DeepResearchSidebarEntry));
				remoteCtx.slots.inject("shell.overlay", () => remoteCtx.slots.register({
					name: "shell.overlay",
					id: "deepresearch",
					order: 20,
					locale: NS,
					inject: face
				}, DeepResearchOverlay));
			});
			await view;
			return async () => {
				await view.dispose();
				await disposeRemote();
			};
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map