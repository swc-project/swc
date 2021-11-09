// Loaded from https://deno.land/x/opine@1.6.0/src/utils/etag.ts


/*!
 * Port of etag (https://github.com/jshttp/etag) for Deno.
 *
 * Licensed as follows:
 *
 * (The MIT License)
 *
 * Copyright (c) 2014-2016 Douglas Christopher Wilson
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import { Sha1 } from "../../deps.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**s
 * Generate an entity tag.
 *
 * @param {any} entity
 * @return {string}
 * @private
 */
function entitytag(entity: any): string {
  if (entity.length === 0) {
    // fast-path empty
    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
  }

  if (entity instanceof Uint8Array) {
    entity = decoder.decode(entity);
  }

  // compute hash of entity
  const sha1 = new Sha1();
  sha1.update(entity);
  sha1.digest();
  const hash = sha1.toString().substring(0, 27);

  // compute length of entity
  const len = typeof entity === "string"
    ? encoder.encode(entity).byteLength
    : entity.byteLength;

  return `"${len.toString(16)}-${hash}"`;
}

/**
 * Determine if object is a Stats object.
 *
 * @param {object} obj
 * @return {boolean}
 * @private
 */
function isstats(obj: any): boolean {
  // quack quack
  return obj && typeof obj === "object" &&
    "atime" in obj &&
    "mtime" in obj &&
    "birthtime" in obj &&
    "size" in obj && typeof obj.size === "number";
}

/**
 * Generate a tag for a stat.
 *
 * @param {object} stat
 * @return {string}
 * @private
 */
function stattag(stat: Deno.FileInfo) {
  const mtime = new Date(stat.mtime as Date).getTime().toString(16);
  const size = stat.size.toString(16);

  return '"' + size + "-" + mtime + '"';
}

/**
 * Create a simple ETag.
 *
 * @param {string|Uint8Array|Deno.FileInfo} entity
 * @param {object} [options]
 * @param {boolean} [options.weak]
 * @return {string}
 * @public
 */
export function etag(
  entity: string | Uint8Array | Deno.FileInfo,
  options: any,
) {
  if (entity == null) {
    throw new TypeError("argument entity is required");
  }

  let entityObj = entity;
  if (typeof entity === "string") {
    try {
      // In case have stringify the Deno.FileInfo object.
      entityObj = JSON.parse(entity);
    } catch (_) {}
  }

  // support fs.Stats object
  const isStats = isstats(entityObj);
  const weak = options && typeof options.weak === "boolean"
    ? options.weak
    : isStats;

  // validate argument
  if (
    !isStats && typeof entity !== "string" && !(entity instanceof Uint8Array)
  ) {
    throw new TypeError(
      "argument entity must be string, Uint8Array, or Deno.FileInfo",
    );
  }

  // generate entity tag
  const tag = isStats ? stattag(entityObj as Deno.FileInfo) : entitytag(entity);

  return weak ? `W/${tag}` : tag;
}
