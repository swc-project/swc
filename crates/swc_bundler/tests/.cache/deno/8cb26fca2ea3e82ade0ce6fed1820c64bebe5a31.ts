// Loaded from https://deno.land/x/lz4/mod.ts


// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import init, {
  source,
  lz4_compress,
  lz4_decompress,
} from "./wasm.js";

await init(source);

/**
 * Compress a byte array using lz4.
 *
 * ```typescript
 * import { compress } from "https://deno.land/x/lz4/mod.ts";
 * const text = new TextEncoder().encode("X".repeat(64));
 * console.log(text.length);                   // 64 Bytes
 * console.log(compress(text).length);         // 6  Bytes
 * ```
 *
 * @param input Input data.
 */
export function compress(input: Uint8Array): Uint8Array {
  return lz4_compress(input);
}

/**
 * Decompress a byte array using lz4.
 *
 * ```typescript
 * import { decompress } from "https://deno.land/x/lz4/mod.ts";
 * const compressed = Uint8Array.from([ 31, 88, 1, 0, 44, 0 ]);
 * console.log(compressed.length);             // 6 Bytes
 * console.log(decompress(compressed).length); // 64 Bytes
 * ```
 *
 * @param input Input data.
 */
export function decompress(input: Uint8Array): Uint8Array {
  return lz4_decompress(input);
}
