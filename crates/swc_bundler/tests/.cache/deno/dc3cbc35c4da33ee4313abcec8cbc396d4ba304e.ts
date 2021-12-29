// Loaded from https://deno.land/std@0.114.0/node/util.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
import { promisify } from "./_util/_util_promisify.ts";
import { callbackify } from "./_util/_util_callbackify.ts";
import { ERR_INVALID_ARG_TYPE, ERR_OUT_OF_RANGE, errorMap } from "./_errors.ts";
import * as types from "./_util/_util_types.ts";
export { callbackify, promisify, types };

const NumberIsSafeInteger = Number.isSafeInteger;

const DEFAULT_INSPECT_OPTIONS = {
  showHidden: false,
  depth: 2,
  colors: false,
  customInspect: true,
  showProxy: false,
  maxArrayLength: 100,
  maxStringLength: Infinity,
  breakLength: 80,
  compact: 3,
  sorted: false,
  getters: false,
};

inspect.defaultOptions = DEFAULT_INSPECT_OPTIONS;
inspect.custom = Symbol.for("nodejs.util.inspect.custom");

// TODO(schwarzkopfb): make it in-line with Node's implementation
// Ref: https://nodejs.org/dist/latest-v14.x/docs/api/util.html#util_util_inspect_object_options
// deno-lint-ignore no-explicit-any
export function inspect(object: unknown, ...opts: any): string {
  // In Node.js, strings should be enclosed in single quotes.
  // TODO(uki00a): Strings in objects and arrays should also be enclosed in single quotes.
  if (typeof object === "string" && !object.includes("'")) {
    return `'${object}'`;
  }
  opts = { ...DEFAULT_INSPECT_OPTIONS, ...opts };
  return Deno.inspect(object, {
    depth: opts.depth,
    iterableLimit: opts.maxArrayLength,
    compact: !!opts.compact,
    sorted: !!opts.sorted,
    showProxy: !!opts.showProxy,
  });
}

/** @deprecated - use `Array.isArray()` instead. */
export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

/** @deprecated - use `typeof value === "boolean" || value instanceof Boolean` instead. */
export function isBoolean(value: unknown): boolean {
  return typeof value === "boolean" || value instanceof Boolean;
}

/** @deprecated - use `value === null` instead. */
export function isNull(value: unknown): boolean {
  return value === null;
}

/** @deprecated - use `value === null || value === undefined` instead. */
export function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

/** @deprecated - use `typeof value === "number" || value instanceof Number` instead. */
export function isNumber(value: unknown): boolean {
  return typeof value === "number" || value instanceof Number;
}

/** @deprecated - use `typeof value === "string" || value instanceof String` instead. */
export function isString(value: unknown): boolean {
  return typeof value === "string" || value instanceof String;
}

/** @deprecated - use `typeof value === "symbol"` instead. */
export function isSymbol(value: unknown): boolean {
  return typeof value === "symbol";
}

/** @deprecated - use `value === undefined` instead. */
export function isUndefined(value: unknown): boolean {
  return value === undefined;
}

/** @deprecated - use `value !== null && typeof value === "object"` instead. */
export function isObject(value: unknown): boolean {
  return value !== null && typeof value === "object";
}

/** @deprecated - use `e instanceof Error` instead. */
export function isError(e: unknown): boolean {
  return e instanceof Error;
}

/** @deprecated - use `typeof value === "function"` instead. */
export function isFunction(value: unknown): boolean {
  return typeof value === "function";
}

/** @deprecated - use `value instanceof RegExp` instead. */
export function isRegExp(value: unknown): boolean {
  return value instanceof RegExp;
}

/** @deprecated - use `value === null || (typeof value !== "object" && typeof value !== "function")` instead. */
export function isPrimitive(value: unknown): boolean {
  return (
    value === null || (typeof value !== "object" && typeof value !== "function")
  );
}

/**
 * Returns a system error name from an error code number.
 * @param code error code number
 */
export function getSystemErrorName(code: number): string | undefined {
  if (typeof code !== "number") {
    throw new ERR_INVALID_ARG_TYPE("err", "number", code);
  }
  if (code >= 0 || !NumberIsSafeInteger(code)) {
    throw new ERR_OUT_OF_RANGE("err", "a negative integer", code);
  }
  return errorMap.get(code)?.[0];
}

/**
 * https://nodejs.org/api/util.html#util_util_deprecate_fn_msg_code
 * @param _code This implementation of deprecate won't apply the deprecation code
 */
// deno-lint-ignore no-explicit-any
export function deprecate<T extends (...args: any) => any>(
  fn: T,
  msg: string,
  _code?: string,
): (...args: Parameters<T>) => ReturnType<T> {
  return function (...args) {
    console.warn(msg);
    return fn.apply(undefined, args);
  };
}

