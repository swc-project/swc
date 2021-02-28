// Loaded from https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-9/modules/esm/deps.ts


// This file contains external dependencies bundled
// to insure safety on the distribution.

// https://github.com/dchest/tweetnacl-js/blob/master/LICENSE
// This is free and unencumbered software released into the public domain.
//
//   Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
//
//   In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
//
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//   EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//   IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
//   ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
//   For more information, please refer to <http://unlicense.org>
import type { Ed25519Helper } from "../../src/helper.ts";

import {
  randomBytes,
  sign_detached,
  sign_detached_verify,
  sign_keyPair_fromSeed,
} from "https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/nacl.ts";

export const denoHelper = {
  fromSeed: sign_keyPair_fromSeed,
  sign: sign_detached,
  verify: sign_detached_verify,
  randomBytes: randomBytes,
} as Ed25519Helper;
