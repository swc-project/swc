// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/ipparser.ts


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

// JavaScript port of go net/ip/ParseIP
// https://github.com/golang/go/blob/master/src/net/ip.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const IPv4LEN = 4;
const IPv6LEN = 16;
const ASCII_0 = 48;
const ASCII_9 = 57;
const ASCII_A = 65;
const ASCII_F = 70;
const ASCII_a = 97;
const ASCII_f = 102;
const big = 0xFFFFFF;

export function ipV4(a: number, b: number, c: number, d: number): Uint8Array {
  const ip = new Uint8Array(IPv6LEN);
  const prefix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff];
  prefix.forEach((v, idx) => {
    ip[idx] = v;
  });
  ip[12] = a;
  ip[13] = b;
  ip[14] = c;
  ip[15] = d;

  return ip;
}

export function isIP(h: string) {
  return parseIP(h) !== undefined;
}

export function parseIP(h: string): (Uint8Array | undefined) {
  for (let i = 0; i < h.length; i++) {
    switch (h[i]) {
      case ".":
        return parseIPv4(h);
      case ":":
        return parseIPv6(h);
    }
  }
  return;
}

function parseIPv4(s: string): (Uint8Array | undefined) {
  const ip = new Uint8Array(IPv4LEN);
  for (let i = 0; i < IPv4LEN; i++) {
    if (s.length === 0) {
      return undefined;
    }
    if (i > 0) {
      if (s[0] !== ".") {
        return undefined;
      }
      s = s.substring(1);
    }
    const { n, c, ok } = dtoi(s);
    if (!ok || n > 0xFF) {
      return undefined;
    }
    s = s.substring(c);
    ip[i] = n;
  }
  return ipV4(ip[0], ip[1], ip[2], ip[3]);
}

function parseIPv6(s: string): (Uint8Array | undefined) {
  const ip = new Uint8Array(IPv6LEN);
  let ellipsis = -1;

  if (s.length >= 2 && s[0] === ":" && s[1] === ":") {
    ellipsis = 0;
    s = s.substring(2);
    if (s.length === 0) {
      return ip;
    }
  }

  let i = 0;
  while (i < IPv6LEN) {
    const { n, c, ok } = xtoi(s);
    if (!ok || n > 0xFFFF) {
      return undefined;
    }

    if (c < s.length && s[c] === ".") {
      if (ellipsis < 0 && i != IPv6LEN - IPv4LEN) {
        return undefined;
      }
      if (i + IPv4LEN > IPv6LEN) {
        return undefined;
      }
      const ip4 = parseIPv4(s);
      if (ip4 === undefined) {
        return undefined;
      }
      ip[i] = ip4[12];
      ip[i + 1] = ip4[13];
      ip[i + 2] = ip4[14];
      ip[i + 3] = ip4[15];
      s = "";
      i += IPv4LEN;
      break;
    }

    ip[i] = n >> 8;
    ip[i + 1] = n;
    i += 2;

    s = s.substring(c);
    if (s.length === 0) {
      break;
    }

    if (s[0] !== ":" || s.length == 1) {
      return undefined;
    }

    s = s.substring(1);

    if (s[0] === ":") {
      if (ellipsis >= 0) {
        return undefined;
      }
      ellipsis = i;
      s = s.substring(1);
      if (s.length === 0) {
        break;
      }
    }
  }

  if (s.length !== 0) {
    return undefined;
  }

  if (i < IPv6LEN) {
    if (ellipsis < 0) {
      return undefined;
    }

    let n = IPv6LEN - i;
    for (let j = i - 1; j >= ellipsis; j--) {
      ip[j + n] = ip[j];
    }
    for (let j = ellipsis + n - 1; j >= ellipsis; j--) {
      ip[j] = 0;
    }
  } else if (ellipsis >= 0) {
    return undefined;
  }
  return ip;
}

function dtoi(s: string): { n: number; c: number; ok: boolean } {
  let i = 0;
  let consumed = 0;
  let n = 0;
  for (
    i = 0;
    i < s.length && ASCII_0 <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII_9;
    i++
  ) {
    n = n * 10 + (s.charCodeAt(i) - ASCII_0);
    if (n >= big) {
      return { n: big, c: i, ok: false };
    }
  }
  if (i === 0) {
    return { n: 0, c: 0, ok: false };
  }
  return { n: n, c: i, ok: true };
}

function xtoi(s: string): { n: number; c: number; ok: boolean } {
  let n = 0;
  let i = 0;
  for (i = 0; i < s.length; i++) {
    if (ASCII_0 <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII_9) {
      n *= 16;
      n += (s.charCodeAt(i) - ASCII_0);
    } else if (ASCII_a <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII_f) {
      n *= 16;
      n += (s.charCodeAt(i) - ASCII_a) + 10;
    } else if (ASCII_A <= s.charCodeAt(i) && s.charCodeAt(i) <= ASCII_F) {
      n *= 16;
      n += (s.charCodeAt(i) - ASCII_A) + 10;
    } else {
      break;
    }
    if (n >= big) {
      return { n: 0, c: i, ok: false };
    }
  }
  if (i === 0) {
    return { n: 0, c: i, ok: false };
  }
  return { n: n, c: i, ok: true };
}