function toReplace(specifier: string, value: unknown): string {
  if (specifier === "%s") {
    if (typeof value === "string" || value instanceof String) {
      return value as string;
    } else return Deno.inspect(value, { depth: 1 });
  }
  if (specifier === "%d") {
    if (typeof value === "bigint") {
      return value + "n";
    }
    return Number(value).toString();
  }
  if (specifier === "%i") {
    if (typeof value === "bigint") {
      return value + "n";
    }
    return parseInt(value as string).toString();
  }
  if (specifier === "%f") {
    return parseFloat(value as string).toString();
  }
  if (specifier === "%j") {
    try {
      return JSON.stringify(value);
    } catch (e) {
      // nodeJS => 'cyclic object value' , deno => 'Converting circular structure to JSON ...'
      // ref: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify>
      if (e instanceof TypeError && e.message.match(/cyclic|circular/)) {
        return "[Circular]";
      } else throw e;
    }
  }
  if (specifier === "%o") {
    return Deno.inspect(value, { showHidden: true, showProxy: true });
  }
  if (specifier === "%O") {
    return Deno.inspect(value);
  }
  if (specifier === "%c") {
    return "";
  }
  return "";
}

// ref: <https://nodejs.org/docs/latest-v16.x/api/console.html#console_console_log_data_args>
// ref: <https://nodejs.org/docs/latest-v16.x/api/util.html#util_util_format_format_args>
// modified from <https://deno.land/std@0.105.0/node/util.ts#L247-L266>
export function format(...args: unknown[]) {
  const replacement: [number, string][] = [];
  const formatSpecifierRx = /%(s|d|i|f|j|o|O|c|%)/g;
  const hasFormatTemplate = args.length > 0 &&
    (typeof args[0] === "string" || args[0] instanceof String);
  const formatTemplate = hasFormatTemplate ? (args[0] as string) : "";
  let i = hasFormatTemplate ? 1 : 0;
  let arr: RegExpExecArray | null = null;
  let done = false;
  while ((arr = formatSpecifierRx.exec(formatTemplate)) !== null && !done) {
    if (arr[0] === "%%") {
      replacement.push([arr["index"], "%"]);
    } else if (i < args.length) {
      replacement.push([arr["index"], toReplace(arr[0], args[i])]);
      i++;
    } else done = true;
  }
  const lastArgUsed = i;
  let result = "";
  let last = 0;
  for (let i = 0; i < replacement.length; i++) {
    const item = replacement[i];
    result += formatTemplate.slice(last, item[0]);
    result += item[1];
    last = item[0] + 2;
  }
  result += formatTemplate.slice(last);
  for (let i = lastArgUsed; i < args.length; i++) {
    if (i > 0) result += " ";
    if (typeof args[i] === "string") {
      result += args[i];
    } else result += Deno.inspect(args[i], { colors: true });
  }
  return result;
}
/**
 * https://nodejs.org/api/util.html#util_util_inherits_constructor_superconstructor
 * @param ctor Constructor function which needs to inherit the prototype.
 * @param superCtor Constructor function to inherit prototype from.
 */
export function inherits<T, U>(
  ctor: new (...args: unknown[]) => T,
  superCtor: new (...args: unknown[]) => U,
) {
  if (ctor === undefined || ctor === null) {
    throw new ERR_INVALID_ARG_TYPE("ctor", "Function", ctor);
  }

  if (superCtor === undefined || superCtor === null) {
    throw new ERR_INVALID_ARG_TYPE("superCtor", "Function", superCtor);
  }

  if (superCtor.prototype === undefined) {
    throw new ERR_INVALID_ARG_TYPE(
      "superCtor.prototype",
      "Object",
      superCtor.prototype,
    );
  }
  Object.defineProperty(ctor, "super_", {
    value: superCtor,
    writable: true,
    configurable: true,
  });
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}

import { _TextDecoder, _TextEncoder } from "./_utils.ts";

/** The global TextDecoder */
export type TextDecoder = import("./_utils.ts")._TextDecoder;
export const TextDecoder = _TextDecoder;

/** The global TextEncoder */
export type TextEncoder = import("./_utils.ts")._TextEncoder;
export const TextEncoder = _TextEncoder;

export default {
  format,
  inspect,
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isObject,
  isError,
  isFunction,
  isRegExp,
  isPrimitive,
  getSystemErrorName,
  deprecate,
  callbackify,
  promisify,
  inherits,
  types,
  TextDecoder,
  TextEncoder,
};
