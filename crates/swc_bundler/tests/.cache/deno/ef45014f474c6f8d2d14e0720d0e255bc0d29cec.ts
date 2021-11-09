// Loaded from https://deno.land/x/negotiator@1.0.1/src/charset.ts


/**
 * Based on https://github.com/jshttp/negotiator/blob/master/lib/charset.js
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

import type { Priority } from "./types.ts";

export { preferredCharsets };

const simpleCharsetRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;

/**
 * Parse the Accept-Charset header.
 */
function parseAcceptCharset(accept: string): Charset[] {
  const accepts = accept.split(",");
  const parsedAccepts: Charset[] = [];

  for (let i = 0; i < accepts.length; i++) {
    const charset = parseCharset(accepts[i].trim(), i);
    if (charset) {
      parsedAccepts.push(charset);
    }
  }

  return parsedAccepts;
}

interface Charset {
  charset: string;
  q: number;
  i: number;
}

/**
 * Parse a charset from the Accept-Charset header.
 */
function parseCharset(str: string, i: number): Charset | null {
  const match = simpleCharsetRegExp.exec(str);
  if (!match) return null;

  const charset = match[1];
  let q = 1;
  if (match[2]) {
    const params = match[2].split(";");
    for (let j = 0; j < params.length; j++) {
      const p = params[j].trim().split("=");
      if (p[0] === "q") {
        q = parseFloat(p[1]);
        break;
      }
    }
  }

  return {
    charset,
    q: q,
    i: i,
  };
}

/**
 * Get the priority of a charset.
 */
function getCharsetPriority(
  charset: string,
  accepted: Charset[],
  index: number,
): Priority {
  let priority = { o: -1, q: 0, s: 0 };

  for (let i = 0; i < accepted.length; i++) {
    const spec = specify(charset, accepted[i], index);

    if (
      spec &&
      (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0
    ) {
      priority = spec;
    }
  }

  return priority;
}

/**
 * Get the specificity of the charset.
 */
function specify(
  charset: string,
  spec: Charset,
  index: number,
): Priority | null {
  let s = 0;
  if (spec.charset.toLowerCase() === charset.toLowerCase()) {
    s |= 1;
  } else if (spec.charset !== "*") {
    return null;
  }

  return {
    i: index,
    o: spec.i,
    q: spec.q,
    s: s,
  };
}

/**
 * Get the preferred charsets from an Accept-Charset header.
 */
function preferredCharsets(
  accept: string | null,
  provided?: string[],
): string[] {
  // RFC 2616 sec 14.2: no header = *
  const accepts = parseAcceptCharset(accept === null ? "*" : accept || "");

  if (!provided) {
    // sorted list of all charsets
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullCharset);
  }

  const priorities = provided.map(function getPriority(type, index) {
    return getCharsetPriority(type, accepts, index);
  });

  // sorted list of accepted charsets
  return priorities.filter(isQuality).sort(compareSpecs).map(
    function getCharset(priority) {
      return provided[priorities.indexOf(priority)];
    },
  );
}

/**
 * Compare two specs.
 */
function compareSpecs(a: any, b: any): number {
  return (b.q - a.q) || (b.s - a.s!) || (a.o - b.o) || (a.i - b.i) || 0;
}

/**
 * Get full charset string.
 */
function getFullCharset(spec: Charset): string {
  return spec.charset;
}

/**
 * Check if a spec has any quality.
 */
function isQuality(spec: Charset | Priority): boolean {
  return spec.q > 0;
}
