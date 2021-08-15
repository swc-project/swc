// Loaded from https://deno.land/x/negotiator@1.0.1/src/language.ts


/**
 * Based on https://github.com/jshttp/negotiator/blob/master/lib/language.js
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

import type { Priority } from "./types.ts";

export { preferredLanguages };

const simpleLanguageRegExp = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;

interface Language {
  prefix: string;
  suffix: string;
  full: string;
  q: number;
  i?: number;
}

/**
 * Parse the Accept-Language header.
 */
function parseAcceptLanguage(accept: string): Language[] {
  const accepts = accept.split(",");
  const parsedEncodings: Language[] = [];

  for (let i = 0; i < accepts.length; i++) {
    const language = parseLanguage(accepts[i].trim(), i);

    if (language) {
      parsedEncodings.push(language);
    }
  }

  return parsedEncodings;
}

/**
 * Parse a language from the Accept-Language header.
 */
function parseLanguage(str: string, i?: number): Language | null {
  const match = simpleLanguageRegExp.exec(str);
  if (!match) return null;

  const prefix = match[1];
  const suffix = match[2];
  let full = prefix;

  if (suffix) full += "-" + suffix;

  let q = 1;
  if (match[3]) {
    const params = match[3].split(";");
    for (let j = 0; j < params.length; j++) {
      const p = params[j].split("=");
      if (p[0] === "q") q = parseFloat(p[1]);
    }
  }

  return {
    prefix,
    suffix,
    q,
    i,
    full,
  };
}

/**
 * Get the priority of a language.
 */
function getLanguagePriority(
  language: string,
  accepted: Language[],
  index: number,
): Priority {
  let priority = { o: -1, q: 0, s: 0 };

  for (let i = 0; i < accepted.length; i++) {
    const spec = specify(language, accepted[i], index);

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
 * Get the specificity of the language.
 */
function specify(
  language: string,
  spec: Language,
  index: number,
): Priority | null {
  const p = parseLanguage(language);
  if (!p) return null;
  let s = 0;
  if (spec.full.toLowerCase() === p.full.toLowerCase()) {
    s |= 4;
  } else if (spec.prefix.toLowerCase() === p.full.toLowerCase()) {
    s |= 2;
  } else if (spec.full.toLowerCase() === p.prefix.toLowerCase()) {
    s |= 1;
  } else if (spec.full !== "*") {
    return null;
  }

  return {
    i: index,
    o: spec.i!,
    q: spec.q,
    s,
  };
}

/**
 * Get the preferred languages from an Accept-Language header.
 */
function preferredLanguages(
  accept: string | null,
  provided?: string[],
): string[] {
  // RFC 2616 sec 14.4: no header = *
  const accepts = parseAcceptLanguage(
    accept === null ? "*" : accept || "",
  );

  if (!provided) {
    // sorted list of all languages
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullLanguage);
  }

  const priorities = provided.map(function getPriority(type, index) {
    return getLanguagePriority(type, accepts, index);
  });

  // sorted list of accepted languages
  return priorities.filter(isQuality).sort(compareSpecs).map(
    function getLanguage(priority) {
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
 * Get full language string.
 */
function getFullLanguage(spec: Language): string {
  return spec.full;
}

/**
 * Check if a spec has any quality.
 */
function isQuality(spec: Language | Priority): boolean {
  return spec.q > 0;
}
