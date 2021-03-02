// Loaded from https://deno.land/x/oak@v6.3.1/tssCompare.ts


// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.

// This was inspired by https://github.com/suryagh/tsscmp which provides a
// timing safe string comparison to avoid timing attacks as described in
// https://codahale.com/a-lesson-in-timing-attacks/.

import { assert, HmacSha256 } from "./deps.ts";

function compareArrayBuffer(a: ArrayBuffer, b: ArrayBuffer): boolean {
  assert(a.byteLength === b.byteLength, "ArrayBuffer lengths must match.");
  const va = new DataView(a);
  const vb = new DataView(b);
  const length = va.byteLength;
  let out = 0;
  let i = -1;
  while (++i < length) {
    out |= va.getUint8(i) ^ vb.getUint8(i);
  }
  return out === 0;
}

/** Compare two strings, Uint8Arrays, ArrayBuffers, or arrays of numbers in a
 * way that avoids timing based attacks on the comparisons on the values.
 * 
 * The function will return `true` if the values match, or `false`, if they
 * do not match. */
export function compare(
  a: string | number[] | ArrayBuffer | Uint8Array,
  b: string | number[] | ArrayBuffer | Uint8Array,
): boolean {
  const key = new Uint8Array(32);
  globalThis.crypto.getRandomValues(key);
  const ah = (new HmacSha256(key)).update(a).arrayBuffer();
  const bh = (new HmacSha256(key)).update(b).arrayBuffer();
  return compareArrayBuffer(ah, bh);
}
