// Loaded from https://deno.land/x/oak@v6.3.1/isMediaType.ts


/*!
 * Adapted directly from type-is at https://github.com/jshttp/type-is/
 * which is licensed as follows:
 *
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

import { lookup } from "./deps.ts";
import { format, parse } from "./mediaTyper.ts";

function mimeMatch(expected: string | undefined, actual: string): boolean {
  if (expected === undefined) {
    return false;
  }

  const actualParts = actual.split("/");
  const expectedParts = expected.split("/");

  if (actualParts.length !== 2 || expectedParts.length !== 2) {
    return false;
  }

  const [actualType, actualSubtype] = actualParts;
  const [expectedType, expectedSubtype] = expectedParts;

  if (expectedType !== "*" && expectedType !== actualType) {
    return false;
  }

  if (expectedSubtype.substr(0, 2) === "*+") {
    return (
      expectedSubtype.length <= actualSubtype.length + 1 &&
      expectedSubtype.substr(1) ===
        actualSubtype.substr(1 - expectedSubtype.length)
    );
  }

  if (expectedSubtype !== "*" && expectedSubtype !== actualSubtype) {
    return false;
  }

  return true;
}

function normalize(type: string): string | undefined {
  if (type === "urlencoded") {
    return "application/x-www-form-urlencoded";
  } else if (type === "multipart") {
    return "multipart/*";
  } else if (type[0] === "+") {
    return `*/*${type}`;
  }
  return type.includes("/") ? type : lookup(type);
}

function normalizeType(value: string): string | undefined {
  try {
    const val = value.split(";");
    const type = parse(val[0]);
    return format(type);
  } catch {
    return;
  }
}

/** Given a value of the content type of a request and an array of types,
 * provide the matching type or `false` if no types are matched.
 */
export function isMediaType(value: string, types: string[]): string | false {
  const val = normalizeType(value);

  if (!val) {
    return false;
  }

  if (!types.length) {
    return val;
  }

  for (const type of types) {
    if (mimeMatch(normalize(type), val)) {
      return type[0] === "+" || type.includes("*") ? val : type;
    }
  }

  return false;
}
