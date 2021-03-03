// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/encoders.ts


/*
 * Copyright 2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Empty } from "./types.ts";

export const TE = new TextEncoder();
export const TD = new TextDecoder();

export function fastEncoder(...a: string[]): Uint8Array {
  let len = 0;
  for (let i = 0; i < a.length; i++) {
    len += a[i] ? a[i].length : 0;
  }
  if (len === 0) {
    return Empty;
  }
  const buf = new Uint8Array(len);
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    const s = a[i];
    if (s) {
      for (let j = 0; j < s.length; j++) {
        buf[c] = s.charCodeAt(j);
        c++;
      }
    }
  }
  return buf;
}

export function fastDecoder(a: Uint8Array): string {
  if (!a || a.length === 0) {
    return "";
  }
  return String.fromCharCode(...a);
}
