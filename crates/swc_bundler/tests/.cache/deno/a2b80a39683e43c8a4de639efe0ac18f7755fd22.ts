// Loaded from https://deno.land/x/negotiator@1.0.1/src/media_type.ts


/**
 * Based on https://github.com/jshttp/negotiator/blob/master/lib/mediaType.js
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2020 Henry Zhuang
 * MIT Licensed
 */

import type { Priority } from "./types.ts";

export { preferredMediaTypes };

const simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;

interface MediaTypeParams {
  [key: string]: string;
}

interface MediaType {
  type: string;
  subtype: string;
  params: MediaTypeParams;
  q: number;
  i?: number;
}

/**
 * Parse the Accept header.
 */
function parseAccept(accept: string): MediaType[] {
  const accepts = splitMediaTypes(accept);
  const parsedAccepts: MediaType[] = [];
  for (let i = 0; i < accepts.length; i++) {
    const mediaType = parseMediaType(accepts[i].trim(), i);

    if (mediaType) {
      parsedAccepts.push(mediaType);
    }
  }

  return parsedAccepts;
}

/**
 * Parse a media type from the Accept header.
 */
function parseMediaType(str: string, i?: number): MediaType | null {
  const match = simpleMediaTypeRegExp.exec(str);
  if (!match) return null;

  const params: MediaTypeParams = Object.create(null);
  let q = 1;
  const subtype = match[2];
  const type = match[1];

  if (match[3]) {
    const kvps = splitParameters(match[3]).map(splitKeyValuePair);

    for (let j = 0; j < kvps.length; j++) {
      const pair = kvps[j];
      const key = pair[0].toLowerCase();
      const val = pair[1];

      // get the value, unwrapping quotes
      const value = val && val[0] === '"' && val[val.length - 1] === '"'
        ? val.substr(1, val.length - 2)
        : val;

      if (key === "q") {
        q = parseFloat(value!);
        break;
      }

      // store parameter
      params[key] = value!;
    }
  }

  return {
    type,
    subtype,
    params,
    q,
    i,
  };
}

/**
 * Get the priority of a media type.
 */
function getMediaTypePriority(
  type: string,
  accepted: MediaType[],
  index: number,
): Priority {
  let priority = { o: -1, q: 0, s: 0 };

  for (let i = 0; i < accepted.length; i++) {
    const spec = specify(type, accepted[i], index);

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
 * Get the specificity of the media type.
 */
function specify(
  type: string,
  spec: MediaType,
  index: number,
): Priority | null {
  const p = parseMediaType(type);
  let s = 0;

  if (!p) {
    return null;
  }

  if (spec.type.toLowerCase() == p.type.toLowerCase()) {
    s |= 4;
  } else if (spec.type != "*") {
    return null;
  }

  if (spec.subtype.toLowerCase() == p.subtype.toLowerCase()) {
    s |= 2;
  } else if (spec.subtype != "*") {
    return null;
  }

  const keys = Object.keys(spec.params);
  if (keys.length > 0) {
    if (
      keys.every(function (k) {
        return spec.params[k] == "*" ||
          (spec.params[k] || "").toLowerCase() ==
            (p.params[k] || "").toLowerCase();
      })
    ) {
      s |= 1;
    } else {
      return null;
    }
  }

  return {
    i: index,
    o: spec.i!,
    q: spec.q,
    s: s,
  };
}

/**
 * Get the preferred media types from an Accept header.
 */
function preferredMediaTypes(
  accept: string | null,
  provided?: string[],
): string[] {
  // RFC 2616 sec 14.2: no header = */*
  const accepts = parseAccept(accept === null ? "*/*" : accept || "");

  if (!provided) {
    // sorted list of all types
    return accepts
      .filter(isQuality)
      .sort(compareSpecs)
      .map(getFullType);
  }

  const priorities = provided.map(function getPriority(type, index) {
    return getMediaTypePriority(type, accepts, index);
  });

  // sorted list of accepted types
  return priorities.filter(isQuality).sort(compareSpecs).map(
    function getType(priority) {
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
 * Get full type string.
 */
function getFullType(spec: MediaType): string {
  return spec.type + "/" + spec.subtype;
}

/**
 * Check if a spec has any quality.
 */
function isQuality(spec: Priority | MediaType): boolean {
  return spec.q > 0;
}

/**
 * Count the number of quotes in a string.
 */
function quoteCount(string: string): number {
  let count = 0;
  let index = 0;

  while ((index = string.indexOf('"', index)) !== -1) {
    count++;
    index++;
  }

  return count;
}

/**
 * Split a key value pair.
 */
function splitKeyValuePair(str: string): [string, string | undefined] {
  const index = str.indexOf("=");
  let key;
  let val;

  if (index === -1) {
    key = str;
  } else {
    key = str.substr(0, index);
    val = str.substr(index + 1);
  }

  return [key, val];
}

/**
 * Split an Accept header into media types.
 */
function splitMediaTypes(accept: string) {
  const accepts = accept.split(",");
  let j = 0;
  for (let i = 1; i < accepts.length; i++) {
    if (quoteCount(accepts[j]) % 2 == 0) {
      accepts[++j] = accepts[i];
    } else {
      accepts[j] += "," + accepts[i];
    }
  }

  // trim accepts
  accepts.length = j + 1;

  return accepts;
}

/**
 * Split a string of parameters.
 */
function splitParameters(str: string) {
  const parameters = str.split(";");
  let j = 0;
  for (let i = 1; i < parameters.length; i++) {
    if (quoteCount(parameters[j]) % 2 == 0) {
      parameters[++j] = parameters[i];
    } else {
      parameters[j] += ";" + parameters[i];
    }
  }

  // trim parameters
  parameters.length = j + 1;

  for (let i = 0; i < parameters.length; i++) {
    parameters[i] = parameters[i].trim();
  }

  return parameters;
}
