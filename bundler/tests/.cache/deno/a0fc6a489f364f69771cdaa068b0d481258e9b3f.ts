// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/utility/encode.ts


import { RawBinary } from "../binary.ts";

export class encode {
  static hex(data: string) {
    if (data.length % 2 !== 0) throw "Invalid hex format";

    const output = new RawBinary(data.length >> 1);
    let ptr = 0;

    for (let i = 0; i < data.length; i += 2) {
      output[ptr++] = parseInt(data.substr(i, 2), 16);
    }

    return output;
  }

  static bigint(n: bigint) {
    const bytes = [];
    while (n > 0) {
      bytes.push(Number(n & 255n));
      n = n >> 8n;
    }

    bytes.reverse();
    return new RawBinary(bytes);
  }

  static string(data: string) {
    return new RawBinary(new TextEncoder().encode(data));
  }

  static base64(data: string) {
    return new RawBinary(Uint8Array.from(atob(data), (c) => c.charCodeAt(0)));
  }

  static base64url(data: string) {
    let input = data
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const pad = input.length % 4;
    if (pad) {
      if (pad === 1) throw "Invalid length";
      input += new Array(5 - pad).join("=");
    }

    return encode.base64(input);
  }

  static binary(data: Uint8Array | number[]) {
    return new RawBinary(data);
  }

  static base32(data: string) {
    // Ignore case
    data = data.toUpperCase();

    // Ignore padding
    data = data.replace(/=+$/g, "");

    const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const size = (data.length * 5) >> 3;
    const output = new RawBinary(size);

    let ptr = 0;
    let bits = 0;
    let current = 0;

    for (let i = 0; i < data.length; i++) {
      const value = lookup.indexOf(data[i]);

      if (value < 0) throw "Invalid base32 format";

      current = (current << 5) + value;
      bits += 5;

      if (bits >= 8) {
        bits -= 8;
        const t = current >> bits;
        current -= t << bits;
        output[ptr++] = t;
      }
    }

    return output;
  }
}
