window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-deepresearch",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
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
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
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
		//#region ../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
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
			"criterionIds": array(string()).readonly().optional(),
			"source": string().readonly(),
			"url": string().readonly().optional(),
			"snippet": string().readonly().optional(),
			"claim": string().readonly(),
			"confidence": union([
				literal("low"),
				literal("medium"),
				literal("high")
			]).readonly()
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_complete_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"report": string().readonly(),
			"conclusions": array(string()).readonly().optional(),
			"limitations": array(string()).readonly().optional(),
			"partial": boolean().readonly().optional()
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		})]);
		const _deepseek_ai_dsh_deepresearch_deepResearch_list_parameter_0$schema = object({
			"query": string().readonly().optional(),
			"phase": union([
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		})).readonly() });
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
			"createdAt": number().readonly(),
			"updatedAt": number().readonly()
		});
		const _deepseek_ai_dsh_deepresearch_deepResearch_updateQuestion_parameter_0$schema = object({
			"id": intersection(string(), unknown()).readonly(),
			"questionId": intersection(string(), unknown()).readonly(),
			"status": union([
				literal("failed"),
				literal("pending"),
				literal("running"),
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
				"gap": string().readonly()
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
				literal("planning"),
				literal("awaiting_plan_confirm"),
				literal("investigating"),
				literal("ready_for_report"),
				literal("incomplete"),
				literal("writing"),
				literal("done"),
				literal("failed"),
				literal("aborted")
			]).readonly(),
			"planConfirmed": boolean().readonly(),
			"questions": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"text": string().readonly(),
				"dependsOn": array(intersection(string(), unknown())).readonly(),
				"status": union([
					literal("failed"),
					literal("pending"),
					literal("running"),
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
					"gap": string().readonly()
				})).readonly()
			})).readonly(),
			"evidence": array(object({
				"id": intersection(string(), unknown()).readonly(),
				"questionId": intersection(string(), unknown()).readonly(),
				"criterionIds": array(string()).readonly(),
				"source": string().readonly(),
				"url": union([literal(null), string()]).readonly(),
				"snippet": string().readonly(),
				"claim": string().readonly(),
				"confidence": union([
					literal("low"),
					literal("medium"),
					literal("high")
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
						"line": 127,
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
						"line": 159,
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
						"line": 119,
						"column": 3
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
						"line": 181,
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
						"line": 173,
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
						"line": 83,
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
						"line": 72,
						"column": 3
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
						"line": 91,
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
						"line": 106,
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
						"line": 144,
						"column": 3
					}
				}
			]
		};
		//#endregion
		//#region \0dsh-css:E:\Git Projects\test-havingautism\.tmp-plugin-fix\dsh-deepresearch\src\client\views.module.css.mjs
		const css = ".zni47G_shell{box-sizing:border-box;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);overflow:auto}.zni47G_content,.zni47G_workspace{width:min(1540px,100%);margin-inline:auto}.zni47G_content{box-sizing:border-box;padding:24px clamp(18px,3vw,40px) 48px}.zni47G_toolbar,.zni47G_toolbarActions,.zni47G_filters,.zni47G_viewToggle,.zni47G_libraryTitle,.zni47G_workspaceHeader,.zni47G_modalHeader,.zni47G_modalHeading,.zni47G_modalFooter,.zni47G_modalFooter>div,.zni47G_sectionHeader,.zni47G_headerActions{align-items:center;display:flex}.zni47G_toolbar{justify-content:space-between;gap:20px}.zni47G_filters,.zni47G_toolbarActions,.zni47G_viewToggle,.zni47G_headerActions,.zni47G_modalFooter>div{gap:7px}.zni47G_filters{min-width:0;overflow-x:auto}.zni47G_primaryButton,.zni47G_secondaryButton,.zni47G_iconButton,.zni47G_backButton,.zni47G_deleteButton,.zni47G_deleteText,.zni47G_stopButton,.zni47G_chip,.zni47G_activeChip,.zni47G_createCard,.zni47G_contextCard>button,.zni47G_stepper button{color:inherit;font:inherit;cursor:pointer;border:0}.zni47G_primaryButton{background:var(--dsw-alias-label-primary);min-height:38px;color:var(--dsw-alias-bg-base);border-radius:999px;padding:0 16px;font-size:12px;font-weight:650}.zni47G_primaryButton:hover{opacity:.9}.zni47G_primaryButton:disabled,.zni47G_secondaryButton:disabled,.zni47G_iconButton:disabled,.zni47G_stopButton:disabled{cursor:default;opacity:.5}.zni47G_secondaryButton,.zni47G_backButton{background:var(--dsw-alias-interactive-bg-hover-solid);min-height:36px;color:var(--dsw-alias-label-secondary);border-radius:999px;padding:0 13px;font-size:12px}.zni47G_chip,.zni47G_activeChip{min-height:34px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:999px;flex:none;padding:0 14px;font-size:12px}.zni47G_chip:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.zni47G_activeChip{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent);color:var(--dsw-alias-label-primary)}.zni47G_search,.zni47G_select,.zni47G_input,.zni47G_questionInput,.zni47G_textareaSmall,.zni47G_planEditorLarge,.zni47G_reportEditor,.zni47G_limitationsEditor,.zni47G_planPane textarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;outline:none}.zni47G_search,.zni47G_select{border-radius:999px;height:38px}.zni47G_search{width:min(230px,25vw);padding:0 14px}.zni47G_select{color:var(--dsw-alias-label-secondary);padding:0 13px}.zni47G_viewToggle{border:1px solid var(--dsw-alias-border-l1);border-radius:999px;gap:0;overflow:hidden}.zni47G_iconButton{width:38px;height:38px;color:var(--dsw-alias-label-tertiary);background:0 0;border-radius:10px;place-items:center;padding:0;display:inline-grid}.zni47G_viewToggle .zni47G_iconButton{border-radius:0}.zni47G_viewToggle .zni47G_iconButton+.zni47G_iconButton{border-left:1px solid var(--dsw-alias-border-l1)}.zni47G_iconButton:hover,.zni47G_iconButton[data-active=true]{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-state-business-primary)}.zni47G_search:focus,.zni47G_select:focus,.zni47G_input:focus,.zni47G_questionInput:focus,.zni47G_textareaSmall:focus,.zni47G_planEditorLarge:focus,.zni47G_reportEditor:focus,.zni47G_limitationsEditor:focus,.zni47G_planPane textarea:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)}.zni47G_library{margin-top:34px}.zni47G_libraryTitle{justify-content:space-between}.zni47G_libraryTitle h2{letter-spacing:-.025em;margin:0;font-size:24px;font-weight:600}.zni47G_libraryTitle p{color:var(--dsw-alias-label-caption);margin:6px 0 0;font-size:12px}.zni47G_projectGrid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:22px;display:grid}.zni47G_projectList{flex-direction:column;gap:10px;margin-top:22px;display:flex}.zni47G_createCard{border:1px solid var(--dsw-alias-border-l1);min-height:208px;color:var(--dsw-alias-label-secondary);background:0 0;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;display:flex}.zni47G_createCard:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.zni47G_createCard span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:54px;height:54px;color:var(--dsw-alias-state-business-primary);border-radius:50%;place-items:center;margin-bottom:14px;font-size:24px;display:grid}.zni47G_createCard strong{font-size:14px}.zni47G_projectCard{--card-tint:#5b8def;isolation:isolate;box-sizing:border-box;border:1px solid color-mix(in srgb, var(--card-tint) 24%, var(--dsw-alias-border-l1));background:color-mix(in srgb, var(--card-tint) 15%, var(--dsw-alias-bg-base));border-radius:16px;flex-direction:column;min-height:208px;padding:18px;transition:transform .18s,border-color .18s;display:flex;position:relative;overflow:hidden}.zni47G_projectCard:hover{border-color:color-mix(in srgb, var(--card-tint) 50%, var(--dsw-alias-border-l1));transform:translateY(-2px)}.zni47G_projectCard[data-list]{flex-direction:row;align-items:center;gap:14px;min-height:86px}.zni47G_cardOpen{z-index:0;cursor:pointer;background:0 0;border:0;position:absolute;inset:0}.zni47G_cardEmoji{z-index:1;background:color-mix(in srgb, var(--card-tint) 18%, transparent);pointer-events:none;border-radius:13px;flex:none;place-items:center;width:48px;height:48px;font-size:28px;display:grid}.zni47G_cardInfo{z-index:1;pointer-events:none;min-width:0;margin-top:auto}.zni47G_projectCard[data-list] .zni47G_cardInfo{flex:1;margin-top:0}.zni47G_cardInfo h3{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;margin:12px 0 6px;font-size:16px;font-weight:600;overflow:hidden}.zni47G_projectCard[data-list] .zni47G_cardInfo h3{margin-top:0}.zni47G_cardInfo p{color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:12px;line-height:1.5;display:-webkit-box;overflow:hidden}.zni47G_cardInfo>div{color:var(--dsw-alias-label-caption);align-items:center;gap:7px;margin-top:12px;font-size:10px;display:flex}.zni47G_phase,.zni47G_confirmed{background:var(--dsw-specific-tip);width:fit-content;color:var(--dsw-alias-label-tertiary);border-radius:999px;align-items:center;padding:0 8px;font-size:10px;line-height:21px;display:inline-flex}.zni47G_confirmed{color:var(--dsw-alias-state-success-primary)}.zni47G_deleteButton{z-index:2;width:28px;height:28px;color:var(--dsw-alias-label-caption);background:0 0;border-radius:50%;position:absolute;top:10px;right:10px}.zni47G_deleteButton:hover,.zni47G_deleteText:hover{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary)}.zni47G_emptyState{border:1px dashed var(--dsw-alias-border-l1);text-align:center;border-radius:16px;flex-direction:column;justify-content:center;align-items:center;min-height:260px;margin-top:22px;padding:28px;display:flex}.zni47G_emptyState>span{background:var(--dsw-specific-tip);width:48px;height:48px;color:var(--dsw-alias-label-caption);border-radius:14px;place-items:center;font-size:22px;display:grid}.zni47G_emptyState strong{margin-top:14px;font-size:13px}.zni47G_emptyState p{color:var(--dsw-alias-label-caption);margin:6px 0 16px;font-size:12px}.zni47G_emptyText{color:var(--dsw-alias-label-caption);text-align:center;font-size:12px}.zni47G_error,.zni47G_modalError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);color:var(--dsw-alias-state-error-primary);border-radius:10px;padding:10px 12px;font-size:12px}.zni47G_error{margin-top:16px}.zni47G_modalBackdrop{z-index:100;box-sizing:border-box;background:#0000008a;place-items:center;padding:8px;display:grid;position:fixed;inset:0}.zni47G_modal{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:18px;flex-direction:column;width:min(660px,100%);max-height:min(760px,100dvh - 16px);display:flex;overflow:hidden;box-shadow:0 24px 80px #00000059}.zni47G_modalHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;padding:18px 22px}.zni47G_modalHeading{gap:12px;min-width:0}.zni47G_modalHeading>span{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);width:36px;height:36px;color:var(--dsw-alias-state-business-primary);border-radius:11px;flex:none;place-items:center;display:grid}.zni47G_modalHeading h3{margin:0;font-size:16px}.zni47G_modalHeading p{color:var(--dsw-alias-label-caption);margin:4px 0 0;font-size:11px}.zni47G_modalBody{min-height:0;padding:20px 22px;overflow-y:auto}.zni47G_fieldLabel{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:8px;font-size:11px;display:flex}.zni47G_fieldLabel>span{letter-spacing:.04em;justify-content:space-between;font-weight:650;display:flex}.zni47G_fieldLabel b{color:var(--dsw-alias-label-caption);font-weight:400}.zni47G_questionInput,.zni47G_textareaSmall,.zni47G_planEditorLarge,.zni47G_reportEditor,.zni47G_limitationsEditor,.zni47G_planPane textarea{resize:vertical;border-radius:12px;width:100%;padding:11px 13px;line-height:1.55}.zni47G_questionInput{resize:none;min-height:122px;font-size:14px}.zni47G_input{border-radius:10px;width:100%;height:38px;padding:0 11px}.zni47G_textareaSmall{min-height:82px}.zni47G_contextCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:14px;margin-top:16px;overflow:hidden}.zni47G_contextCard>button{text-align:left;background:0 0;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:11px;width:100%;padding:12px 14px;display:grid}.zni47G_contextCard>button:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.zni47G_contextCard>button>span:first-child{background:var(--dsw-alias-bg-base);width:28px;height:28px;color:var(--dsw-alias-label-tertiary);border-radius:9px;place-items:center;display:grid}.zni47G_contextCard>button>span:nth-child(2){flex-direction:column;gap:3px;min-width:0;display:flex}.zni47G_contextCard strong{font-size:12px}.zni47G_contextCard small{color:var(--dsw-alias-label-caption);font-size:10px}.zni47G_contextFields{border-top:1px solid var(--dsw-alias-border-l1);grid-template-columns:1fr 1fr;gap:14px;padding:14px;display:grid}.zni47G_contextFields label{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:6px;font-size:11px;display:flex}.zni47G_modalError{margin-top:14px}.zni47G_modalFooter{border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-caption);flex:none;justify-content:space-between;gap:14px;padding:14px 22px;font-size:10px}.zni47G_workspace{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:16px;overflow:hidden}.zni47G_workspaceHeader{border-bottom:1px solid var(--dsw-alias-border-l1);justify-content:space-between;align-items:flex-start;padding:18px 22px}.zni47G_workspaceHeader h2{margin:4px 0;font-size:19px}.zni47G_workspaceHeader p,.zni47G_sectionHeader p{color:var(--dsw-alias-label-caption);margin:5px 0 0;font-size:11px}.zni47G_eyebrow{color:var(--dsw-alias-state-business-primary);letter-spacing:.12em;margin:0;font-size:10px;font-weight:700}.zni47G_backButton{background:0 0}.zni47G_deleteText,.zni47G_stopButton{color:var(--dsw-alias-state-error-primary);background:0 0;border-radius:9px;padding:8px 10px}.zni47G_stepper{border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);gap:5px;padding:10px 22px;display:flex}.zni47G_stepper button{color:var(--dsw-alias-label-caption);background:0 0;border-radius:8px;padding:7px 12px;font-size:11px}.zni47G_stepper button[data-active=true]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1)}.zni47G_detailBody{padding:22px}.zni47G_planPane,.zni47G_reportPane{gap:15px;max-width:920px;margin:0 auto;display:grid}.zni47G_sectionHeader{justify-content:space-between;gap:16px}.zni47G_sectionHeader h3{margin:0;font-size:15px}.zni47G_formGrid{grid-template-columns:1fr 1fr;gap:12px;display:grid}.zni47G_formGrid label{color:var(--dsw-alias-label-secondary);gap:6px;font-size:11px;display:grid}.zni47G_planEditorLarge{min-height:210px}.zni47G_metrics{grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:18px;display:grid}.zni47G_metrics div{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:12px;flex-direction:column-reverse;gap:4px;padding:13px;display:flex}.zni47G_metrics strong{font-size:20px}.zni47G_metrics span{color:var(--dsw-alias-label-tertiary);font-size:10px}.zni47G_boardGrid{grid-template-columns:minmax(280px,.9fr) minmax(340px,1.1fr);gap:16px;display:grid}.zni47G_questions,.zni47G_evidencePane{min-width:0}.zni47G_questionCard,.zni47G_evidenceCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:13px;padding:14px}.zni47G_questionCard+.zni47G_questionCard,.zni47G_evidenceCard+.zni47G_evidenceCard{margin-top:9px}.zni47G_questionCard strong,.zni47G_evidenceCard strong{margin-bottom:7px;font-size:13px;display:block}.zni47G_questionCard p,.zni47G_evidenceCard p{color:var(--dsw-alias-label-tertiary);margin:5px 0;font-size:12px;line-height:1.55}.zni47G_evidencePane{max-height:620px;padding-right:4px;overflow:auto}.zni47G_reportEditor{min-height:340px}.zni47G_limitationsEditor{min-height:105px}@media (width<=900px){.zni47G_toolbar{flex-direction:column;align-items:flex-start}.zni47G_toolbarActions{flex-wrap:wrap;width:100%}.zni47G_search{flex:1;width:auto}.zni47G_boardGrid,.zni47G_formGrid{grid-template-columns:1fr}.zni47G_metrics{grid-template-columns:repeat(2,1fr)}}@media (width<=620px){.zni47G_content{padding:16px 12px 36px}.zni47G_toolbarActions{align-items:stretch}.zni47G_search{flex-basis:100%;width:100%}.zni47G_select{flex:1}.zni47G_projectGrid,.zni47G_contextFields{grid-template-columns:1fr}.zni47G_modalHeader,.zni47G_modalBody,.zni47G_modalFooter{padding-inline:16px}.zni47G_modalFooter{flex-direction:column;align-items:stretch}.zni47G_modalFooter>div{justify-content:flex-end}.zni47G_detailBody,.zni47G_workspaceHeader,.zni47G_stepper{padding-inline:14px}}@media (prefers-reduced-motion:reduce){.zni47G_projectCard{transition:none}}";
		const tagId = "@deepseek-ai/dsh-deepresearch/views.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-deepresearch";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var views_module_css_default = {
			"toolbarActions": "zni47G_toolbarActions",
			"textareaSmall": "zni47G_textareaSmall",
			"content": "zni47G_content",
			"cardOpen": "zni47G_cardOpen",
			"modal": "zni47G_modal",
			"metrics": "zni47G_metrics",
			"emptyState": "zni47G_emptyState",
			"chip": "zni47G_chip",
			"workspaceHeader": "zni47G_workspaceHeader",
			"modalHeader": "zni47G_modalHeader",
			"confirmed": "zni47G_confirmed",
			"input": "zni47G_input",
			"fieldLabel": "zni47G_fieldLabel",
			"viewToggle": "zni47G_viewToggle",
			"contextCard": "zni47G_contextCard",
			"questions": "zni47G_questions",
			"emptyText": "zni47G_emptyText",
			"modalHeading": "zni47G_modalHeading",
			"planPane": "zni47G_planPane",
			"eyebrow": "zni47G_eyebrow",
			"workspace": "zni47G_workspace",
			"error": "zni47G_error",
			"modalBody": "zni47G_modalBody",
			"planEditorLarge": "zni47G_planEditorLarge",
			"select": "zni47G_select",
			"stepper": "zni47G_stepper",
			"modalBackdrop": "zni47G_modalBackdrop",
			"formGrid": "zni47G_formGrid",
			"deleteText": "zni47G_deleteText",
			"deleteButton": "zni47G_deleteButton",
			"limitationsEditor": "zni47G_limitationsEditor",
			"projectCard": "zni47G_projectCard",
			"evidenceCard": "zni47G_evidenceCard",
			"sectionHeader": "zni47G_sectionHeader",
			"toolbar": "zni47G_toolbar",
			"questionInput": "zni47G_questionInput",
			"activeChip": "zni47G_activeChip",
			"cardEmoji": "zni47G_cardEmoji",
			"search": "zni47G_search",
			"library": "zni47G_library",
			"backButton": "zni47G_backButton",
			"createCard": "zni47G_createCard",
			"cardInfo": "zni47G_cardInfo",
			"detailBody": "zni47G_detailBody",
			"reportPane": "zni47G_reportPane",
			"secondaryButton": "zni47G_secondaryButton",
			"filters": "zni47G_filters",
			"primaryButton": "zni47G_primaryButton",
			"phase": "zni47G_phase",
			"contextFields": "zni47G_contextFields",
			"questionCard": "zni47G_questionCard",
			"boardGrid": "zni47G_boardGrid",
			"evidencePane": "zni47G_evidencePane",
			"reportEditor": "zni47G_reportEditor",
			"modalFooter": "zni47G_modalFooter",
			"libraryTitle": "zni47G_libraryTitle",
			"projectList": "zni47G_projectList",
			"modalError": "zni47G_modalError",
			"projectGrid": "zni47G_projectGrid",
			"iconButton": "zni47G_iconButton",
			"shell": "zni47G_shell",
			"headerActions": "zni47G_headerActions",
			"stopButton": "zni47G_stopButton"
		};
		//#endregion
		//#region src/client/ResearchView.tsx
		/** Codemini-aligned Deep Research library and evidence workspace. */
		/** Render the research library, editable plan, investigation evidence, and report. */
		function ResearchView(api) {
			const [projects, setProjects] = (0, react.useState)([]);
			const [selected, setSelected] = (0, react.useState)(null);
			const [query, setQuery] = (0, react.useState)("");
			const [filter, setFilter] = (0, react.useState)("all");
			const [viewMode, setViewMode] = (0, react.useState)("grid");
			const [sort, setSort] = (0, react.useState)("recent");
			const [composerOpen, setComposerOpen] = (0, react.useState)(false);
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const refresh = (0, react.useCallback)(async (nextQuery) => {
				setError(null);
				try {
					const next = await api.list(nextQuery);
					setProjects(next);
					setSelected((current) => current === null ? null : next.find((item) => item.id === current.id) ?? current);
				} catch (cause) {
					setError(messageOf(cause));
				}
			}, [api]);
			(0, react.useEffect)(() => {
				const timer = window.setTimeout(() => {
					refresh(query);
				}, query === "" ? 0 : 250);
				return () => {
					window.clearTimeout(timer);
				};
			}, [query, refresh]);
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
			const updateSelected = (project) => {
				setSelected(project);
				setProjects((current) => current.map((item) => item.id === project.id ? project : item));
			};
			if (selected !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ResearchWorkspace, {
				project: selected,
				api,
				onChange: updateSelected,
				onBack: () => {
					setSelected(null);
				},
				onDelete: async () => {
					await api.delete(selected.id);
					setSelected(null);
					await refresh(query);
				},
				error,
				setError
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.shell,
				"data-conversation-composer-overlay": "",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: views_module_css_default.content,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.toolbar,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: views_module_css_default.filters,
							"aria-label": "研究状态筛选",
							children: [
								["all", "全部"],
								["planning", "计划中"],
								["investigating", "调查中"],
								["done", "已完成"]
							].map(([id, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: filter === id ? views_module_css_default.activeChip : views_module_css_default.chip,
								type: "button",
								"aria-current": filter === id ? "page" : void 0,
								onClick: () => {
									setFilter(id);
								},
								children: label
							}, id))
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.toolbarActions,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: views_module_css_default.search,
									value: query,
									onChange: (event) => {
										setQuery(event.target.value);
									},
									placeholder: "搜索研究",
									"aria-label": "搜索研究"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									className: views_module_css_default.select,
									value: sort,
									onChange: (event) => {
										setSort(event.target.value);
									},
									"aria-label": "研究排序",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "recent",
										children: "最近更新"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "title",
										children: "按标题"
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.viewToggle,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.iconButton,
										type: "button",
										"aria-label": "网格视图",
										"aria-pressed": viewMode === "grid",
										"data-active": viewMode === "grid",
										onClick: () => {
											setViewMode("grid");
										},
										children: "▦"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.iconButton,
										type: "button",
										"aria-label": "列表视图",
										"aria-pressed": viewMode === "list",
										"data-active": viewMode === "list",
										onClick: () => {
											setViewMode("list");
										},
										children: "☷"
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									className: views_module_css_default.primaryButton,
									type: "button",
									onClick: () => {
										setError(null);
										setComposerOpen(true);
									},
									children: "＋ 发起研究"
								})
							]
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: views_module_css_default.library,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("header", {
								className: views_module_css_default.libraryTitle,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "研究资料库" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [visible.length, " 个研究项目"] })] })
							}),
							error === null || composerOpen ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: views_module_css_default.error,
								role: "alert",
								children: error
							}),
							visible.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.emptyState,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "⚡"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: query === "" ? "还没有研究项目" : "没有匹配的研究项目" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: query === "" ? "从一个值得深入的问题开始。" : "试试其他关键词或清除搜索条件。" }),
									query === "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.primaryButton,
										type: "button",
										onClick: () => {
											setComposerOpen(true);
										},
										children: "＋ 发起研究"
									}) : null
								]
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: viewMode === "grid" ? views_module_css_default.projectGrid : views_module_css_default.projectList,
								children: [viewMode === "grid" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									className: views_module_css_default.createCard,
									type: "button",
									onClick: () => {
										setComposerOpen(true);
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "＋" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "发起研究" })]
								}) : null, visible.map((project, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProjectCard, {
									project,
									index,
									list: viewMode === "list",
									onOpen: () => {
										setSelected(project);
									},
									onDelete: () => {
										api.delete(project.id).then(() => refresh(query), (cause) => {
											setError(messageOf(cause));
										});
									}
								}, project.id))]
							})
						]
					})]
				}), composerOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ResearchComposer, {
					busy,
					error,
					setBusy,
					onClose: () => {
						if (!busy) setComposerOpen(false);
					},
					onCreate: async (request) => {
						const project = await api.start(request);
						setComposerOpen(false);
						await refresh(query);
						setSelected(project);
					},
					setError
				}) : null]
			});
		}
		function ProjectCard({ project, index, list, onOpen, onDelete }) {
			const [emoji, title] = splitEmoji(project.title);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: views_module_css_default.projectCard,
				"data-list": list || void 0,
				style: { "--card-tint": CARD_TONES[index % CARD_TONES.length] },
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.cardOpen,
						type: "button",
						onClick: onOpen,
						"aria-label": `打开研究：${project.title}`
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.cardEmoji,
						children: emoji || "⚡"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.cardInfo,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: title }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: project.goal || project.question }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: views_module_css_default.phase,
								"data-phase": project.phase,
								children: phaseLabel(project.phase)
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								project.evidence.length,
								" 条证据 · ",
								formatDate(project.updatedAt)
							] })] })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: views_module_css_default.deleteButton,
						type: "button",
						onClick: (event) => {
							event.stopPropagation();
							onDelete();
						},
						children: "×"
					})
				]
			});
		}
		function ResearchComposer({ busy, error, setBusy, onClose, onCreate, setError }) {
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
					questions: initialPlan(trimmed)
				}).catch((cause) => {
					setError(messageOf(cause));
				}).finally(() => {
					setBusy(false);
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: views_module_css_default.modalBackdrop,
				role: "presentation",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					className: views_module_css_default.modal,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "new-research-title",
					onSubmit: submit,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalHeader,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.modalHeading,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "⚡"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
									id: "new-research-title",
									children: "发起深度研究"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "描述问题，先生成一份可审查、可修改的研究计划。" })] })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.iconButton,
								type: "button",
								"aria-label": "关闭",
								disabled: busy,
								onClick: onClose,
								children: "×"
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalBody,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: views_module_css_default.fieldLabel,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["研究问题 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "必填" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										autoFocus: true,
										className: views_module_css_default.questionInput,
										value: question,
										onChange: (event) => {
											setQuestion(event.target.value);
										},
										placeholder: "你想深入研究什么？"
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.contextCard,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-expanded": contextOpen,
										onClick: () => {
											setContextOpen((value) => !value);
										},
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "◎" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: ["添加研究背景", contextCount === 0 ? "" : ` · ${contextCount}`] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "目标、深度、限制和已有材料" })] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: contextOpen ? "⌃" : "⌄" })
										]
									}), contextOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.contextFields,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["研究目标", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												className: views_module_css_default.input,
												value: goal,
												onChange: (event) => {
													setGoal(event.target.value);
												},
												placeholder: "希望最终得到什么"
											})] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["研究深度", /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
												className: views_module_css_default.input,
												value: depth,
												onChange: (event) => {
													setDepth(event.target.value);
												},
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "quick",
														children: "快速"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "standard",
														children: "标准"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "deep",
														children: "深入"
													})
												]
											})] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["限制与要求", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
												className: views_module_css_default.textareaSmall,
												value: constraints,
												onChange: (event) => {
													setConstraints(event.target.value);
												},
												placeholder: "时间、地域、来源或输出约束"
											})] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["已有材料", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
												className: views_module_css_default.textareaSmall,
												value: seedText,
												onChange: (event) => {
													setSeedText(event.target.value);
												},
												placeholder: "粘贴已有笔记或摘录（可选）"
											})] })
										]
									}) : null]
								}),
								error === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.modalError,
									role: "alert",
									children: error
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: views_module_css_default.modalFooter,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "计划 → 调查 → 报告" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.secondaryButton,
								type: "button",
								disabled: busy,
								onClick: onClose,
								children: "取消"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.primaryButton,
								type: "submit",
								disabled: busy || question.trim() === "",
								children: busy ? "创建中…" : "创建研究计划"
							})] })]
						})
					]
				})
			});
		}
		function ResearchWorkspace({ project, api, onChange, onBack, onDelete, error, setError }) {
			const [focus, setFocus] = (0, react.useState)(stepFor(project.phase));
			const [goal, setGoal] = (0, react.useState)(project.goal);
			const [constraints, setConstraints] = (0, react.useState)(project.constraints);
			const [plan, setPlan] = (0, react.useState)(formatPlan(project));
			const [report, setReport] = (0, react.useState)(project.report ?? "");
			const [limitations, setLimitations] = (0, react.useState)(project.limitations.join("\n"));
			(0, react.useEffect)(() => {
				setFocus(stepFor(project.phase));
				setGoal(project.goal);
				setConstraints(project.constraints);
				setPlan(formatPlan(project));
				setReport(project.report ?? "");
				setLimitations(project.limitations.join("\n"));
			}, [project]);
			const action = async (operation) => {
				setError(null);
				try {
					onChange(await operation());
				} catch (cause) {
					setError(messageOf(cause));
				}
			};
			const savePlan = () => {
				action(() => api.updatePlan({
					id: project.id,
					goal,
					constraints,
					depth: project.depth,
					questions: parsePlan(plan)
				}));
			};
			const complete = (partial) => {
				action(() => api.complete({
					id: project.id,
					report,
					limitations: limitations.split("\n").map((value) => value.trim()).filter(Boolean),
					partial
				}));
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: views_module_css_default.workspace,
				"data-conversation-composer-overlay": "",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: views_module_css_default.workspaceHeader,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: views_module_css_default.backButton,
								type: "button",
								onClick: onBack,
								children: "← 深度研究"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: views_module_css_default.eyebrow,
								children: "RESEARCH PROJECT"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: project.title })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.headerActions,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: views_module_css_default.phase,
									"data-phase": project.phase,
									children: phaseLabel(project.phase)
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									className: views_module_css_default.deleteText,
									type: "button",
									onClick: () => {
										onDelete();
									},
									children: "删除"
								})]
							})
						]
					}),
					error === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: views_module_css_default.error,
						children: error
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
						className: views_module_css_default.stepper,
						children: [
							["plan", "1 计划"],
							["investigate", "2 调查"],
							["report", "3 报告"]
						].map(([id, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							"data-active": focus === id,
							onClick: () => {
								setFocus(id);
							},
							children: label
						}, id))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: views_module_css_default.detailBody,
						children: [
							focus === "plan" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: views_module_css_default.planPane,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.sectionHeader,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "研究计划" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "确认后，模型按子问题和验收标准组合 Web / subagent 调查。" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: views_module_css_default.headerActions,
											children: project.planConfirmed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: views_module_css_default.confirmed,
												children: "✓ 已确认"
											}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.secondaryButton,
												type: "button",
												onClick: savePlan,
												children: "保存修改"
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.primaryButton,
												type: "button",
												onClick: () => {
													action(() => api.confirmPlan(project.id));
												},
												children: "确认并开始"
											})] })
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.formGrid,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["研究目标", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
											value: goal,
											onChange: (event) => {
												setGoal(event.target.value);
											},
											disabled: project.planConfirmed
										})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["约束", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
											value: constraints,
											onChange: (event) => {
												setConstraints(event.target.value);
											},
											disabled: project.planConfirmed
										})] })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										className: views_module_css_default.fieldLabel,
										children: "子问题与验收标准"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										className: views_module_css_default.planEditorLarge,
										value: plan,
										onChange: (event) => {
											setPlan(event.target.value);
										},
										disabled: project.planConfirmed
									})
								]
							}) : null,
							focus === "investigate" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.metrics,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
										label: "子问题",
										value: `${project.questions.filter((q) => q.status === "covered").length}/${project.questions.length}`
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
										label: "证据",
										value: String(project.evidence.length)
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
										label: "检索预算",
										value: `${project.budget.searchesUsed}/${project.budget.maxSearches}`
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
										label: "抓取预算",
										value: `${project.budget.fetchesUsed}/${project.budget.maxFetches}`
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: views_module_css_default.boardGrid,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: views_module_css_default.sectionHeader,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "调查看板" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "覆盖度来自模型对已保存证据的显式审查。" })] }), project.phase === "investigating" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: views_module_css_default.stopButton,
										type: "button",
										onClick: () => {
											action(() => api.fail(project.id, "用户停止了调查。", true));
										},
										children: "停止调查"
									}) : null]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: views_module_css_default.questions,
									children: project.questions.map((question, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
										className: views_module_css_default.questionCard,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: question.text }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
													"data-status": question.status,
													children: statusLabel(question.status)
												})
											] }),
											question.dependsOn.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
												"依赖 ",
												question.dependsOn.length,
												" 个上游问题"
											] }) : null,
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: question.criteria.map((criterion) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
												"data-status": criterion.status,
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: criterion.status === "covered" ? "✓" : "○" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: criterion.text }),
													criterion.summary ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: criterion.summary }) : null,
													criterion.gap ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: criterion.gap }) : null
												] })]
											}, criterion.id)) })
										]
									}, question.id))
								})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
									className: views_module_css_default.evidencePane,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("h3", { children: ["来源证据 ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: project.evidence.length })] }), project.evidence.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: views_module_css_default.emptyText,
										children: "让模型使用 Web 工具调查，并调用 deep_research_add_evidence 保存来源。"
									}) : project.evidence.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
										className: views_module_css_default.evidenceCard,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: item.source }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												"data-confidence": item.confidence,
												children: item.confidence
											})] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: item.claim }),
											item.snippet ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("blockquote", { children: item.snippet }) : null,
											item.url === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
												href: item.url,
												target: "_blank",
												rel: "noreferrer",
												children: "打开来源 ↗"
											})
										]
									}, item.id))]
								})]
							})] }) : null,
							focus === "report" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: views_module_css_default.reportPane,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: views_module_css_default.sectionHeader,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "综合报告" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "比较证据、引用来源，并明确写出仍未解决的限制。" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: views_module_css_default.headerActions,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.secondaryButton,
												type: "button",
												onClick: () => {
													complete(true);
												},
												children: "保存为部分完成"
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												className: views_module_css_default.primaryButton,
												type: "button",
												onClick: () => {
													complete(false);
												},
												children: "完成研究"
											})]
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										className: views_module_css_default.reportEditor,
										value: report,
										onChange: (event) => {
											setReport(event.target.value);
										},
										placeholder: "Markdown 研究报告…"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										className: views_module_css_default.fieldLabel,
										children: "限制与未解决问题"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
										className: views_module_css_default.limitationsEditor,
										value: limitations,
										onChange: (event) => {
											setLimitations(event.target.value);
										},
										placeholder: "每行一项限制"
									})
								]
							}) : null
						]
					})
				]
			});
		}
		function Metric({ label, value }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: value })] });
		}
		const CARD_TONES = [
			"#5b8def",
			"#3d9b8f",
			"#c27a4a",
			"#8b6bc9",
			"#4a9b6e",
			"#b85c7a"
		];
		function initialPlan(question) {
			return [
				{
					text: `界定核心问题：${question}`,
					criteria: ["明确回答范围、关键概念和判定标准"]
				},
				{
					text: "检索并筛选权威来源",
					criteria: ["至少获得两个相互独立且可追溯的来源"]
				},
				{
					text: "交叉验证关键结论",
					criteria: ["识别一致结论、冲突信息和证据缺口"],
					dependsOn: [1]
				},
				{
					text: "综合证据并形成报告",
					criteria: ["引用来源并说明限制与不确定性"],
					dependsOn: [0, 2]
				}
			];
		}
		function parsePlan(value) {
			return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
				const [text = "", criteria = ""] = line.split("|", 2);
				return {
					text: text.trim(),
					criteria: criteria.split(";").map((item) => item.trim()).filter(Boolean)
				};
			}).filter((item) => item.text !== "" && item.criteria.length > 0);
		}
		function formatPlan(project) {
			return project.questions.map((question) => `${question.text} | ${question.criteria.map((item) => item.text).join("; ")}`).join("\n");
		}
		function stepFor(phase) {
			return ["planning", "awaiting_plan_confirm"].includes(phase) ? "plan" : [
				"ready_for_report",
				"writing",
				"done",
				"incomplete"
			].includes(phase) ? "report" : "investigate";
		}
		function phaseLabel(phase) {
			return {
				planning: "计划中",
				awaiting_plan_confirm: "待确认",
				investigating: "调查中",
				ready_for_report: "可写报告",
				incomplete: "部分完成",
				writing: "撰写中",
				done: "已完成",
				failed: "失败",
				aborted: "已停止"
			}[phase];
		}
		function statusLabel(status) {
			return {
				pending: "待处理",
				running: "调查中",
				covered: "已覆盖",
				partial: "部分覆盖",
				blocked: "受阻",
				failed: "失败"
			}[status];
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
		//#region src/client/index.ts
		/** Required services: the typed Remote client and conversation-view registry. */
		const inject = ["remote", "slots"];
		/** Return one successful Remote value or surface the carrier failure. */
		function remoteValue(operation, result) {
			if (!result.ok) throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`);
			return result.value;
		}
		/**
		* Mount the deep-research Remote namespace and its conversation view.
		* @param ctx - Web client root carrying Remote and slot services.
		* @returns disposer after the namespace is ready.
		*/
		async function apply(ctx) {
			const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			const view = ctx.inject(["remote.deepResearch"], (remoteCtx) => {
				remoteCtx.slots.inject("conversation.view", () => remoteCtx.slots.register({
					name: "conversation.view",
					id: "deepresearch",
					order: 30,
					label: () => "深度研究",
					inject: () => ({
						list: async (query) => remoteValue("deepResearch.list", await remoteCtx.remote.deepResearch.list({ ...query === "" ? {} : { query } })).projects,
						get: async (id) => remoteValue("deepResearch.get", await remoteCtx.remote.deepResearch.get({ id })),
						start: async (request) => remoteValue("deepResearch.start", await remoteCtx.remote.deepResearch.start(request)),
						updatePlan: async (request) => remoteValue("deepResearch.updatePlan", await remoteCtx.remote.deepResearch.updatePlan(request)),
						confirmPlan: async (id) => remoteValue("deepResearch.confirmPlan", await remoteCtx.remote.deepResearch.confirmPlan({ id })),
						complete: async (request) => remoteValue("deepResearch.complete", await remoteCtx.remote.deepResearch.complete(request)),
						fail: async (id, reason, aborted) => remoteValue("deepResearch.fail", await remoteCtx.remote.deepResearch.fail({
							id,
							reason,
							aborted
						})),
						delete: async (id) => remoteValue("deepResearch.delete", await remoteCtx.remote.deepResearch.delete({ id }))
					})
				}, ResearchView));
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