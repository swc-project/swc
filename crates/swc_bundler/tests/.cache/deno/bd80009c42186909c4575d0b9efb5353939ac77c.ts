// Loaded from https://deno.land/std@0.101.0/node/querystring.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

interface ParseOptions {
  /** The function to use when decoding percent-encoded characters in the query string. */
  decodeURIComponent?: (string: string) => string;
  /** Specifies the maximum number of keys to parse. */
  maxKeys?: number;
}

export const hexTable = new Array(256);
for (let i = 0; i < 256; ++i) {
  hexTable[i] = "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase();
}

/**
 * Parses a URL query string into a collection of key and value pairs.
 * @param str The URL query string to parse
 * @param sep The substring used to delimit key and value pairs in the query string. Default: '&'.
 * @param eq The substring used to delimit keys and values in the query string. Default: '='.
 * @param options The parse options
 */
export function parse(
  str: string,
  sep = "&",
  eq = "=",
  { decodeURIComponent = unescape, maxKeys = 1000 }: ParseOptions = {},
): { [key: string]: string[] | string } {
  const entries = str
    .split(sep)
    .map((entry) => entry.split(eq).map(decodeURIComponent));
  const final: { [key: string]: string[] | string } = {};

  let i = 0;
  while (true) {
    if ((Object.keys(final).length === maxKeys && !!maxKeys) || !entries[i]) {
      break;
    }

    const [key, val] = entries[i];
    if (final[key]) {
      if (Array.isArray(final[key])) {
        (final[key] as string[]).push(val);
      } else {
        final[key] = [final[key] as string, val];
      }
    } else {
      final[key] = val;
    }

    i++;
  }

  return final;
}

interface StringifyOptions {
  /** The function to use when converting URL-unsafe characters to percent-encoding in the query string. */
  encodeURIComponent?: (string: string) => string;
}

export function encodeStr(
  str: string,
  noEscapeTable: number[],
  hexTable: string[],
): string {
  const len = str.length;
  if (len === 0) return "";

  let out = "";
  let lastPos = 0;

  for (let i = 0; i < len; i++) {
    let c = str.charCodeAt(i);
    // ASCII
    if (c < 0x80) {
      if (noEscapeTable[c] === 1) continue;
      if (lastPos < i) out += str.slice(lastPos, i);
      lastPos = i + 1;
      out += hexTable[c];
      continue;
    }

    if (lastPos < i) out += str.slice(lastPos, i);

    // Multi-byte characters ...
    if (c < 0x800) {
      lastPos = i + 1;
      out += hexTable[0xc0 | (c >> 6)] + hexTable[0x80 | (c & 0x3f)];
      continue;
    }
    if (c < 0xd800 || c >= 0xe000) {
      lastPos = i + 1;
      out += hexTable[0xe0 | (c >> 12)] +
        hexTable[0x80 | ((c >> 6) & 0x3f)] +
        hexTable[0x80 | (c & 0x3f)];
      continue;
    }
    // Surrogate pair
    ++i;

    // This branch should never happen because all URLSearchParams entries
    // should already be converted to USVString. But, included for
    // completion's sake anyway.
    if (i >= len) throw new Deno.errors.InvalidData("invalid URI");

    const c2 = str.charCodeAt(i) & 0x3ff;

    lastPos = i + 1;
    c = 0x10000 + (((c & 0x3ff) << 10) | c2);
    out += hexTable[0xf0 | (c >> 18)] +
      hexTable[0x80 | ((c >> 12) & 0x3f)] +
      hexTable[0x80 | ((c >> 6) & 0x3f)] +
      hexTable[0x80 | (c & 0x3f)];
  }
  if (lastPos === 0) return str;
  if (lastPos < len) return out + str.slice(lastPos);
  return out;
}

/**
 * Produces a URL query string from a given obj by iterating through the object's "own properties".
 * @param obj The object to serialize into a URL query string.
 * @param sep The substring used to delimit key and value pairs in the query string. Default: '&'.
 * @param eq The substring used to delimit keys and values in the query string. Default: '='.
 * @param options The stringify options
 */
export function stringify(
  // deno-lint-ignore no-explicit-any
  obj: Record<string, any>,
  sep = "&",
  eq = "=",
  { encodeURIComponent = escape }: StringifyOptions = {},
): string {
  const final = [];

  for (const entry of Object.entries(obj)) {
    if (Array.isArray(entry[1])) {
      for (const val of entry[1]) {
        final.push(encodeURIComponent(entry[0]) + eq + encodeURIComponent(val));
      }
    } else if (typeof entry[1] !== "object" && entry[1] !== undefined) {
      final.push(entry.map(encodeURIComponent).join(eq));
    } else {
      final.push(encodeURIComponent(entry[0]) + eq);
    }
  }

  return final.join(sep);
}

/** Alias of querystring.parse() */
export const decode = parse;
/** Alias of querystring.stringify() */
export const encode = stringify;
export const unescape = decodeURIComponent;
export const escape = encodeURIComponent;

export default {
  parse,
  encodeStr,
  stringify,
  hexTable,
  decode,
  encode,
  unescape,
  escape,
};
