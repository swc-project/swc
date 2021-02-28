// Loaded from https://deno.land/x/oak/headers.ts


// Copyright 2018-2021 the oak authors. All rights reserved. MIT license.

import type { BufReader } from "./buf_reader.ts";
import { httpErrors } from "./httpError.ts";

const COLON = ":".charCodeAt(0);
const HTAB = "\t".charCodeAt(0);
const SPACE = " ".charCodeAt(0);

const decoder = new TextDecoder();

/** With a provided attribute pattern, return a RegExp which will match and
 * capture in the first group the value of the attribute from a header value. */
export function toParamRegExp(
  attributePattern: string,
  flags?: string,
): RegExp {
  // deno-fmt-ignore
  return new RegExp(
    `(?:^|;)\\s*${attributePattern}\\s*=\\s*` +
    `(` +
      `[^";\\s][^;\\s]*` +
    `|` +
      `"(?:[^"\\\\]|\\\\"?)+"?` +
    `)`,
    flags
  );
}

/** Asynchronously read the headers out of body request and resolve with them as
 * a `Headers` object. */
export async function readHeaders(
  body: BufReader,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  let readResult = await body.readLine();
  while (readResult) {
    const { bytes } = readResult;
    if (!bytes.length) {
      return headers;
    }
    let i = bytes.indexOf(COLON);
    if (i === -1) {
      throw new httpErrors.BadRequest(
        `Malformed header: ${decoder.decode(bytes)}`,
      );
    }
    const key = decoder.decode(bytes.subarray(0, i)).trim().toLowerCase();
    if (key === "") {
      throw new httpErrors.BadRequest("Invalid header key.");
    }
    i++;
    while (i < bytes.byteLength && (bytes[i] === SPACE || bytes[i] === HTAB)) {
      i++;
    }
    const value = decoder.decode(bytes.subarray(i)).trim();
    headers[key] = value;
    readResult = await body.readLine();
  }
  throw new httpErrors.BadRequest("Unexpected end of body reached.");
}

/** Unquotes attribute values that might be pass as part of a header. */
export function unquote(value: string): string {
  if (value.startsWith(`"`)) {
    const parts = value.slice(1).split(`\\"`);
    for (let i = 0; i < parts.length; ++i) {
      const quoteIndex = parts[i].indexOf(`"`);
      if (quoteIndex !== -1) {
        parts[i] = parts[i].slice(0, quoteIndex);
        parts.length = i + 1; // Truncates and stops the loop
      }
      parts[i] = parts[i].replace(/\\(.)/g, "$1");
    }
    value = parts.join(`"`);
  }
  return value;
}
