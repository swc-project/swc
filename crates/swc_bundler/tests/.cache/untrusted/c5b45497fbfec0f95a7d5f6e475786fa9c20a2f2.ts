// Loaded from https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-9/src/util.ts


/*
 * Copyright 2018-2020 The NATS Authors
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
/**
 * Encode binary data to a base64 string
 * @param {Uint8Array} bytes to encode to base64
 */
export function encode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Decode a base64 encoded string to a binary Uint8Array
 * @param {string} b64str encoded string
 */
export function decode(b64str: string): Uint8Array {
  const bin = atob(b64str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

/**
 * @ignore
 */
export function dump(buf: Uint8Array, msg?: string): void {
  if (msg) {
    console.log(msg);
  }
  let a: string[] = [];
  for (let i = 0; i < buf.byteLength; i++) {
    if (i % 8 === 0) {
      a.push("\n");
    }
    let v = buf[i].toString(16);
    if (v.length === 1) {
      v = "0" + v;
    }
    a.push(v);
  }
  console.log(a.join("  "));
}
