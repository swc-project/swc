// Loaded from https://deno.land/x/type_is@1.0.3/mod.ts


/*!
 * Based on https://github.com/jshttp/type-is/blob/master/index.js
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

import { lookup, parse, test } from "./deps.ts";

/**
 * Compare a `value` content-type with `types`.
 * Each `type` can be an extension like `html`,
 * a special shortcut like `multipart` or `urlencoded`,
 * or a mime type.
 *
 * If no types match, `false` is returned.
 * Otherwise, the first `type` that matches is returned.
 *
 * @param {String} mediaType
 * @param {Array} types
 */
export function is(mediaType: string, types?: string[]): boolean | string {
  let i;
  // remove parameters and normalize
  const val = tryNormalizeType(mediaType);

  // no type or invalid
  if (!val) {
    return false;
  }

  // no types, return the content type
  if (!types || !types.length) {
    return val;
  }

  let type;
  for (i = 0; i < types.length; i++) {
    const normalized = normalize(type = types[i]);
    if (normalized && mimeMatch(normalized, val)) {
      return type[0] === "+" || type.indexOf("*") !== -1 ? val : type;
    }
  }

  // no matches
  return false;
}

/**
 * Check if a request's header has a request body.
 * A request with a body __must__ either have `transfer-encoding`
 * or `content-length` headers set.
 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.3
 *
 * @param {Object} request
 * @return {Boolean}
 */
export function hasBody(header: Headers): boolean {
  return header.get("transfer-encoding") !== null ||
    !isNaN(parseInt(header.get("content-length") || "", 10));
}

/**
 * Check if the incoming request's header contains the "Content-Type"
 * header field, and it contains any of the give mime `type`s.
 * If there is no request body, `null` is returned.
 * If there is no content type, `false` is returned.
 * Otherwise, it returns the first `type` that matches.
 *
 * Examples:
 *
 *     // With Content-Type: text/html; charset=utf-8
 *     typeofrequest(header, [ 'html' ]); // => 'html'
 *     typeofrequest(header, ['text/html' ]); // => 'text/html'
 *     typeofrequest(header, ['text/*', 'application/json' ]); // => 'text/html'
 *
 *     // When Content-Type is application/json
 *     typeofrequest(header, [ 'json', 'urlencoded' ]); // => 'json'
 *     typeofrequest(header, [ 'application/json' ]); // => 'application/json'
 *     typeofrequest(header, [ 'html', 'application/*' ]); // => 'application/json'
 *
 *     typeofrequest(header, [ 'html' ]); // => false
 *
 * @param {String|Array} types...
 * @return {String|false|null}
 */

export function typeofrequest(
  header: Headers,
  types_?: string[],
): null | boolean | string {
  const types = types_;

  // no body
  if (!hasBody(header)) {
    return null;
  }

  // request content type
  const value = header.get("content-type");

  if (!value) {
    return false;
  }

  return is(value, types);
}

/**
 * Normalize a mime type.
 * If it's a shorthand, expand it to a valid mime type.
 *
 * In general, you probably want:
 *
 *   const type = is(req, ['urlencoded', 'json', 'multipart']);
 *
 * Then use the appropriate body parsers.
 * These three are the most common request body types
 * and are thus ensured to work.
 *
 * @param {String} type
 */
export const normalize = function normalize(type: string): string | undefined {
  switch (type) {
    case "urlencoded":
      return "application/x-www-form-urlencoded";
    case "multipart":
      return "multipart/*";
  }

  if (type[0] === "+") {
    // "+json" -> "*/*+json" expando
    return "*/*" + type;
  }

  return type.indexOf("/") === -1 ? lookup(type) : type;
};

/**
 * Check if `expected` mime type
 * matches `actual` mime type with
 * wildcard and +suffix support.
 *
 * @param {String} expected
 * @param {String} actual
 * @return {Boolean}
 */
function mimeMatch(expected: string, actual: string): boolean {
  // split types
  const actualParts = actual.split("/");
  const expectedParts = expected.split("/");

  // invalid format
  if (actualParts.length !== 2 || expectedParts.length !== 2) {
    return false;
  }

  // validate type
  if (expectedParts[0] !== "*" && expectedParts[0] !== actualParts[0]) {
    return false;
  }

  // validate suffix wildcard
  if (expectedParts[1].substr(0, 2) === "*+") {
    return expectedParts[1].length <= actualParts[1].length + 1 &&
      expectedParts[1].substr(1) ===
        actualParts[1].substr(1 - expectedParts[1].length);
  }

  // validate subtype
  if (expectedParts[1] !== "*" && expectedParts[1] !== actualParts[1]) {
    return false;
  }

  return true;
}

/**
 * Normalize a type
 *
 * @param {string} value
 * @return {string}
 */
function normalizeType(value: string): string | null {
  // parse the type
  const type = parse(value).type;

  if (!test(type)) {
    return null;
  }

  return type;
}

/**
 * Try to normalize a type
 *
 * @param {string} value
 * @return {string}
 */
function tryNormalizeType(value: string): string | null {
  try {
    return normalizeType(value);
  } catch (err) {
    return null;
  }
}
