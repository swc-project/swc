// Loaded from https://denopkg.com/chiefbiiko/sha1@v1.0.3/mod.ts


import { encode, decode } from "./deps.ts";

function rotl(x: number, n: number): number {
  return (x << n) | (x >>> (32 - n));
}

/** Byte length of a SHA1 digest. */
export const BYTES: number = 20;

/**  A class representation of the SHA1 algorithm. */
export class SHA1 {
  readonly hashSize: number = BYTES;

  private _buf: Uint8Array = new Uint8Array(64);
  private _bufIdx!: number;
  private _count!: Uint32Array;
  private _K: Uint32Array = new Uint32Array([0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]);
  private _H!: Uint32Array;
  private _finalized!: boolean;

  /** Creates a SHA1 instance. */
  constructor() {
    this.init();
  }

  /** Reduces the four input numbers to a single one. */
  protected static F(t: number, b: number, c: number, d: number): number {
    if (t <= 19) {
      return (b & c) | (~b & d);
    } else if (t <= 39) {
      return b ^ c ^ d;
    } else if (t <= 59) {
      return (b & c) | (b & d) | (c & d);
    } else {
      return b ^ c ^ d;
    }
  }

  /** Initializes a hash instance. */
  init(): SHA1 {
    // prettier-ignore
    this._H = new Uint32Array([
      0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0
    ]);

    this._bufIdx = 0;
    this._count = new Uint32Array(2);
    this._buf.fill(0);
    this._finalized = false;

    return this;
  }

  /** Updates a hash with additional message data. */
  update(msg: string | Uint8Array, inputEncoding?: string): SHA1 {
    if (msg === null) {
      throw new TypeError("msg must be a string or Uint8Array.");
    } else if (typeof msg === "string") {
      msg = encode(msg, inputEncoding) as Uint8Array;
    }

    // process the msg as many times as possible, the rest is stored in the buffer
    // message is processed in 512 bit (64 byte chunks)
    for (let i: number = 0; i < msg.length; i++) {
      this._buf[this._bufIdx++] = msg[i];
      if (this._bufIdx === 64) {
        this.transform();
        this._bufIdx = 0;
      }
    }

    // counter update (number of message bits)
    const c: Uint32Array = this._count;

    if ((c[0] += msg.length << 3) < msg.length << 3) {
      c[1]++;
    }

    c[1] += msg.length >>> 29;

    return this;
  }

  /** Finalizes a hash with additional message data. */
  digest(outputEncoding?: string): string | Uint8Array {
    if (this._finalized) {
      throw new Error("digest has already been called.")
    }

    this._finalized = true;

    // append '1'
    const b: Uint8Array = this._buf;
    let idx: number = this._bufIdx;
    b[idx++] = 0x80;

    // zeropad up to byte pos 56
    while (idx !== 56) {
      if (idx === 64) {
        this.transform();
        idx = 0;
      }
      b[idx++] = 0;
    }

    // append length in bits
    const c: Uint32Array = this._count;

    b[56] = (c[1] >>> 24) & 0xff;
    b[57] = (c[1] >>> 16) & 0xff;
    b[58] = (c[1] >>> 8) & 0xff;
    b[59] = (c[1] >>> 0) & 0xff;
    b[60] = (c[0] >>> 24) & 0xff;
    b[61] = (c[0] >>> 16) & 0xff;
    b[62] = (c[0] >>> 8) & 0xff;
    b[63] = (c[0] >>> 0) & 0xff;

    this.transform();

    // return the hash as byte array (20 bytes)
    const hash: Uint8Array = new Uint8Array(BYTES);

    for (let i: number = 0; i < 5; i++) {
      hash[(i << 2) + 0] = (this._H[i] >>> 24) & 0xff;
      hash[(i << 2) + 1] = (this._H[i] >>> 16) & 0xff;
      hash[(i << 2) + 2] = (this._H[i] >>> 8) & 0xff;
      hash[(i << 2) + 3] = (this._H[i] >>> 0) & 0xff;
    }

    // clear internal states and prepare for new hash
    this.init();

    return outputEncoding ? decode(hash, outputEncoding) : hash;
  }

  /** Performs one transformation cycle. */
  private transform(): void {
    const h: Uint32Array = this._H;
    let a: number = h[0];
    let b: number = h[1];
    let c: number = h[2];
    let d: number = h[3];
    let e: number = h[4];

    // convert byte buffer to words
    const w: Uint32Array = new Uint32Array(80);

    for (let i: number = 0; i < 16; i++) {
      w[i] =
        this._buf[(i << 2) + 3] |
        (this._buf[(i << 2) + 2] << 8) |
        (this._buf[(i << 2) + 1] << 16) |
        (this._buf[i << 2] << 24);
    }

    for (let t: number = 0; t < 80; t++) {
      if (t >= 16) {
        w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
      }

      const tmp: number =
        (rotl(a, 5) +
          SHA1.F(t, b, c, d) +
          e +
          w[t] +
          this._K[Math.floor(t / 20)]) |
        0;

      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = tmp;
    }

    h[0] = (h[0] + a) | 0;
    h[1] = (h[1] + b) | 0;
    h[2] = (h[2] + c) | 0;
    h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0;
  }
}

/** Generates a SHA1 hash of the input data. */
export function sha1(
  msg: string | Uint8Array,
  inputEncoding?: string,
  outputEncoding?: string
): string | Uint8Array {
  return new SHA1().update(msg, inputEncoding).digest(outputEncoding);
}
