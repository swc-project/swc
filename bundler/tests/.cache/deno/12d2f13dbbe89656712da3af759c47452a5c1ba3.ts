// Loaded from https://deno.land/std@0.92.0/node/_utils.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
import { deferred } from "../async/mod.ts";
import { assert, assertStringIncludes, fail } from "../testing/asserts.ts";
import { readAll } from "../io/util.ts";

export type BinaryEncodings = "binary";

export type TextEncodings =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "latin1"
  | "hex";

export type Encodings = BinaryEncodings | TextEncodings;

export function notImplemented(msg?: string): never {
  const message = msg ? `Not implemented: ${msg}` : "Not implemented";
  throw new Error(message);
}

export type _TextDecoder = typeof TextDecoder.prototype;
export const _TextDecoder = TextDecoder;

export type _TextEncoder = typeof TextEncoder.prototype;
export const _TextEncoder = TextEncoder;

// API helpers

export type MaybeNull<T> = T | null;
export type MaybeDefined<T> = T | undefined;
export type MaybeEmpty<T> = T | null | undefined;

export function intoCallbackAPI<T>(
  // deno-lint-ignore no-explicit-any
  func: (...args: any[]) => Promise<T>,
  cb: MaybeEmpty<(err: MaybeNull<Error>, value?: MaybeEmpty<T>) => void>,
  // deno-lint-ignore no-explicit-any
  ...args: any[]
): void {
  func(...args).then(
    (value) => cb && cb(null, value),
    (err) => cb && cb(err),
  );
}

export function intoCallbackAPIWithIntercept<T1, T2>(
  // deno-lint-ignore no-explicit-any
  func: (...args: any[]) => Promise<T1>,
  interceptor: (v: T1) => T2,
  cb: MaybeEmpty<(err: MaybeNull<Error>, value?: MaybeEmpty<T2>) => void>,
  // deno-lint-ignore no-explicit-any
  ...args: any[]
): void {
  func(...args).then(
    (value) => cb && cb(null, interceptor(value)),
    (err) => cb && cb(err),
  );
}

export function spliceOne(list: string[], index: number): void {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}

// Taken from: https://github.com/nodejs/node/blob/ba684805b6c0eded76e5cd89ee00328ac7a59365/lib/internal/util.js#L125
// Return undefined if there is no match.
// Move the "slow cases" to a separate function to make sure this function gets
// inlined properly. That prioritizes the common case.
export function normalizeEncoding(
  enc: string | null,
): TextEncodings | undefined {
  if (enc == null || enc === "utf8" || enc === "utf-8") return "utf8";
  return slowCases(enc);
}

// https://github.com/nodejs/node/blob/ba684805b6c0eded76e5cd89ee00328ac7a59365/lib/internal/util.js#L130
function slowCases(enc: string): TextEncodings | undefined {
  switch (enc.length) {
    case 4:
      if (enc === "UTF8") return "utf8";
      if (enc === "ucs2" || enc === "UCS2") return "utf16le";
      enc = `${enc}`.toLowerCase();
      if (enc === "utf8") return "utf8";
      if (enc === "ucs2") return "utf16le";
      break;
    case 3:
      if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") {
        return "hex";
      }
      break;
    case 5:
      if (enc === "ascii") return "ascii";
      if (enc === "ucs-2") return "utf16le";
      if (enc === "UTF-8") return "utf8";
      if (enc === "ASCII") return "ascii";
      if (enc === "UCS-2") return "utf16le";
      enc = `${enc}`.toLowerCase();
      if (enc === "utf-8") return "utf8";
      if (enc === "ascii") return "ascii";
      if (enc === "ucs-2") return "utf16le";
      break;
    case 6:
      if (enc === "base64") return "base64";
      if (enc === "latin1" || enc === "binary") return "latin1";
      if (enc === "BASE64") return "base64";
      if (enc === "LATIN1" || enc === "BINARY") return "latin1";
      enc = `${enc}`.toLowerCase();
      if (enc === "base64") return "base64";
      if (enc === "latin1" || enc === "binary") return "latin1";
      break;
    case 7:
      if (
        enc === "utf16le" ||
        enc === "UTF16LE" ||
        `${enc}`.toLowerCase() === "utf16le"
      ) {
        return "utf16le";
      }
      break;
    case 8:
      if (
        enc === "utf-16le" ||
        enc === "UTF-16LE" ||
        `${enc}`.toLowerCase() === "utf-16le"
      ) {
        return "utf16le";
      }
      break;
    default:
      if (enc === "") return "utf8";
  }
}

export function validateIntegerRange(
  value: number,
  name: string,
  min = -2147483648,
  max = 2147483647,
): void {
  // The defaults for min and max correspond to the limits of 32-bit integers.
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be 'an integer' but was ${value}`);
  }

  if (value < min || value > max) {
    throw new Error(
      `${name} must be >= ${min} && <= ${max}. Value was ${value}`,
    );
  }
}

type OptionalSpread<T> = T extends undefined ? []
  : [T];

export function once<T = undefined>(
  callback: (...args: OptionalSpread<T>) => void,
) {
  let called = false;
  return function (this: unknown, ...args: OptionalSpread<T>) {
    if (called) return;
    called = true;
    callback.apply(this, args);
  };
}

/**
 * @param {number} [expectedExecutions = 1]
 * @param {number} [timeout = 1000] Milliseconds to wait before the promise is forcefully exited
*/
export function mustCall<T extends unknown[]>(
  fn: ((...args: T) => void) = () => {},
  expectedExecutions = 1,
  timeout = 1000,
): [Promise<void>, (...args: T) => void] {
  if (expectedExecutions < 1) {
    throw new Error("Expected executions can't be lower than 1");
  }
  let timesExecuted = 0;
  const completed = deferred();

  const abort = setTimeout(() => completed.reject(), timeout);

  function callback(this: unknown, ...args: T) {
    timesExecuted++;
    if (timesExecuted === expectedExecutions) {
      completed.resolve();
    }
    fn.apply(this, args);
  }

  const result = completed
    .then(() => clearTimeout(abort))
    .catch(() =>
      fail(
        `Async operation not completed: Expected ${expectedExecutions}, executed ${timesExecuted}`,
      )
    );

  return [
    result,
    callback,
  ];
}
/** Asserts that an error thrown in a callback will not be wrongly caught. */
export async function assertCallbackErrorUncaught(
  { prelude, invocation, cleanup }: {
    /** Any code which needs to run before the actual invocation (notably, any import statements). */
    prelude?: string;
    /** 
     * The start of the invocation of the function, e.g. `open("foo.txt", `.
     * The callback will be added after it. 
     */
    invocation: string;
    /** Called after the subprocess is finished but before running the assertions, e.g. to clean up created files. */
    cleanup?: () => Promise<void> | void;
  },
) {
  // Since the error has to be uncaught, and that will kill the Deno process,
  // the only way to test this is to spawn a subprocess.
  const p = Deno.run({
    cmd: [
      Deno.execPath(),
      "eval",
      "--no-check", // Running TSC for every one of these tests would take way too long
      "--unstable",
      `${prelude ?? ""}

      ${invocation}(err) => {
        // If the bug is present and the callback is called again with an error,
        // don't throw another error, so if the subprocess fails we know it had the correct behaviour.
        if (!err) throw new Error("success");
      });`,
    ],
    stderr: "piped",
  });
  const status = await p.status();
  const stderr = new TextDecoder().decode(await readAll(p.stderr));
  p.close();
  p.stderr.close();
  await cleanup?.();
  assert(!status.success);
  assertStringIncludes(stderr, "Error: success");
}
