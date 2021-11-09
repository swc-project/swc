// Loaded from https://deno.land/x/oak@v6.3.1/content_disposition.ts


/**
 * Adapted directly from content-disposition.js at 
 * https://github.com/Rob--W/open-in-browser/blob/master/extension/content-disposition.js
 * which is licensed as:
 * 
 * (c) 2017 Rob Wu <rob@robwu.nl> (https://robwu.nl)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { toParamRegExp, unquote } from "./headers.ts";

let needsEncodingFixup = false;

function fixupEncoding(value: string): string {
  if (needsEncodingFixup && /[\x80-\xff]/.test(value)) {
    value = textDecode("utf-8", value);
    if (needsEncodingFixup) {
      value = textDecode("iso-8859-1", value);
    }
  }
  return value;
}

const FILENAME_STAR_REGEX = toParamRegExp("filename\\*", "i");
const FILENAME_START_ITER_REGEX = toParamRegExp(
  "filename\\*((?!0\\d)\\d+)(\\*?)",
  "ig",
);
const FILENAME_REGEX = toParamRegExp("filename", "i");

function rfc2047decode(value: string): string {
  // deno-lint-ignore no-control-regex
  if (!value.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value)) {
    return value;
  }
  return value.replace(
    /=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g,
    (_: string, charset: string, encoding: string, text: string) => {
      if (encoding === "q" || encoding === "Q") {
        text = text.replace(/_/g, " ");
        text = text.replace(
          /=([0-9a-fA-F]{2})/g,
          (_, hex) => String.fromCharCode(parseInt(hex, 16)),
        );
        return textDecode(charset, text);
      }
      try {
        text = atob(text);
        // deno-lint-ignore no-empty
      } catch {}
      return textDecode(charset, text);
    },
  );
}

function rfc2231getParam(header: string): string {
  const matches: [string, string][] = [];
  let match: RegExpExecArray | null;
  while ((match = FILENAME_START_ITER_REGEX.exec(header))) {
    const [, ns, quote, part] = match;
    const n = parseInt(ns, 10);
    if (n in matches) {
      if (n === 0) {
        break;
      }
      continue;
    }
    matches[n] = [quote, part];
  }
  const parts: string[] = [];
  for (let n = 0; n < matches.length; ++n) {
    if (!(n in matches)) {
      break;
    }
    let [quote, part] = matches[n];
    part = unquote(part);
    if (quote) {
      part = unescape(part);
      if (n === 0) {
        part = rfc5987decode(part);
      }
    }
    parts.push(part);
  }
  return parts.join("");
}

function rfc5987decode(value: string): string {
  const encodingEnd = value.indexOf(`'`);
  if (encodingEnd === -1) {
    return value;
  }
  const encoding = value.slice(0, encodingEnd);
  const langValue = value.slice(encodingEnd + 1);
  return textDecode(encoding, langValue.replace(/^[^']*'/, ""));
}

function textDecode(encoding: string, value: string): string {
  if (encoding) {
    try {
      const decoder = new TextDecoder(encoding, { fatal: true });
      const bytes = Array.from(value, (c) => c.charCodeAt(0));
      if (bytes.every((code) => code <= 0xFF)) {
        value = decoder.decode(new Uint8Array(bytes));
        needsEncodingFixup = false;
      }
      // deno-lint-ignore no-empty
    } catch {}
  }
  return value;
}

export function getFilename(header: string): string {
  needsEncodingFixup = true;

  // filename*=ext-value ("ext-value" from RFC 5987, referenced by RFC 6266).
  let matches = FILENAME_STAR_REGEX.exec(header);
  if (matches) {
    const [, filename] = matches;
    return fixupEncoding(
      rfc2047decode(rfc5987decode(unescape(unquote(filename)))),
    );
  }

  // Continuations (RFC 2231 section 3, referenced by RFC 5987 section 3.1).
  // filename*n*=part
  // filename*n=part
  const filename = rfc2231getParam(header);
  if (filename) {
    return fixupEncoding(rfc2047decode(filename));
  }

  // filename=value (RFC 5987, section 4.1).
  matches = FILENAME_REGEX.exec(header);
  if (matches) {
    const [, filename] = matches;
    return fixupEncoding(rfc2047decode(unquote(filename)));
  }

  return "";
}
