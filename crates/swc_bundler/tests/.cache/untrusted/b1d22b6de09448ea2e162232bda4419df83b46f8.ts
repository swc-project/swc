// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/headers.ts


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

// Heavily inspired by Golang's https://golang.org/src/net/http/header.go

import { ErrorCode, NatsError } from "./error.ts";
import { TD, TE } from "./encoders.ts";

export interface MsgHdrs extends Iterable<[string, string[]]> {
  get(k: string): string;
  set(k: string, v: string): void;
  append(k: string, v: string): void;
  has(k: string): boolean;
  values(k: string): string[];
  delete(k: string): void;
}

export function headers(): MsgHdrs {
  return new MsgHdrsImpl();
}

export class MsgHdrsImpl implements MsgHdrs {
  static CRLF = "\r\n";
  static SEP = ": ";
  static HEADER = "NATS/1.0";
  error?: number;
  headers: Map<string, string[]> = new Map();

  constructor() {}

  [Symbol.iterator]() {
    return this.headers.entries();
  }

  size(): number {
    let count = 0;
    for (const [_, v] of this.headers.entries()) {
      count += v.length;
    }
    return count;
  }

  equals(mh: MsgHdrsImpl) {
    if (
      mh && this.headers.size === mh.headers.size &&
      this.error === mh.error
    ) {
      for (const [k, v] of this.headers) {
        const a = mh.values(k);
        if (v.length !== a.length) {
          return false;
        }
        const vv = [...v].sort();
        const aa = [...a].sort();
        for (let i = 0; i < vv.length; i++) {
          if (vv[i] !== aa[i]) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  static decode(a: Uint8Array): MsgHdrsImpl {
    const mh = new MsgHdrsImpl();
    const s = TD.decode(a);
    const lines = s.split(MsgHdrsImpl.CRLF);
    const h = lines[0];
    if (h !== MsgHdrsImpl.HEADER) {
      const str = h.replace(MsgHdrsImpl.HEADER, "");
      mh.error = parseInt(str, 10);
    } else {
      lines.slice(1).map((s) => {
        if (s) {
          const idx = s.indexOf(MsgHdrsImpl.SEP);
          const k = s.slice(0, idx);
          const v = s.slice(idx + 2);
          mh.append(k, v);
        }
      });
    }
    return mh;
  }

  toString(): string {
    if (this.headers.size === 0) {
      return "";
    }
    let s = MsgHdrsImpl.HEADER;
    for (const [k, v] of this.headers) {
      for (let i = 0; i < v.length; i++) {
        s = `${s}\r\n${k}: ${v[i]}`;
      }
    }
    return `${s}\r\n\r\n`;
  }

  encode(): Uint8Array {
    return TE.encode(this.toString());
  }

  // https://www.ietf.org/rfc/rfc822.txt
  // 3.1.2.  STRUCTURE OF HEADER FIELDS
  //
  // Once a field has been unfolded, it may be viewed as being com-
  // posed of a field-name followed by a colon (":"), followed by a
  // field-body, and  terminated  by  a  carriage-return/line-feed.
  // The  field-name must be composed of printable ASCII characters
  // (i.e., characters that  have  values  between  33.  and  126.,
  // decimal, except colon).  The field-body may be composed of any
  // ASCII characters, except CR or LF.  (While CR and/or LF may be
  // present  in the actual text, they are removed by the action of
  // unfolding the field.)
  static canonicalMIMEHeaderKey(k: string): string {
    const a = 97;
    const A = 65;
    const Z = 90;
    const z = 122;
    const dash = 45;
    const colon = 58;
    const start = 33;
    const end = 126;
    const toLower = a - A;

    let upper = true;
    const buf: number[] = new Array(k.length);
    for (let i = 0; i < k.length; i++) {
      let c = k.charCodeAt(i);
      if (c === colon || c < start || c > end) {
        throw new NatsError(
          `'${k[i]}' is not a valid character for a header key`,
          ErrorCode.BAD_HEADER,
        );
      }
      if (upper && a <= c && c <= z) {
        c -= toLower;
      } else if (!upper && A <= c && c <= Z) {
        c += toLower;
      }
      buf[i] = c;
      upper = c == dash;
    }
    return String.fromCharCode(...buf);
  }

  static validHeaderValue(k: string): string {
    const inv = /[\r\n]/;
    if (inv.test(k)) {
      throw new NatsError(
        "invalid header value - \\r and \\n are not allowed.",
        ErrorCode.BAD_HEADER,
      );
    }
    return k.trim();
  }

  get(k: string): string {
    const key = MsgHdrsImpl.canonicalMIMEHeaderKey(k);
    const a = this.headers.get(key);
    return a ? a[0] : "";
  }

  has(k: string): boolean {
    return this.get(k) !== "";
  }

  set(k: string, v: string): void {
    const key = MsgHdrsImpl.canonicalMIMEHeaderKey(k);
    const value = MsgHdrsImpl.validHeaderValue(v);
    this.headers.set(key, [value]);
  }

  append(k: string, v: string): void {
    const key = MsgHdrsImpl.canonicalMIMEHeaderKey(k);
    const value = MsgHdrsImpl.validHeaderValue(v);
    let a = this.headers.get(key);
    if (!a) {
      a = [];
      this.headers.set(key, a);
    }
    a.push(value);
  }

  values(k: string): string[] {
    const key = MsgHdrsImpl.canonicalMIMEHeaderKey(k);
    return this.headers.get(key) || [];
  }

  delete(k: string): void {
    const key = MsgHdrsImpl.canonicalMIMEHeaderKey(k);
    this.headers.delete(key);
  }
}
