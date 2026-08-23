window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-deepresearch",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
				throw new Error("cached value already set");
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) Object.assign(mergedDescriptors, Object.getOwnPropertyDescriptors(def));
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const _undefined$2 = /^undefined$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
				else bag.exclusiveMaximum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
				else bag.exclusiveMinimum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUndefined = /*@__PURE__*/ $constructor("$ZodUndefined", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = _undefined$2;
			inst._zod.values = new Set([void 0]);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (typeof input === "undefined") return payload;
				payload.issues.push({
					expected: "undefined",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _undefined$1(Class, params) {
			return new Class({
				type: "undefined",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
			else result.definitions = defs;
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) if (legacy) {
				json.minimum = exclusiveMinimum;
				json.exclusiveMinimum = true;
			} else json.exclusiveMinimum = exclusiveMinimum;
			else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) if (legacy) {
				json.maximum = exclusiveMaximum;
				json.exclusiveMaximum = true;
			} else json.exclusiveMaximum = exclusiveMaximum;
			else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const undefinedProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Undefined cannot be represented in JSON Schema");
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, _params) => {
			const def = schema._zod.def;
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
			else vals.push(Number(val));
			else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUndefined = /*@__PURE__*/ $constructor("ZodUndefined", (inst, def) => {
			$ZodUndefined.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
		});
		function _undefined(params) {
			return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			return new ZodObject({
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			});
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			return new ZodEnum({
				type: "enum",
				entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region lib/typert.remote-client.js
		const _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"questionId": intersection(string(), unknown()).readonly(),
			"criterionIds": union([_undefined(), array(string())]).readonly().optional(),
			"source": string().readonly(),
			"url": union([_undefined(), string()]).readonly().optional(),
			"snippet": union([_undefined(), string()]).readonly().optional(),
			"sources": union([_undefined(), array(object({
				"url": string().readonly(),
				"snippet": string().readonly(),
				"artifactId": union([_undefined(), string()]).readonly().optional()
			}))]).readonly().optional(),
			"claim": string().readonly(),
			"confidence": union([
				literal("low"),
				literal("medium"),
				literal("high")
			]).readonly(),
			"status": union([
				_undefined(),
				literal("rejected"),
				literal("candidate"),
				literal("accepted")
			]).readonly().optional()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"report": string().readonly(),
			"conclusions": union([_undefined(), array(string())]).readonly().optional(),
			"limitations": union([_undefined(), array(string())]).readonly().optional(),
			"partial": union([
				_undefined(),
				literal(false),
				literal(true)
			]).readonly().optional()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_complete_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_deepresearch_deepResearch_delete_result$schema = object({ "deleted": boolean().readonly() });
		const _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"reason": string().readonly(),
			"aborted": boolean().readonly().optional()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_fail_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_deepresearch_deepResearch_get_result$schema = union([literal(null), object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		})]);
		const _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0$schema = object({
			"query": string().readonly().optional(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly().optional()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_list_result$schema = object({ "projects": array(object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		})).readonly() });
		const _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_deepresearch_deepResearch_resume_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0$schema = object({
			"title": string().readonly().optional(),
			"question": string().readonly(),
			"goal": string().readonly().optional(),
			"constraints": string().readonly().optional(),
			"seedText": string().readonly().optional(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"questions": array(object({
				"text": string().readonly(),
				"criteria": array(string()).readonly(),
				"dependsOn": array(number()).readonly().optional()
			})).readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_start_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"questions": array(object({
				"text": string().readonly(),
				"criteria": array(string()).readonly(),
				"dependsOn": array(number()).readonly().optional()
			})).readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"questionId": intersection(string(), unknown()).readonly(),
			"status": union([
				literal("running"),
				literal("failed"),
				literal("pending"),
				literal("covered"),
				literal("partial"),
				literal("blocked")
			]).readonly(),
			"criteria": array(object({
				"id": string().readonly(),
				"text": string().readonly(),
				"status": union([
					literal("covered"),
					literal("partial"),
					literal("blocked"),
					literal("missing"),
					literal("conflicted")
				]).readonly(),
				"summary": string().readonly(),
				"gap": string().readonly(),
				"warning": string().readonly(),
				"verification": union([
					literal(""),
					literal("PASS"),
					literal("WARNING"),
					literal("FAIL")
				]).readonly(),
				"toolCount": number().readonly()
			})).readonly().optional()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0$schema = object({ "id": intersection(string(), unknown()).readonly() });
		const _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_result$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"title": string().readonly(),
			"question": string().readonly(),
			"goal": string().readonly(),
			"constraints": string().readonly(),
			"seedText": string().readonly(),
			"depth": union([
				literal("quick"),
				literal("standard"),
				literal("deep")
			]).readonly(),
			"phase": union([
				literal("failed"),
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("aborted")
			]).readonly(),
			"runState": union([
				literal("running"),
				literal("idle"),
				literal("paused")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("running"),
					literal("failed"),
					literal("pending"),
					literal("covered"),
					literal("partial"),
					literal("blocked")
				]).readonly(),
				"criteria": array(object({
					"id": string().readonly(),
					"text": string().readonly(),
					"status": union([
						literal("covered"),
						literal("partial"),
						literal("blocked"),
						literal("missing"),
						literal("conflicted")
					]).readonly(),
					"summary": string().readonly(),
					"gap": string().readonly(),
					"warning": string().readonly(),
					"verification": union([
						literal(""),
						literal("PASS"),
						literal("WARNING"),
						literal("FAIL")
					]).readonly(),
					"toolCount": number().readonly()
				})).readonly(),
				"gaps": array(string()).readonly(),
				"handoff": string().readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"sources": array(object({
					"url": string().readonly(),
					"snippet": string().readonly(),
					"artifactId": union([_undefined(), string()]).readonly().optional()
				})).readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
				]).readonly(),
				"status": union([
					literal("rejected"),
					literal("candidate"),
					literal("accepted")
				]).readonly(),
				"createdAt": number().readonly()
			})).readonly(),
			"conclusions": array(string()).readonly(),
			"limitations": array(string()).readonly(),
			"report": union([literal(null), string()]).readonly(),
			"budget": object({
				"maxSearches": number().readonly(),
				"maxFetches": number().readonly(),
				"searchesUsed": number().readonly(),
				"fetchesUsed": number().readonly()
			}).readonly(),
			"progress": object({
				"running": number().readonly(),
				"waiting": number().readonly(),
				"scouts": array(object({
					"questionId": intersection(string(), unknown()).readonly(),
					"role": union([
						literal("waiting"),
						literal("writing"),
						literal("scout"),
						literal("evaluator")
					]).readonly(),
					"status": union([
						literal("running"),
						literal("waiting"),
						literal("done"),
						literal("partial"),
						literal("blocked"),
						literal("verifying")
					]).readonly(),
					"waitingOn": array(intersection(string(), unknown())).readonly(),
					"toolsUsed": number().readonly(),
					"toolsCap": number().readonly(),
					"activity": string().readonly(),
					"tools": array(object({
						"name": string().readonly(),
						"detail": string().readonly(),
						"status": union([literal("running"), literal("done")]).readonly()
					})).readonly(),
					"scoutDraft": string().readonly(),
					"evaluatorDraft": string().readonly(),
					"activeCriterionId": string().readonly(),
					"activeCriterionText": string().readonly(),
					"dependencySummary": string().readonly(),
					"handoff": string().readonly()
				})).readonly()
			}).readonly(),
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const TYPERT_REMOTE = {
			package: "@deepseek-ai/dsh-deepresearch",
			descriptors: [
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/addEvidence",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "addEvidence",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchEvidenceRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_addEvidence_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 174,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/complete",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "complete",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchCompleteRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_complete_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 208,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/confirmPlan",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "confirmPlan",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchConfirmRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_confirmPlan_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 164,
						"column": 9
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/delete",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "delete",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchDeleteRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_delete_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchDeleteResult",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_delete_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 254,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/fail",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "fail",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchFailRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_fail_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_fail_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 220,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/get",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "get",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchGetRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_get_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch#deepResearch/get:result",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_get_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 127,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/list",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "list",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchListRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchListResult",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_list_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 121,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/resume",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "resume",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchResumeRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_resume_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_resume_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 228,
						"column": 9
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/start",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "start",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchStartRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_start_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_start_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 130,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/updatePlan",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "updatePlan",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchPlanUpdateRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_updatePlan_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 154,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/updateQuestion",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "updateQuestion",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchQuestionUpdateRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 195,
						"column": 3
					}
				},
				{
					id: "@deepseek-ai/dsh-deepresearch#deepResearch/writeReport",
					service: "deepResearch",
					namespace: "deepResearch",
					method: "writeReport",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchWriteReportRequest",
							schema: _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-deepresearch/types#ResearchProject",
						schema: _deepseek_ai_dsh_deepresearch_deepResearch_writeReport_result$schema
					},
					sourceLocation: {
						"file": "packages/extensions/deepresearch/src/index.ts",
						"line": 240,
						"column": 9
					}
				}
			]
		};
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
			"coverage.missing": "未覆盖",
			"coverage.partial": "部分覆盖",
			"coverage.covered": "已覆盖",
			"coverage.conflicted": "有冲突",
			"coverage.blocked": "受阻",
			"verify.pass": "通过",
			"verify.warning": "警告",
			"verify.fail": "未通过",
			"evidence.title": "来源证据",
			"evidence.empty": "后台研究 Agent 正在检索来源；保存证据后会自动显示在这里。",
			"evidence.open": "打开来源",
			"report.title": "综合报告",
			"report.subtitle": "比较证据、引用来源，并明确写出仍未解决的限制。",
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
			"coverage.missing": "Missing",
			"coverage.partial": "Partial",
			"coverage.covered": "Covered",
			"coverage.conflicted": "Conflicted",
			"coverage.blocked": "Blocked",
			"verify.pass": "PASS",
			"verify.warning": "WARNING",
			"verify.fail": "FAIL",
			"evidence.title": "Source evidence",
			"evidence.empty": "The background research agent is finding sources. Saved evidence appears here automatically.",
			"evidence.open": "Open source",
			"report.title": "Synthesis report",
			"report.subtitle": "Compare evidence, cite sources, and explicitly note unresolved limitations.",
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
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/deepseek-harness/packages/extensions/deepresearch/src/client/sidebar-entry.module.css.mjs
		const css$2 = ".ZMiluW_layer{flex:none;align-items:center;width:100%;height:42px;margin:8px 0 0;display:flex;position:relative}.ZMiluW_badge{width:calc(100% + 4px);height:42px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;align-items:center;gap:8px;margin:0 -2px;padding:0 10px 0 8px;font-family:inherit;font-size:14px;display:inline-flex;overflow:hidden}.ZMiluW_badge:hover,.ZMiluW_badge[data-active]{background:var(--dsw-alias-interactive-bg-hover)}.ZMiluW_badgeLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.ZMiluW_layer.ZMiluW_rail{width:36px;height:36px;margin:0}.ZMiluW_rail .ZMiluW_badge{border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;padding:0}";
		const tagId$2 = "@deepseek-ai/dsh-deepresearch/sidebar-entry.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-deepresearch";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var sidebar_entry_module_css_default = {
			"badge": "ZMiluW_badge",
			"badgeLabel": "ZMiluW_badgeLabel",
			"layer": "ZMiluW_layer",
			"rail": "ZMiluW_rail"
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
					children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkle16, { size: 16 }), wide ? (0, react_jsx_runtime.jsx)("span", {
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
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/deepseek-harness/packages/extensions/deepresearch/src/client/views.module.css.mjs
		const css$1 = ".K_rafW_shell{box-sizing:border-box;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);flex:1;overflow:auto}.K_rafW_content,.K_rafW_workspace{width:min(1540px,100%);margin-inline:auto}.K_rafW_libraryTopBar{justify-content:flex-start;margin-bottom:8px;display:flex}.K_rafW_content{box-sizing:border-box;padding:24px clamp(18px,3vw,40px) 48px}.K_rafW_toolbar,.K_rafW_toolbarActions,.K_rafW_filters,.K_rafW_viewToggle,.K_rafW_libraryTitle,.K_rafW_workspaceHeader,.K_rafW_modalHeader,.K_rafW_modalHeading,.K_rafW_modalFooter,.K_rafW_modalFooter>div,.K_rafW_sectionHeader,.K_rafW_headerActions{align-items:center;display:flex}.K_rafW_toolbar{justify-content:space-between;gap:20px}.K_rafW_filters,.K_rafW_toolbarActions,.K_rafW_viewToggle,.K_rafW_headerActions,.K_rafW_modalFooter>div{gap:7px}.K_rafW_filters{min-width:0;overflow-x:auto}.K_rafW_primaryButton,.K_rafW_secondaryButton,.K_rafW_iconButton,.K_rafW_modalCloseButton,.K_rafW_modalCancelButton,.K_rafW_modalSubmitButton,.K_rafW_backButton,.K_rafW_deleteButton,.K_rafW_deleteText,.K_rafW_stopButton,.K_rafW_chip,.K_rafW_activeChip,.K_rafW_createCard,.K_rafW_contextCard>button,.K_rafW_stepper button{color:inherit;font:inherit;cursor:pointer;border:0}.K_rafW_primaryButton{background:var(--dsw-alias-label-primary);min-height:36px;color:var(--dsw-alias-bg-base);box-shadow:0 4px 14px color-mix(in srgb, var(--dsw-alias-label-primary) 16%, transparent);border-radius:999px;align-items:center;gap:6px;padding:0 14px;font-size:12px;font-weight:600;transition:opacity .16s,transform .16s,box-shadow .16s;display:inline-flex}.K_rafW_backButton,.K_rafW_confirmed,.K_rafW_evidenceCard a{align-items:center;gap:6px;display:inline-flex}.K_rafW_primaryButton:hover{opacity:.86}.K_rafW_primaryButton:active{transform:scale(.98)}.K_rafW_primaryButton:disabled,.K_rafW_secondaryButton:disabled,.K_rafW_iconButton:disabled,.K_rafW_modalCloseButton:disabled,.K_rafW_modalCancelButton:disabled,.K_rafW_modalSubmitButton:disabled,.K_rafW_stopButton:disabled{cursor:default;opacity:.4;pointer-events:none}.K_rafW_secondaryButton,.K_rafW_backButton{background:var(--dsw-alias-interactive-bg-hover-solid);min-height:36px;color:var(--dsw-alias-label-secondary);border-radius:999px;padding:0 13px;font-size:12px}.K_rafW_chip,.K_rafW_activeChip{min-height:34px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:999px;flex:none;padding:0 14px;font-size:12px}.K_rafW_chip:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.K_rafW_activeChip{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent);color:var(--dsw-alias-label-primary)}.K_rafW_search,.K_rafW_select,.K_rafW_input,.K_rafW_questionInput,.K_rafW_textareaSmall,.K_rafW_planEditorLarge,.K_rafW_reportEditor,.K_rafW_limitationsEditor,.K_rafW_planPane textarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;outline:none}.K_rafW_search,.K_rafW_select{border-radius:999px;height:38px}.K_rafW_search{width:min(230px,25vw);padding:0 14px}.K_rafW_select{color:var(--dsw-alias-label-secondary);padding:0 13px}.K_rafW_viewToggle{border:1px solid var(--dsw-alias-border-l1);border-radius:999px;gap:0;overflow:hidden}.K_rafW_iconButton{width:32px;height:32px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:50%;place-items:center;padding:0;transition:background-color .16s,color .16s,transform .16s;display:inline-grid}.K_rafW_viewToggle .K_rafW_iconButton{border-radius:0;width:38px;height:38px}.K_rafW_viewToggle .K_rafW_iconButton+.K_rafW_iconButton{border-left:1px solid var(--dsw-alias-border-l1)}.K_rafW_iconButton:hover,.K_rafW_iconButton[data-active=true]{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-state-business-primary)}.K_rafW_search:focus,.K_rafW_select:focus,.K_rafW_input:focus,.K_rafW_questionInput:focus,.K_rafW_textareaSmall:focus,.K_rafW_planEditorLarge:focus,.K_rafW_reportEditor:focus,.K_rafW_limitationsEditor:focus,.K_rafW_planPane textarea:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)}.K_rafW_library{margin-top:34px}.K_rafW_libraryTitle{justify-content:space-between}.K_rafW_libraryTitle h2{letter-spacing:-.025em;margin:0;font-size:24px;font-weight:600}.K_rafW_libraryTitle p{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:12px}.K_rafW_projectGrid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:22px;display:grid}.K_rafW_projectList{flex-direction:column;gap:10px;margin-top:22px;display:flex}.K_rafW_createCard{border:1px solid var(--dsw-alias-border-l1);min-height:208px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;display:flex}.K_rafW_createCard:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.K_rafW_createCard span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:54px;height:54px;color:var(--dsw-alias-state-business-primary);border-radius:50%;place-items:center;margin-bottom:14px;font-size:24px;display:grid}.K_rafW_createCard strong{font-size:14px}.K_rafW_projectCard{--card-tint:#5b8def;isolation:isolate;box-sizing:border-box;border:1px solid color-mix(in srgb, var(--card-tint) 24%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--card-tint) 15%, var(--dsw-alias-bg-base));border-radius:16px;flex-direction:column;min-height:208px;padding:18px;transition:transform .18s,border-color .18s;display:flex;position:relative;overflow:hidden}.K_rafW_projectCard:hover{border-color:color-mix(in srgb, var(--card-tint) 50%, var(--dsw-alias-border-l1));transform:translateY(-2px)}.K_rafW_projectCard[data-list]{flex-direction:row;align-items:center;gap:14px;min-height:86px}.K_rafW_cardOpen{z-index:0;cursor:pointer;background:0 0;border:0;position:absolute;inset:0}.K_rafW_cardEmoji{z-index:1;background:color-mix(in srgb, var(--card-tint) 18%, transparent);pointer-events:none;border-radius:13px;flex:none;place-items:center;width:48px;height:48px;font-size:28px;display:grid}.K_rafW_cardInfo{z-index:1;pointer-events:none;min-width:0;margin-top:auto}.K_rafW_projectCard[data-list] .K_rafW_cardInfo{flex:1;margin-top:0}.K_rafW_cardInfo h3{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;margin:12px 0 6px;font-size:16px;font-weight:600;overflow:hidden}.K_rafW_projectCard[data-list] .K_rafW_cardInfo h3{margin-top:0}.K_rafW_cardInfo p{color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:1.5;display:-webkit-box;overflow:hidden}.K_rafW_cardInfo>div{color:var(--dsw-alias-label-caption);align-items:center;gap:7px;margin-top:12px;font-size:10px;display:flex}.K_rafW_phase,.K_rafW_confirmed{background:var(--dsw-specific-tip);width:fit-content;color:var(--dsw-alias-label-tertiary);border-radius:999px;align-items:center;padding:0 8px;font-size:10px;line-height:21px;display:inline-flex}.K_rafW_confirmed{color:var(--dsw-alias-state-success-primary)}.K_rafW_deleteButton{z-index:2;width:28px;height:28px;color:var(--dsw-alias-label-caption);background:0 0;border-radius:50%;position:absolute;top:10px;right:10px}.K_rafW_deleteButton:hover,.K_rafW_deleteText:hover{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary)}.K_rafW_emptyState{border:1px dashed var(--dsw-alias-border-l1);text-align:center;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;min-height:260px;margin-top:22px;padding:28px;display:flex}.K_rafW_emptyState>span{background:var(--dsw-specific-tip);width:48px;height:48px;color:var(--dsw-alias-label-caption);border-radius:14px;place-items:center;font-size:22px;display:grid}.K_rafW_emptyState strong{margin-top:14px;font-size:13px}.K_rafW_emptyState p{color:var(--dsw-alias-label-caption);margin:6px 0 16px;font-size:12px}.K_rafW_emptyText{color:var(--dsw-alias-label-caption);text-align:center;font-size:12px}.K_rafW_error,.K_rafW_modalError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary);border-radius:10px;padding:10px 12px;font-size:12px}.K_rafW_error{margin-top:16px}.K_rafW_modalBackdrop{z-index:100;box-sizing:border-box;backdrop-filter:blur(6px);background:#00000059;place-items:center;padding:8px;animation:.18s ease-out both K_rafW_modal-backdrop-in;display:grid;position:fixed;inset:0}.K_rafW_modal{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);width:min(660px,100%);max-height:min(760px,100dvh - 16px);box-shadow:var(--dsw-shadow-lv3,0 24px 80px #00000047);transform-origin:50%;border-radius:20px;flex-direction:column;animation:.2s cubic-bezier(.2,.8,.2,1) both K_rafW_modal-content-in;display:flex;overflow:hidden}.K_rafW_modalHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;padding:16px 20px}.K_rafW_modalHeading{gap:12px;min-width:0}.K_rafW_modalHeading>span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:36px;height:36px;color:var(--dsw-alias-state-business-primary);border-radius:11px;flex:none;place-items:center;display:grid}.K_rafW_modalHeading h3{letter-spacing:-.012em;margin:0;font-size:17px;font-weight:600;line-height:24px}.K_rafW_modalHeading p{color:var(--dsw-alias-label-caption);margin:2px 0 0;font-size:12px;line-height:20px}.K_rafW_modalCloseButton{background:color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);width:32px;height:32px;color:var(--dsw-alias-label-tertiary);border-radius:50%;flex:none;place-items:center;padding:0;transition:background-color .16s,color .16s,transform .16s,box-shadow .16s;display:inline-grid;box-shadow:0 1px 2px #0000000d}.K_rafW_modalCloseButton:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);color:var(--dsw-alias-label-primary);box-shadow:0 1px 3px #0000001a}.K_rafW_modalCloseButton:active{transform:scale(.95)}.K_rafW_modalBody{min-height:0;padding:20px;overflow-y:auto}.K_rafW_fieldLabel{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:8px;font-size:11px;display:flex}.K_rafW_fieldLabel>span{letter-spacing:.08em;text-transform:uppercase;justify-content:space-between;font-weight:650;display:flex}.K_rafW_fieldLabel b{color:var(--dsw-alias-label-caption);letter-spacing:normal;text-transform:none;font-weight:400}.K_rafW_questionInput,.K_rafW_textareaSmall,.K_rafW_planEditorLarge,.K_rafW_reportEditor,.K_rafW_limitationsEditor,.K_rafW_planPane textarea{resize:vertical;border-radius:12px;width:100%;padding:11px 13px;line-height:1.55}.K_rafW_questionInput{resize:none;border-radius:16px;min-height:124px;padding:13px 15px;font-size:15px;line-height:24px;transition:border-color .16s,box-shadow .16s,background-color .16s}.K_rafW_input{border-radius:10px;width:100%;height:38px;padding:0 11px}.K_rafW_textareaSmall{min-height:82px}.K_rafW_contextCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:16px;margin-top:16px;overflow:hidden}.K_rafW_contextCard>button{text-align:left;background:0 0;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:11px;width:100%;padding:12px 14px;display:grid}.K_rafW_contextCard>button:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.K_rafW_contextCard>button>span:first-child{background:var(--dsw-alias-bg-base);width:28px;height:28px;color:var(--dsw-alias-label-tertiary);border-radius:9px;place-items:center;display:grid}.K_rafW_contextCard>button>span:nth-child(2){flex-direction:column;gap:3px;min-width:0;display:flex}.K_rafW_contextCard strong{font-size:12px}.K_rafW_contextCard small{color:var(--dsw-alias-label-caption);font-size:10px}.K_rafW_contextFields{border-top:1px solid var(--dsw-alias-border-l1);grid-template-columns:1fr 1fr;gap:14px;padding:14px;display:grid}.K_rafW_contextFields label{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:6px;font-size:11px;display:flex}.K_rafW_modalError{margin-top:14px}.K_rafW_modalFooter{border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-caption);flex:none;justify-content:space-between;gap:14px;padding:12px 20px;font-size:10px}.K_rafW_modalCancelButton,.K_rafW_modalSubmitButton{border-radius:999px;justify-content:center;align-items:center;gap:8px;height:36px;padding:0 16px;font-size:12px;transition:background-color .16s,color .16s,opacity .16s,transform .16s;display:inline-flex}.K_rafW_modalCancelButton{color:var(--dsw-alias-label-secondary);background:0 0;font-weight:500}.K_rafW_modalCancelButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.K_rafW_modalSubmitButton{background:var(--dsw-alias-label-primary);min-width:112px;color:var(--dsw-alias-bg-base);font-weight:650;box-shadow:0 1px 2px #00000014}.K_rafW_modalSubmitButton:hover{opacity:.9}.K_rafW_modalSubmitButton:active{transform:scale(.98)}.K_rafW_modalDangerButton{background:var(--dsw-alias-state-error-primary);min-width:112px;color:var(--dsw-alias-bg-base);font-weight:650;box-shadow:0 1px 2px #00000014}.K_rafW_modalDangerButton:hover{opacity:.9}.K_rafW_modalDangerButton:active{transform:scale(.98)}.K_rafW_projectLoading{min-height:220px;color:var(--dsw-alias-label-caption);justify-content:center;align-items:center;gap:10px;font-size:12px;display:flex}.K_rafW_confirmBackdrop{z-index:110;backdrop-filter:blur(10px);background:#0c0a096b;place-items:center;padding:24px;animation:.16s ease-out both K_rafW_modal-backdrop-in;display:grid;position:fixed;inset:0}.K_rafW_confirmCard{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 18%, var(--dsw-alias-border-l1));background:var(--dsw-alias-bg-base);border-radius:18px;gap:10px;width:min(380px,100%);padding:22px 22px 18px;animation:.2s cubic-bezier(.2,.8,.2,1) both K_rafW_modal-content-in;display:grid;position:relative;overflow:hidden;box-shadow:0 18px 50px #00000038}.K_rafW_confirmCard:before{background:var(--dsw-alias-state-error-primary);content:\"\";width:3px;position:absolute;inset:0 auto 0 0}.K_rafW_confirmMark{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);border-radius:11px;place-items:center;width:36px;height:36px;display:grid}.K_rafW_confirmMark:after{border:1.5px solid var(--dsw-alias-state-error-primary);background:radial-gradient(circle at 50% 32%, var(--dsw-alias-state-error-primary) 1.3px, transparent 1.5px) no-repeat, linear-gradient(var(--dsw-alias-state-error-primary), var(--dsw-alias-state-error-primary)) 50% 72% / 1.5px 5px no-repeat;content:\"\";border-radius:50%;width:14px;height:14px}.K_rafW_confirmCard h3{letter-spacing:-.02em;margin:2px 0 0;font-size:16px;font-weight:620}.K_rafW_confirmCard p{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}.K_rafW_confirmActions{justify-content:flex-end;gap:8px;margin-top:8px;display:flex}.K_rafW_confirmCancel,.K_rafW_confirmDelete{border-radius:10px;justify-content:center;align-items:center;gap:6px;height:34px;padding:0 14px;font-size:12px;font-weight:600;display:inline-flex}.K_rafW_confirmCancel{color:var(--dsw-alias-label-secondary);background:0 0}.K_rafW_confirmCancel:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.K_rafW_confirmDelete{background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-bg-base)}.K_rafW_confirmDelete:hover{opacity:.9}.K_rafW_confirmDelete:active{transform:scale(.98)}.K_rafW_confirmCancel:disabled,.K_rafW_confirmDelete:disabled{opacity:.55}@keyframes K_rafW_modal-backdrop-in{0%{opacity:0}to{opacity:1}}@keyframes K_rafW_modal-content-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.K_rafW_workspace{box-sizing:border-box;background:var(--dsw-alias-bg-base);flex-direction:column;width:100%;height:100%;min-height:0;display:flex;overflow:hidden}.K_rafW_workspaceHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;align-items:center;gap:18px;padding:14px 24px}.K_rafW_projectHeading{text-align:center;flex:1;min-width:0}.K_rafW_workspaceHeader h2{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;margin:3px 0 0;font-size:17px;font-weight:620;overflow:hidden}.K_rafW_workspaceHeader p,.K_rafW_sectionHeader p{color:var(--dsw-alias-label-caption);margin:5px 0 0;font-size:11px}.K_rafW_eyebrow{color:var(--dsw-alias-state-business-primary);letter-spacing:.12em;margin:0;font-size:10px;font-weight:700}.K_rafW_backButton{background:0 0}.K_rafW_deleteText,.K_rafW_stopButton{color:var(--dsw-alias-state-error-primary);background:0 0;border-radius:9px;padding:8px 10px}.K_rafW_progressBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;padding:10px 24px}.K_rafW_stepper{background:var(--dsw-specific-tip);border-radius:12px;gap:4px;max-width:100%;padding:4px;display:inline-flex;overflow-x:auto}.K_rafW_stepper button{color:var(--dsw-alias-label-caption);background:0 0;border-radius:8px;padding:7px 12px;font-size:11px}.K_rafW_stepper button[data-active=true]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1)}.K_rafW_stepper button:disabled{cursor:default;opacity:.48}.K_rafW_detailBody{overscroll-behavior:contain;min-height:0;padding:24px clamp(18px,3vw,32px) 32px;overflow-y:auto}.K_rafW_planPane,.K_rafW_reportPane{gap:18px;max-width:1120px;margin:0 auto;display:grid}.K_rafW_planningState{border:1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary) 15%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 4.5%, transparent);border-radius:16px;align-items:flex-start;gap:16px;min-height:180px;padding:28px 20px;display:flex}.K_rafW_planningIcon{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);width:44px;height:44px;color:var(--dsw-alias-state-business-primary);border-radius:12px;flex:none;place-items:center;display:grid}.K_rafW_planningState h3{margin:1px 0 6px;font-size:14px}.K_rafW_planningState p{color:var(--dsw-alias-label-caption);margin:0;font-size:11px;line-height:1.65}.K_rafW_planFailure{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 6%, transparent);border-radius:16px;gap:8px;padding:20px;display:grid}.K_rafW_planFailure h3,.K_rafW_planFailure p{margin:0}.K_rafW_planFailure h3{color:var(--dsw-alias-state-error-primary);font-size:14px}.K_rafW_planFailure p{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.6}.K_rafW_planFailure code{overflow-wrap:anywhere;color:var(--dsw-alias-label-caption);font:11px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace}.K_rafW_spinner{flex:none;animation:.8s linear infinite K_rafW_research-spin}.K_rafW_runningBanner{color:var(--dsw-alias-label-secondary);align-items:center;gap:9px;font-size:11px;display:flex}.K_rafW_pausedBanner,.K_rafW_readyBanner,.K_rafW_incompleteBanner{border-bottom:1px solid var(--dsw-alias-border-l1);align-items:flex-start;gap:10px;padding-bottom:18px;display:flex}.K_rafW_bannerActions{flex-wrap:wrap;gap:8px;margin-left:auto;display:flex}.K_rafW_pausedBanner>:first-child{color:#c27a4a;margin-top:1px}.K_rafW_pausedBanner strong{font-size:12px;font-weight:620;display:block}.K_rafW_pausedBanner p{color:var(--dsw-alias-label-caption);margin:3px 0 0;font-size:10px;line-height:1.55}.K_rafW_planningState .K_rafW_primaryButton{margin-top:14px}.K_rafW_readyBanner>:first-child{color:var(--dsw-alias-label-secondary);margin-top:1px}.K_rafW_incompleteBanner>:first-child{color:#b85c7a;margin-top:1px}.K_rafW_runningBanner .K_rafW_stopButton{margin-left:auto}.K_rafW_readyBanner,.K_rafW_incompleteBanner{color:var(--dsw-alias-label-secondary);align-items:flex-start;gap:10px;padding-bottom:4px;display:flex}.K_rafW_readyBanner strong,.K_rafW_incompleteBanner strong{font-size:12px;font-weight:620;display:block}.K_rafW_readyBanner p,.K_rafW_incompleteBanner p{color:var(--dsw-alias-label-caption);margin:3px 0 0;font-size:10px;line-height:1.55}.K_rafW_readyBanner svg{color:var(--dsw-alias-label-secondary);flex:none;margin-top:1px}.K_rafW_incompleteBanner svg{color:#c27a4a;flex:none;margin-top:1px}@keyframes K_rafW_research-spin{to{transform:rotate(360deg)}}.K_rafW_sectionHeader{justify-content:space-between;gap:16px}.K_rafW_sectionHeader h3{margin:0;font-size:15px}.K_rafW_headerActions .K_rafW_primaryButton,.K_rafW_headerActions .K_rafW_secondaryButton{border-radius:8px;height:36px}.K_rafW_headerActions .K_rafW_secondaryButton{border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);background:0 0}.K_rafW_headerActions .K_rafW_secondaryButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.K_rafW_formGrid{grid-template-columns:1fr 1fr;gap:12px;display:grid}.K_rafW_formGrid label{color:var(--dsw-alias-label-secondary);gap:6px;font-size:11px;display:grid}.K_rafW_planEditorLarge{min-height:210px}.K_rafW_planEyebrow{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;margin:0 0 6px;font-size:10px;font-weight:650}.K_rafW_planQuestionTitle{letter-spacing:-.02em;max-width:780px;margin:0;font-size:18px;font-weight:620;line-height:1.5}.K_rafW_planDepth{background:var(--dsw-specific-tip);color:var(--dsw-alias-label-tertiary);white-space:nowrap;border-radius:999px;flex:none;align-items:center;padding:0 10px;font-size:10px;line-height:22px;display:inline-flex}.K_rafW_goalBlock{gap:6px;display:grid}.K_rafW_goalBlock>span{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;font-size:10px;font-weight:650}.K_rafW_goalBlock textarea{min-height:72px}.K_rafW_criteriaList{color:var(--dsw-alias-label-tertiary);gap:6px;margin:0;padding-left:18px;font-size:11px;line-height:1.65;display:grid}.K_rafW_depBlock{gap:5px;display:grid}.K_rafW_depLabel{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;font-size:10px;font-weight:650}.K_rafW_depChips{flex-wrap:wrap;gap:6px;margin:0;display:flex}.K_rafW_questionCard .K_rafW_depChips{margin:6px 0 0}.K_rafW_depChip{border:1px solid var(--dsw-alias-border-l1);max-width:100%;color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;border-radius:999px;padding:0 9px;font-size:10px;line-height:20px;overflow:hidden}.K_rafW_depHint{color:var(--dsw-alias-label-caption);font-size:10px}.K_rafW_planList{border-top:1px solid var(--dsw-alias-border-l1)}.K_rafW_planListLabel{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;padding:18px 0 6px;font-size:10px;font-weight:650;display:block}.K_rafW_planQuestion{border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:38px minmax(0,1fr);gap:10px;padding:18px 0;display:grid}.K_rafW_planQuestion>span{color:var(--dsw-alias-label-caption);font-variant-numeric:tabular-nums;padding-top:8px;font-size:11px}.K_rafW_planQuestion>div{gap:10px;display:grid}.K_rafW_planQuestion textarea{resize:vertical;width:100%;min-height:62px}.K_rafW_planQuestion label{color:var(--dsw-alias-label-caption);gap:6px;font-size:10px;display:grid}.K_rafW_planQuestion label textarea{min-height:76px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1.65}.K_rafW_planQuestion small{color:var(--dsw-alias-label-caption);font-size:10px}.K_rafW_investigatePane{gap:22px;width:100%;max-width:1152px;margin:0 auto;display:grid}.K_rafW_questionHeader{border-bottom:1px solid var(--dsw-alias-border-l1);padding-bottom:18px}.K_rafW_questionHeader>span{color:var(--dsw-alias-label-caption);text-transform:uppercase;letter-spacing:.08em;font-size:10px;font-weight:600}.K_rafW_questionHeader h3{letter-spacing:-.02em;max-width:850px;margin:5px 0 0;font-size:18px;line-height:1.55}.K_rafW_questionHeader p{max-width:780px;color:var(--dsw-alias-label-tertiary);margin:7px 0 0;font-size:11px;line-height:1.65}.K_rafW_metrics{border-block:1px solid var(--dsw-alias-border-l1);grid-template-columns:repeat(3,minmax(0,1fr));display:grid}.K_rafW_metrics div{flex-direction:column-reverse;gap:3px;min-width:0;padding:12px 16px;display:flex}.K_rafW_metrics div+div{border-left:1px solid var(--dsw-alias-border-l1)}.K_rafW_metrics strong{font-variant-numeric:tabular-nums;font-size:15px}.K_rafW_metrics span{color:var(--dsw-alias-label-caption);text-overflow:ellipsis;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;font-size:9px;overflow:hidden}.K_rafW_boardGrid{border-top:1px solid var(--dsw-alias-border-l1);grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:28px;padding-top:6px;display:grid}.K_rafW_questions,.K_rafW_evidencePane,.K_rafW_scoutPane,.K_rafW_timeline{min-width:0}.K_rafW_timeline{gap:0;display:grid}.K_rafW_evidenceGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;display:grid}.K_rafW_boardHeading{color:var(--dsw-alias-label-secondary);margin:0 0 10px;font-size:12px;font-weight:620}.K_rafW_boardHeading span{color:var(--dsw-alias-label-caption);font-weight:500}.K_rafW_waitingLine,.K_rafW_gapLine{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:10px;line-height:1.55}.K_rafW_gapLine{color:#c27a4a}.K_rafW_scoutPane{max-height:min(720px,100dvh - 260px);padding-right:4px;position:sticky;top:0;overflow:auto}.K_rafW_scoutCard{border-bottom:1px solid var(--dsw-alias-border-l1);background:0 0;margin:0}.K_rafW_scoutCard[data-status=waiting]{opacity:.94}.K_rafW_scoutSummary{cursor:pointer;align-items:center;gap:10px;padding:14px 2px;list-style:none;display:flex}.K_rafW_scoutSummary::-webkit-details-marker{display:none}.K_rafW_scoutIcon{width:20px;height:20px;color:var(--dsw-alias-label-caption);flex:none;place-items:center;display:grid}.K_rafW_scoutIcon[data-status=running]{color:var(--dsw-alias-label-primary)}.K_rafW_scoutIcon[data-status=waiting],.K_rafW_scoutIcon[data-status=partial]{color:#c27a4a}.K_rafW_scoutIcon[data-status=blocked]{color:#b85c7a}.K_rafW_scoutIcon[data-status=done]{color:var(--dsw-alias-label-secondary)}.K_rafW_scoutSummaryBody{flex:1;min-width:0}.K_rafW_scoutSummaryBody strong{text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:620;display:block;overflow:hidden}.K_rafW_scoutSummaryBody small{color:var(--dsw-alias-label-caption);margin-top:3px;font-size:10px;display:block}.K_rafW_scoutStatus{color:var(--dsw-alias-label-caption);flex:none;font-size:10px;font-weight:560}.K_rafW_scoutSummary>svg{color:var(--dsw-alias-label-caption);flex:none;transition:transform .15s}.K_rafW_scoutCard[open] .K_rafW_scoutSummary>svg{transform:rotate(180deg)}.K_rafW_scoutBody{border-top:1px solid var(--dsw-alias-border-l1);gap:10px;padding:0 4px 16px 32px;display:grid}.K_rafW_scoutEvidence{gap:0;display:grid}.K_rafW_scoutHead{justify-content:space-between;align-items:flex-start;gap:10px;display:flex}.K_rafW_scoutHead strong{font-size:12px;font-weight:620;line-height:1.45}.K_rafW_scoutHead span{color:var(--dsw-alias-label-caption);flex:none;font-size:10px}.K_rafW_scoutMeta{color:var(--dsw-alias-label-tertiary);margin:0;font-size:11px;line-height:1.5}.K_rafW_scoutActivity{background:color-mix(in srgb, var(--dsw-specific-tip) 70%, transparent);color:var(--dsw-alias-label-secondary);border-radius:10px;align-items:flex-start;gap:8px;margin:0;padding:8px 10px;font-size:11px;line-height:1.5;display:flex}.K_rafW_scoutActivity[data-live=true]{border:1px solid color-mix(in srgb, var(--dsw-alias-label-primary) 12%, var(--dsw-alias-border-l1))}.K_rafW_coverage{gap:2px;margin-top:2px;display:grid}.K_rafW_coverage h5{color:var(--dsw-alias-label-caption);letter-spacing:.08em;text-transform:uppercase;margin:6px 0 0;font-size:10px;font-weight:620}.K_rafW_coverageList{gap:0;margin:0;padding:0;list-style:none;display:grid}.K_rafW_coverageItem{border-top:1px solid var(--dsw-alias-border-l1);gap:3px;padding:8px 0;display:grid}.K_rafW_coverageItem[data-active=true]{background:color-mix(in srgb, var(--dsw-specific-tip) 55%, transparent);border-radius:8px;margin-inline:-8px;padding-inline:8px}.K_rafW_coverageHead{grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:10px;display:grid}.K_rafW_coverageHead b{color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:560;line-height:1.45}.K_rafW_coverageHead span{color:var(--dsw-alias-label-caption);font-variant-numeric:tabular-nums;white-space:nowrap;font-size:10px}.K_rafW_coverageItem p,.K_rafW_coverageItem em{color:var(--dsw-alias-label-caption);margin:0;font-size:10px;font-style:normal;line-height:1.45}.K_rafW_coverageItem em[data-tone=warning],.K_rafW_coverageItem em[data-tone=gap]{color:#c27a4a}.K_rafW_coverageItem[data-status=covered] .K_rafW_coverageHead span{color:var(--dsw-alias-label-secondary)}.K_rafW_coverageItem[data-status=partial] .K_rafW_coverageHead span{color:#c27a4a}.K_rafW_coverageItem[data-status=blocked] .K_rafW_coverageHead span,.K_rafW_coverageItem[data-status=conflicted] .K_rafW_coverageHead span{color:#b85c7a}.K_rafW_toolList{gap:4px;margin:4px 0 0;padding:0;list-style:none;display:grid}.K_rafW_toolList li{color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;font-size:10px;overflow:hidden}.K_rafW_toolList b{color:var(--dsw-alias-label-secondary);margin-right:6px;font-weight:560}.K_rafW_handoff{color:var(--dsw-alias-label-caption);margin-top:6px;font-size:10px}.K_rafW_handoff summary{cursor:pointer}.K_rafW_handoff pre{white-space:pre-wrap;max-height:180px;font:inherit;margin:6px 0 0;overflow:auto}.K_rafW_questionCard{border-top:1px solid var(--dsw-alias-border-l1);padding:10px 0}.K_rafW_questionCard:last-child{border-bottom:1px solid var(--dsw-alias-border-l1)}.K_rafW_questionTitle{grid-template-columns:24px minmax(0,1fr) auto;align-items:start;gap:10px;display:grid}.K_rafW_questionTitle>span{color:var(--dsw-alias-label-caption);font-variant-numeric:tabular-nums;font-size:10px}.K_rafW_questionTitle h4{margin:0;font-size:11px;font-weight:500;line-height:1.5}.K_rafW_questionTitle strong{width:fit-content;color:var(--dsw-alias-label-caption);font-size:10px;font-weight:500;display:block}.K_rafW_questionTitle strong[data-status=covered]{color:var(--dsw-alias-label-secondary)}.K_rafW_questionTitle strong[data-status=waiting],.K_rafW_questionTitle strong[data-status=partial]{color:#c27a4a}.K_rafW_questionTitle strong[data-status=blocked],.K_rafW_questionTitle strong[data-status=failed]{color:#b85c7a}.K_rafW_questionLimits{flex-wrap:wrap;gap:6px;margin:8px 0 0 40px;display:flex}.K_rafW_questionLimits span{background:var(--dsw-specific-tip);max-width:100%;color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;border-radius:999px;padding:3px 8px;font-size:10px;overflow:hidden}.K_rafW_questionLimits span[data-status=partial]{color:#c27a4a;background:#c27a4a29}.K_rafW_questionLimits span[data-status=blocked],.K_rafW_questionLimits span[data-status=conflicted]{color:#b85c7a;background:#b85c7a29}.K_rafW_questionCard>p{color:var(--dsw-alias-label-caption);margin:7px 0 0 40px;font-size:10px}.K_rafW_questionCard ul{gap:7px;margin:12px 0 0 40px;padding:0;list-style:none;display:grid}.K_rafW_questionCard li{color:var(--dsw-alias-label-tertiary);grid-template-columns:16px minmax(0,1fr);gap:7px;font-size:11px;line-height:1.55;display:grid}.K_rafW_questionCard li>span{color:var(--dsw-alias-label-caption)}.K_rafW_questionCard li b{color:var(--dsw-alias-label-secondary);font-weight:500}.K_rafW_questionCard li p,.K_rafW_questionCard li em{margin:3px 0 0;font-size:10px;font-style:normal;display:block}.K_rafW_evidencePane{min-width:0;padding-top:6px}.K_rafW_evidencePane>h3{margin:0 0 10px;font-size:13px}.K_rafW_evidencePane>h3 span{color:var(--dsw-alias-label-caption);font-weight:500}.K_rafW_evidenceEmpty{border:1px dashed var(--dsw-alias-border-l1);text-align:center;border-radius:14px;align-content:center;place-items:center;min-height:154px;padding:18px;display:grid}.K_rafW_evidenceEmpty>span{background:var(--dsw-specific-tip);width:34px;height:34px;color:var(--dsw-alias-label-caption);border-radius:10px;place-items:center;display:grid}.K_rafW_evidenceEmpty p{max-width:300px;color:var(--dsw-alias-label-caption);margin:9px 0 0;font-size:11px;line-height:1.6}.K_rafW_evidenceCard{border-top:1px solid var(--dsw-alias-border-l1);padding:13px 0}.K_rafW_evidenceCard>div{justify-content:space-between;align-items:center;gap:8px;display:flex}.K_rafW_evidenceCard strong{text-overflow:ellipsis;white-space:nowrap;font-size:11px;overflow:hidden}.K_rafW_evidenceCard>div span{color:var(--dsw-alias-label-caption);text-transform:uppercase;font-size:9px}.K_rafW_evidenceCard p,.K_rafW_evidenceCard blockquote{color:var(--dsw-alias-label-tertiary);margin:7px 0;font-size:11px;line-height:1.6}.K_rafW_evidenceCard blockquote{border-left:2px solid var(--dsw-alias-border-l1);padding-left:9px}.K_rafW_evidenceCard a{color:var(--dsw-alias-label-secondary);font-size:10px;text-decoration:none}.K_rafW_evidenceCard a:hover{text-decoration:underline}.K_rafW_reportDocument{max-width:860px;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}.K_rafW_reportPending{min-height:160px;color:var(--dsw-alias-label-caption);align-items:center;gap:10px;font-size:12px;display:flex}.K_rafW_reportLimitations{border-top:1px solid var(--dsw-alias-border-l1);padding-top:18px}.K_rafW_reportLimitations h4{margin:0 0 8px;font-size:12px}.K_rafW_reportLimitations ul{color:var(--dsw-alias-label-tertiary);gap:6px;margin:0;padding-left:18px;font-size:11px;line-height:1.6;display:grid}.K_rafW_limitationsBoard{min-width:0}.K_rafW_investigatePane>.K_rafW_limitationsBoard,.K_rafW_reportPane .K_rafW_limitationsBoard{border-top:1px solid var(--dsw-alias-border-l1);padding-top:22px}.K_rafW_limitationsBoard h4{color:var(--dsw-alias-label-secondary);align-items:baseline;gap:8px;margin:0 0 10px;font-size:12px;font-weight:620;display:flex}.K_rafW_limitationsBoard h4 span{color:var(--dsw-alias-label-caption);font-weight:500}.K_rafW_limitationsEmpty{color:var(--dsw-alias-label-caption);margin:0;font-size:11px;line-height:1.55}.K_rafW_limitationList{gap:0;margin:0;padding:0;list-style:none;display:grid}.K_rafW_limitationItem{border-top:1px solid var(--dsw-alias-border-l1);gap:4px;padding:10px 0;display:grid}.K_rafW_limitationHead{flex-wrap:wrap;align-items:center;gap:8px;display:flex}.K_rafW_limitationHead span{color:var(--dsw-alias-label-caption);font-size:10px;line-height:1.45}.K_rafW_limitationHead b{color:var(--dsw-alias-label-tertiary);font-size:10px;font-weight:620}.K_rafW_limitationItem[data-status=partial] .K_rafW_limitationHead b{color:#c27a4a}.K_rafW_limitationItem[data-status=blocked] .K_rafW_limitationHead b,.K_rafW_limitationItem[data-status=conflicted] .K_rafW_limitationHead b{color:#b85c7a}.K_rafW_limitationItem p{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px;line-height:1.55}.K_rafW_limitationItem[data-status=partial] p{color:#8a5a32}@media (width<=900px){.K_rafW_toolbar{flex-direction:column;align-items:flex-start}.K_rafW_toolbarActions{flex-wrap:wrap;width:100%}.K_rafW_search{flex:1;width:auto}.K_rafW_boardGrid,.K_rafW_formGrid{grid-template-columns:1fr}.K_rafW_evidencePane,.K_rafW_scoutPane{max-height:none;position:static}.K_rafW_metrics{grid-template-columns:1fr}.K_rafW_metrics div+div{border-top:1px solid var(--dsw-alias-border-l1);border-left:0}.K_rafW_evidenceGrid{grid-template-columns:1fr}}@media (width<=620px){.K_rafW_content{padding:16px 12px 36px}.K_rafW_toolbarActions{align-items:stretch}.K_rafW_search{flex-basis:100%;width:100%}.K_rafW_select{flex:1}.K_rafW_projectGrid,.K_rafW_contextFields{grid-template-columns:1fr}.K_rafW_modalHeader,.K_rafW_modalBody,.K_rafW_modalFooter{padding-inline:16px}.K_rafW_modalFooter{flex-direction:column;align-items:stretch}.K_rafW_modalFooter>div{justify-content:flex-end}.K_rafW_detailBody,.K_rafW_workspaceHeader,.K_rafW_progressBar{padding-inline:14px}.K_rafW_projectHeading{text-align:left}.K_rafW_workspaceHeader .K_rafW_phase{display:none}}@media (prefers-reduced-motion:reduce){.K_rafW_projectCard{transition:none}.K_rafW_spinner,.K_rafW_modalBackdrop,.K_rafW_modal{animation:none}}";
		const tagId$1 = "@deepseek-ai/dsh-deepresearch/views.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-deepresearch";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var views_module_css_default = {
			"activeChip": "K_rafW_activeChip",
			"backButton": "K_rafW_backButton",
			"bannerActions": "K_rafW_bannerActions",
			"boardGrid": "K_rafW_boardGrid",
			"boardHeading": "K_rafW_boardHeading",
			"cardEmoji": "K_rafW_cardEmoji",
			"cardInfo": "K_rafW_cardInfo",
			"cardOpen": "K_rafW_cardOpen",
			"chip": "K_rafW_chip",
			"confirmActions": "K_rafW_confirmActions",
			"confirmBackdrop": "K_rafW_confirmBackdrop",
			"confirmCancel": "K_rafW_confirmCancel",
			"confirmCard": "K_rafW_confirmCard",
			"confirmDelete": "K_rafW_confirmDelete",
			"confirmMark": "K_rafW_confirmMark",
			"confirmed": "K_rafW_confirmed",
			"content": "K_rafW_content",
			"contextCard": "K_rafW_contextCard",
			"contextFields": "K_rafW_contextFields",
			"coverage": "K_rafW_coverage",
			"coverageHead": "K_rafW_coverageHead",
			"coverageItem": "K_rafW_coverageItem",
			"coverageList": "K_rafW_coverageList",
			"createCard": "K_rafW_createCard",
			"criteriaList": "K_rafW_criteriaList",
			"deleteButton": "K_rafW_deleteButton",
			"deleteText": "K_rafW_deleteText",
			"depBlock": "K_rafW_depBlock",
			"depChip": "K_rafW_depChip",
			"depChips": "K_rafW_depChips",
			"depHint": "K_rafW_depHint",
			"depLabel": "K_rafW_depLabel",
			"detailBody": "K_rafW_detailBody",
			"emptyState": "K_rafW_emptyState",
			"emptyText": "K_rafW_emptyText",
			"error": "K_rafW_error",
			"evidenceCard": "K_rafW_evidenceCard",
			"evidenceEmpty": "K_rafW_evidenceEmpty",
			"evidenceGrid": "K_rafW_evidenceGrid",
			"evidencePane": "K_rafW_evidencePane",
			"eyebrow": "K_rafW_eyebrow",
			"fieldLabel": "K_rafW_fieldLabel",
			"filters": "K_rafW_filters",
			"formGrid": "K_rafW_formGrid",
			"gapLine": "K_rafW_gapLine",
			"goalBlock": "K_rafW_goalBlock",
			"handoff": "K_rafW_handoff",
			"headerActions": "K_rafW_headerActions",
			"iconButton": "K_rafW_iconButton",
			"incompleteBanner": "K_rafW_incompleteBanner",
			"input": "K_rafW_input",
			"investigatePane": "K_rafW_investigatePane",
			"library": "K_rafW_library",
			"libraryTitle": "K_rafW_libraryTitle",
			"libraryTopBar": "K_rafW_libraryTopBar",
			"limitationHead": "K_rafW_limitationHead",
			"limitationItem": "K_rafW_limitationItem",
			"limitationList": "K_rafW_limitationList",
			"limitationsBoard": "K_rafW_limitationsBoard",
			"limitationsEditor": "K_rafW_limitationsEditor",
			"limitationsEmpty": "K_rafW_limitationsEmpty",
			"metrics": "K_rafW_metrics",
			"modal": "K_rafW_modal",
			"modal-backdrop-in": "K_rafW_modal-backdrop-in",
			"modal-content-in": "K_rafW_modal-content-in",
			"modalBackdrop": "K_rafW_modalBackdrop",
			"modalBody": "K_rafW_modalBody",
			"modalCancelButton": "K_rafW_modalCancelButton",
			"modalCloseButton": "K_rafW_modalCloseButton",
			"modalDangerButton": "K_rafW_modalDangerButton",
			"modalError": "K_rafW_modalError",
			"modalFooter": "K_rafW_modalFooter",
			"modalHeader": "K_rafW_modalHeader",
			"modalHeading": "K_rafW_modalHeading",
			"modalSubmitButton": "K_rafW_modalSubmitButton",
			"pausedBanner": "K_rafW_pausedBanner",
			"phase": "K_rafW_phase",
			"planDepth": "K_rafW_planDepth",
			"planEditorLarge": "K_rafW_planEditorLarge",
			"planEyebrow": "K_rafW_planEyebrow",
			"planFailure": "K_rafW_planFailure",
			"planList": "K_rafW_planList",
			"planListLabel": "K_rafW_planListLabel",
			"planPane": "K_rafW_planPane",
			"planQuestion": "K_rafW_planQuestion",
			"planQuestionTitle": "K_rafW_planQuestionTitle",
			"planningIcon": "K_rafW_planningIcon",
			"planningState": "K_rafW_planningState",
			"primaryButton": "K_rafW_primaryButton",
			"progressBar": "K_rafW_progressBar",
			"projectCard": "K_rafW_projectCard",
			"projectGrid": "K_rafW_projectGrid",
			"projectHeading": "K_rafW_projectHeading",
			"projectList": "K_rafW_projectList",
			"projectLoading": "K_rafW_projectLoading",
			"questionCard": "K_rafW_questionCard",
			"questionHeader": "K_rafW_questionHeader",
			"questionInput": "K_rafW_questionInput",
			"questionLimits": "K_rafW_questionLimits",
			"questionTitle": "K_rafW_questionTitle",
			"questions": "K_rafW_questions",
			"readyBanner": "K_rafW_readyBanner",
			"reportDocument": "K_rafW_reportDocument",
			"reportEditor": "K_rafW_reportEditor",
			"reportLimitations": "K_rafW_reportLimitations",
			"reportPane": "K_rafW_reportPane",
			"reportPending": "K_rafW_reportPending",
			"research-spin": "K_rafW_research-spin",
			"runningBanner": "K_rafW_runningBanner",
			"scoutActivity": "K_rafW_scoutActivity",
			"scoutBody": "K_rafW_scoutBody",
			"scoutCard": "K_rafW_scoutCard",
			"scoutEvidence": "K_rafW_scoutEvidence",
			"scoutHead": "K_rafW_scoutHead",
			"scoutIcon": "K_rafW_scoutIcon",
			"scoutMeta": "K_rafW_scoutMeta",
			"scoutPane": "K_rafW_scoutPane",
			"scoutStatus": "K_rafW_scoutStatus",
			"scoutSummary": "K_rafW_scoutSummary",
			"scoutSummaryBody": "K_rafW_scoutSummaryBody",
			"search": "K_rafW_search",
			"secondaryButton": "K_rafW_secondaryButton",
			"sectionHeader": "K_rafW_sectionHeader",
			"select": "K_rafW_select",
			"shell": "K_rafW_shell",
			"spinner": "K_rafW_spinner",
			"stepper": "K_rafW_stepper",
			"stopButton": "K_rafW_stopButton",
			"textareaSmall": "K_rafW_textareaSmall",
			"timeline": "K_rafW_timeline",
			"toolList": "K_rafW_toolList",
			"toolbar": "K_rafW_toolbar",
			"toolbarActions": "K_rafW_toolbarActions",
			"viewToggle": "K_rafW_viewToggle",
			"waitingLine": "K_rafW_waitingLine",
			"workspace": "K_rafW_workspace",
			"workspaceHeader": "K_rafW_workspaceHeader"
		};
		//#endregion
		//#region lib/types/client/ResearchView.js
		/** Codemini-aligned Deep Research library, plan review, and live investigation workspace. */
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
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
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
									children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { size: 15 }), t("library.back")]
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
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDataOutline16, { size: 16 })
											}), (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.iconButton,
												type: "button",
												"aria-label": t("toolbar.listView"),
												"aria-pressed": viewMode === "list",
												"data-active": viewMode === "list",
												onClick: () => {
													setViewMode("list");
												},
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 16 })
											})]
										}),
										(0, react_jsx_runtime.jsxs)("button", {
											className: views_module_css_default.primaryButton,
											type: "button",
											onClick: () => {
												setError(null);
												setComposerOpen(true);
											},
											children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 15 }), t("action.start")]
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
												children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkle16, { size: 22 })
											}),
											(0, react_jsx_runtime.jsx)("strong", { children: query === "" ? t("empty.none") : t("empty.noMatch") }),
											(0, react_jsx_runtime.jsx)("p", { children: query === "" ? t("empty.hintStart") : t("empty.hintNoMatch") }),
											query === "" ? (0, react_jsx_runtime.jsxs)("button", {
												className: views_module_css_default.primaryButton,
												type: "button",
												onClick: () => {
													setComposerOpen(true);
												},
												children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 15 }), t("action.start")]
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
											children: [(0, react_jsx_runtime.jsx)("span", { children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 22 }) }), (0, react_jsx_runtime.jsx)("strong", { children: t("action.startShort") })]
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
						children: emoji || (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkle16, { size: 25 })
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
						children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 15 })
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
									children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkle16, { size: 18 })
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
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 })
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
											(0, react_jsx_runtime.jsx)("span", { children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 15 }) }),
											(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsxs)("strong", { children: [t("composer.context"), contextCount === 0 ? "" : t("composer.contextCount", { count: contextCount })] }), (0, react_jsx_runtime.jsx)("small", { children: t("composer.contextHint") })] }),
											(0, react_jsx_runtime.jsx)("b", { children: contextOpen ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronUpOutline14, { size: 14 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { size: 14 }) })
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
								children: [busy ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
									className: views_module_css_default.spinner,
									size: 14
								}) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkle16, { size: 14 }), busy ? t("action.creating") : t("action.createPlan")]
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
								children: [busy ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
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
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { size: 15 }), t("workspace.back")]
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
							children: stopped ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 22 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
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
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline14, { size: 13 }), t("plan.confirmed")]
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
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
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
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 15 }),
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
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline14, { size: 15 }),
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
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 15 }), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: t("investigate.incompleteTitle") }), (0, react_jsx_runtime.jsx)("p", { children: t("investigate.incompleteHint") })] })]
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
							children: [(0, react_jsx_runtime.jsx)("span", { children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 17 }) }), (0, react_jsx_runtime.jsx)("p", { children: t("evidence.empty") })]
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
			return (0, react_jsx_runtime.jsxs)("details", {
				className: views_module_css_default.scoutCard,
				"data-status": scout.status,
				"data-role": scout.role,
				open: live || waiting || failed || void 0,
				children: [(0, react_jsx_runtime.jsxs)("summary", {
					className: views_module_css_default.scoutSummary,
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.scoutIcon,
							"data-status": waiting ? "waiting" : live ? "running" : failed || partial ? scout.status : "done",
							children: live ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
								className: views_module_css_default.spinner,
								size: 14
							}) : failed || partial ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 14 }) : waiting ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 14 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline14, { size: 14 })
						}),
						(0, react_jsx_runtime.jsxs)("span", {
							className: views_module_css_default.scoutSummaryBody,
							children: [(0, react_jsx_runtime.jsx)("strong", { children: title }), (0, react_jsx_runtime.jsxs)("small", { children: [
								t("investigate.scouts"),
								` · ${t("investigate.tools")} ${scout.toolsUsed}/${scout.toolsCap || 10}`,
								` · ${t("investigate.evidenceCount", { count: accepted.length })}`,
								verifying ? ` · ${t("investigate.verifying")}` : "",
								scout.activeCriterionText === "" || !live ? "" : ` · ${scout.activeCriterionText}`
							] })]
						}),
						(0, react_jsx_runtime.jsx)("span", {
							className: views_module_css_default.scoutStatus,
							children: scoutStatusLabel(scout, t)
						}),
						(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { size: 14 })
					]
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.scoutBody,
					children: [
						activity === "" ? null : (0, react_jsx_runtime.jsxs)("p", {
							className: views_module_css_default.scoutActivity,
							"data-live": live || void 0,
							children: [live ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
								className: views_module_css_default.spinner,
								size: 12
							}) : waiting ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, { size: 12 }) : null, activity]
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
								children: [(0, react_jsx_runtime.jsx)("b", { children: tool.name }), tool.detail]
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
						scout.scoutDraft.trim() === "" ? null : (0, react_jsx_runtime.jsxs)("details", {
							className: views_module_css_default.handoff,
							open: live && !verifying || void 0,
							children: [(0, react_jsx_runtime.jsx)("summary", { children: t("investigate.scoutDraft") }), (0, react_jsx_runtime.jsx)("pre", { children: scout.scoutDraft })]
						}),
						scout.evaluatorDraft.trim() === "" ? null : (0, react_jsx_runtime.jsxs)("details", {
							className: views_module_css_default.handoff,
							open: verifying || void 0,
							children: [(0, react_jsx_runtime.jsx)("summary", { children: t("investigate.evaluatorDraft") }), (0, react_jsx_runtime.jsx)("pre", { children: scout.evaluatorDraft })]
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
			const sources = evidence.sources ?? [];
			const links = sources.length > 0 ? sources.map((source) => source.url) : evidence.url === null ? [] : [evidence.url];
			return (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.evidenceCard,
				"data-status": evidence.status,
				children: [
					(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: evidence.source }), (0, react_jsx_runtime.jsx)("span", {
						"data-confidence": evidence.confidence,
						children: evidence.confidence
					})] }),
					(0, react_jsx_runtime.jsx)("p", { children: evidence.claim }),
					evidence.snippet === "" ? null : (0, react_jsx_runtime.jsx)("blockquote", { children: evidence.snippet }),
					links.map((url) => (0, react_jsx_runtime.jsxs)("a", {
						href: url,
						target: "_blank",
						rel: "noreferrer",
						children: [t("evidence.open"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { size: 12 })]
					}, url))
				]
			});
		}
		function ReportPane({ project, t, busy, onRewrite }) {
			const accepted = project.evidence.filter((item) => item.status !== "candidate" && item.status !== "rejected");
			const writing = project.phase === "writing" && project.runState === "running";
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
							streaming: writing
						})
					}) : writing ? (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.reportPending,
						role: "status",
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
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
								t("evidence.title"),
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
					}),
					(0, react_jsx_runtime.jsx)(LimitationsBoard, {
						items: boardLimitations(project, t, false),
						t,
						always: true
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
		//#region \0dsh-css:/Users/guangyangchen/Documents/Main/currentProjects/deepseek-harness/packages/extensions/deepresearch/src/client/overlay.module.css.mjs
		const css = "._1MQYBq_overlay{background:var(--dsw-alias-bg-base);pointer-events:auto;flex-direction:column;min-height:0;display:flex;position:absolute;inset:0;overflow:hidden}._1MQYBq_crash{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, var(--dsw-alias-border-l1));background:var(--dsw-alias-bg-base);border-radius:16px;gap:10px;width:min(520px,100% - 48px);margin:auto;padding:22px 24px;display:grid;box-shadow:0 18px 48px #00000029}._1MQYBq_crash h3{margin:0;font-size:16px;font-weight:620}._1MQYBq_crash p{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}._1MQYBq_crash code{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;word-break:break-word;border-radius:10px;padding:10px 12px;font-size:11px;line-height:1.45}._1MQYBq_crash button{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border:0;border-radius:10px;justify-self:start;margin-top:4px;padding:8px 14px;font-size:12px;font-weight:600}";
		const tagId = "@deepseek-ai/dsh-deepresearch/overlay.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-deepresearch";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var overlay_module_css_default = {
			"crash": "_1MQYBq_crash",
			"overlay": "_1MQYBq_overlay"
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