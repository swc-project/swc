// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/util.ts


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
// deno-lint-ignore-file no-explicit-any
import { DataBuffer } from "./databuffer.ts";
import { ErrorCode, NatsError } from "./error.ts";
import { TD } from "./encoders.ts";

export const CR_LF = "\r\n";
export const CR_LF_LEN = CR_LF.length;
export const CRLF = DataBuffer.fromAscii(CR_LF);
export const CR = new Uint8Array(CRLF)[0]; // 13
export const LF = new Uint8Array(CRLF)[1]; // 10

export function isUint8Array(a: unknown): boolean {
  return a instanceof Uint8Array;
}

export function protoLen(ba: Uint8Array): number {
  for (let i = 0; i < ba.length; i++) {
    const n = i + 1;
    if (ba.byteLength > n && ba[i] === CR && ba[n] === LF) {
      return n + 1;
    }
  }
  return -1;
}

export function extractProtocolMessage(a: Uint8Array): string {
  // protocol messages are ascii, so Uint8Array
  const len = protoLen(a);
  if (len) {
    const ba = new Uint8Array(a);
    const out = ba.slice(0, len);
    return TD.decode(out);
  }
  return "";
}

export function extend(a: any, ...b: any[]): any {
  for (let i = 0; i < b.length; i++) {
    const o = b[i];
    Object.keys(o).forEach(function (k) {
      a[k] = o[k];
    });
  }
  return a;
}

export interface Pending {
  pending: number;
  write: (c: number) => void;
  wrote: (c: number) => void;
  err: (err: Error) => void;
  close: () => void;
  promise: () => Promise<any>;
  resolved: boolean;
  done: boolean;
}

export function pending(): Pending {
  const v = {} as Pending;
  const promise = new Promise<void>((resolve) => {
    v.promise = () => {
      return promise;
    };
    v.write = (c: number) => {
      if (v.resolved) {
        return;
      }
      v.pending += c;
    };
    v.wrote = (c: number) => {
      if (v.resolved) {
        return;
      }
      v.pending -= c;
      if (v.done && 0 >= v.pending) {
        resolve();
      }
    };
    v.close = () => {
      v.done = true;
      if (v.pending === 0) {
        resolve();
      }
    };
    v.err = () => {
      v.pending = 0;
      v.resolved = true;
      v.close();
    };
  });
  return v;
}

export function render(frame: Uint8Array): string {
  const cr = "␍";
  const lf = "␊";
  return TD.decode(frame)
    .replace(/\n/g, lf)
    .replace(/\r/g, cr);
}

export interface Timeout<T> extends Promise<T> {
  cancel: () => void;
}

export function timeout<T>(ms: number): Timeout<T> {
  let methods;
  let timer: number;
  const p = new Promise((resolve, reject) => {
    const cancel = (): void => {
      if (timer) {
        clearTimeout(timer);
      }
    };
    methods = { cancel };
    // @ts-ignore: node is not a number
    timer = setTimeout(() => {
      reject(NatsError.errorForCode(ErrorCode.TIMEOUT));
    }, ms);
  });
  // noinspection JSUnusedAssignment
  return Object.assign(p, methods) as Timeout<T>;
}

export function delay(ms = 0): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export interface Deferred<T> extends Promise<T> {
  resolve: (value?: T | PromiseLike<T>) => void;
  //@ts-ignore: tsc guard
  reject: (reason?: any) => void;
}

export function deferred<T>(): Deferred<T> {
  let methods = {};
  const p = new Promise<T>((resolve, reject): void => {
    methods = { resolve, reject };
  });
  return Object.assign(p, methods) as Deferred<T>;
}

export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class Perf {
  timers: Map<string, number>;
  measures: Map<string, number>;

  constructor() {
    this.timers = new Map();
    this.measures = new Map();
  }

  mark(key: string) {
    this.timers.set(key, Date.now());
  }

  measure(key: string, startKey: string, endKey: string) {
    const s = this.timers.get(startKey);
    if (s === undefined) {
      throw new Error(`${startKey} is not defined`);
    }
    const e = this.timers.get(endKey);
    if (e === undefined) {
      throw new Error(`${endKey} is not defined`);
    }
    this.measures.set(key, e - s);
  }

  getEntries(): { name: string; duration: number }[] {
    const values: { name: string; duration: number }[] = [];
    this.measures.forEach((v, k) => {
      values.push({ name: k, duration: v });
    });
    return values;
  }
}
