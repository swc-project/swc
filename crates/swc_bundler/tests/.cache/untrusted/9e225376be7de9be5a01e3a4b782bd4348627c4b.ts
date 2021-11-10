// Loaded from https://denopkg.com/chiefbiiko/base64/mod.ts


import { init } from "./base.ts";

const lookup: string[] = [];
const revLookup: number[] = [];
const code: string =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

for (let i: number = 0, l = code.length; i < l; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;

export const { byteLength, toUint8Array, fromUint8Array } = init(
  lookup,
  revLookup,
);
