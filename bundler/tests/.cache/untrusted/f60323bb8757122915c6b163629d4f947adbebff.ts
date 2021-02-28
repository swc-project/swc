// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/databuffer.ts


/*
 * Copyright 2018-2021 The NATS Authors
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

import { TD, TE } from "./encoders.ts";

export class DataBuffer {
  buffers: Uint8Array[];
  byteLength: number;

  constructor() {
    this.buffers = [];
    this.byteLength = 0;
  }

  static concat(...bufs: Uint8Array[]): Uint8Array {
    let max = 0;
    for (let i = 0; i < bufs.length; i++) {
      max += bufs[i].length;
    }
    const out = new Uint8Array(max);
    let index = 0;
    for (let i = 0; i < bufs.length; i++) {
      out.set(bufs[i], index);
      index += bufs[i].length;
    }
    return out;
  }

  static fromAscii(m: string): Uint8Array {
    if (!m) {
      m = "";
    }
    return TE.encode(m);
  }

  static toAscii(a: Uint8Array): string {
    return TD.decode(a);
  }

  reset(): void {
    this.buffers.length = 0;
    this.byteLength = 0;
  }

  pack(): void {
    if (this.buffers.length > 1) {
      const v = new Uint8Array(this.byteLength);
      let index = 0;
      for (let i = 0; i < this.buffers.length; i++) {
        v.set(this.buffers[i], index);
        index += this.buffers[i].length;
      }
      this.buffers.length = 0;
      this.buffers.push(v);
    }
  }

  drain(n?: number): Uint8Array {
    if (this.buffers.length) {
      this.pack();
      const v = this.buffers.pop();
      if (v) {
        const max = this.byteLength;
        if (n === undefined || n > max) {
          n = max;
        }
        const d = v.subarray(0, n);
        if (max > n) {
          this.buffers.push(v.subarray(n));
        }
        this.byteLength = max - n;
        return d;
      }
    }
    return new Uint8Array(0);
  }

  fill(a: Uint8Array, ...bufs: Uint8Array[]): void {
    if (a) {
      this.buffers.push(a);
      this.byteLength += a.length;
    }
    for (let i = 0; i < bufs.length; i++) {
      if (bufs[i] && bufs[i].length) {
        this.buffers.push(bufs[i]);
        this.byteLength += bufs[i].length;
      }
    }
  }

  peek(): Uint8Array {
    if (this.buffers.length) {
      this.pack();
      return this.buffers[0];
    }
    return new Uint8Array(0);
  }

  size(): number {
    return this.byteLength;
  }

  length(): number {
    return this.buffers.length;
  }
}
