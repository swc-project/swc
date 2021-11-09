// Loaded from https://deno.land/x/base64/base64url.ts


import { init } from "./base.ts";

const lookup: string[] = [];
const revLookup: number[] = [];
const code: string =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

for (let i: number = 0, l = code.length; i < l; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

export const { byteLength, toUint8Array, fromUint8Array } = init(
  lookup,
  revLookup,
  true,
);
