// Loaded from https://deno.land/x/negotiator@1.0.1/src/encoding.ts


/**
 * Based on https://github.com/jshttp/negotiator/blob/master/lib/encoding.js
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

import type { Priority } from "./types.ts";

export { preferredEncodings };

const simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;

interface Encoding {
  encoding: string;
  q: number;
  i: number;
}

/**
 * Parse the Accept-Encoding header.
 */
function parseAcceptEncoding(accept: string): Encoding[] {
  const accepts = accept.split(",");
  let hasIdentity: boolean | Priority | null = false;
  let minQuality = 1;
  const parsedEncodings: Encoding[] = [];

  for (let i = 0; i < accepts.length; i++) {
    const encoding = parseEncoding(accepts[i].trim(), i);

    if (encoding) {
      parsedEncodings.push(encoding);
      hasIdentity = hasIdentity || specify("identity", encoding);
      minQuality = Math.min(minQuality, encoding.q || 1);
    }
  }

  if (!hasIdentity) {
    /*
     * If identity doesn't explicitly appear in the accept-encoding header,
     * it's added to the list of acceptable encoding with the lowest q
     */
    parsedEncodings.push({
      encoding: "identity",
      q: minQuality,
      i: accepts.length,
    });
  }

  return parsedEncodings;
}

/**
 * Parse an encoding from the Accept-Encoding header.
 */
function parseEncoding(str: string, i: number): Encoding | null {
  const match = simpleEncodingRegExp.exec(str);
  if (!match) return null;

  const encoding = match[1];
  let q = 1;
  if (match[2]) {
    const params = match[2].split(";");
    for (var j = 0; j < params.length; j++) {
      const p = params[j].trim().split("=");
      if (p[0] === "q") {
        q = parseFloat(p[1]);
        break;
      }
    }
  }

  return {
    encoding,
    q: q,
    i: i,
  };
}

/**
 * Get the priority of an encoding.
 */
function getEncodingPriority(
  encoding: string,
  accepted: Encoding[],
  index: number,
): Priority {
  let priority = { o: -1, q: 0, s: 0 };

  for (let i = 0; i < accepted.length; i++) {
    const spec = specify(encoding, accepted[i], index);

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
 * Get the specificity of the encoding.
 */
function specify(
  encoding: string,
  spec: Encoding,
  index?: number,
): Priority | null {
  let s = 0;
  if (spec.encoding.toLowerCase() === encoding.toLowerCase()) {
    s |= 1;
  } else if (spec.encoding !== "*") {
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
 * Get the preferred encodings from an Accept-Encoding header.
 */
function preferredEncodings(
  accept: string | null,
  provided?: string[],
): string[] {
  const accepts = parseAcceptEncoding(accept || "");

  if (!provided) {
    // sorted list of all encodings
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullEncoding);
  }

  const priorities = provided.map(function getPriority(type, index) {
    return getEncodingPriority(type, accepts, index);
  });

  // sorted list of accepted encodings
  return priorities.filter(isQuality).sort(compareSpecs).map(
    function getEncoding(priority) {
      return provided[priorities.indexOf(priority)];
    },
  );
}

/**
 * Compare two specs.
 */
function compareSpecs(a: any, b: any): number {
  return (b.q - a.q) || (b.s - a.s) || (a.o - b.o) || (a.i - b.i) || 0;
}

/**
 * Get full encoding string.
 */
function getFullEncoding(spec: Encoding): string {
  return spec.encoding;
}

/**
 * Check if a spec has any quality.
 */
function isQuality(spec: Encoding | Priority): boolean {
  return spec.q > 0;
}
