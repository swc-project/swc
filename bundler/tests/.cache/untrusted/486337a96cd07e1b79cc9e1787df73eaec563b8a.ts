// Loaded from https://denopkg.com/chiefbiiko/sha256@v1.0.2/mod.ts


import {
  encode,
  decode
} from "./deps.ts";

/** Byte length of a SHA256 hash. */
export const BYTES: number = 32;

/** A class representation of the SHA256 algorithm. */
export class SHA256 {
  readonly hashSize: number = BYTES;

  private _buf: Uint8Array;
  private _bufIdx!: number;
  private _count!: Uint32Array;
  private _K: Uint32Array;
  private _H!: Uint32Array;
  private _finalized!: boolean;

  /** Creates a SHA256 instance. */
  constructor() {
    this._buf = new Uint8Array(64);

    // prettier-ignore
    this._K = new Uint32Array([
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
      0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
      0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
      0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
      0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
      0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);

    this.init();
  }

  /** Initializes a hash. */
  init(): SHA256 {
    // prettier-ignore
    this._H = new Uint32Array([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);

    this._bufIdx = 0;
    this._count = new Uint32Array(2);
    this._buf.fill(0);
    this._finalized = false;

    return this;
  }

  /** Updates the hash with additional message data. */
  update(msg: string | Uint8Array, inputEncoding?: string): SHA256 {
    if (msg === null) {
      throw new TypeError("msg must be a string or Uint8Array.");
    } else if (typeof msg === "string") {
      msg = encode(msg, inputEncoding) as Uint8Array;
    }

    // process the msg as many times as possible, the rest is stored in the buffer
    // message is processed in 512 bit (64 byte chunks)
    for (let i: number = 0, len = msg.length; i < len; i++) {
      this._buf[this._bufIdx++] = msg[i];

      if (this._bufIdx === 64) {
        this._transform();
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

  /** Finalizes the hash with additional message data. */
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
        this._transform();
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

    this._transform();

    // return the hash as byte array
    const hash: Uint8Array = new Uint8Array(BYTES);

    // let i: number;
    for (let i: number = 0; i < 8; i++) {
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
  private _transform(): void {
    const h: Uint32Array = this._H;

    let h0: number = h[0];
    let h1: number = h[1];
    let h2: number = h[2];
    let h3: number = h[3];
    let h4: number = h[4];
    let h5: number = h[5];
    let h6: number = h[6];
    let h7: number = h[7];

    // convert byte buffer into w[0..15]
    const w: Uint32Array = new Uint32Array(16);
    let i: number;

    for (i = 0; i < 16; i++) {
      w[i] =
        this._buf[(i << 2) + 3] |
        (this._buf[(i << 2) + 2] << 8) |
        (this._buf[(i << 2) + 1] << 16) |
        (this._buf[i << 2] << 24);
    }

    for (i = 0; i < 64; i++) {
      let tmp: number;
      if (i < 16) {
        tmp = w[i];
      } else {
        let a = w[(i + 1) & 15];
        let b = w[(i + 14) & 15];
        tmp = w[i & 15] =
          (((a >>> 7) ^ (a >>> 18) ^ (a >>> 3) ^ (a << 25) ^ (a << 14)) +
            ((b >>> 17) ^ (b >>> 19) ^ (b >>> 10) ^ (b << 15) ^ (b << 13)) +
            w[i & 15] +
            w[(i + 9) & 15]) |
          0;
      }

      tmp =
        (tmp +
          h7 +
          ((h4 >>> 6) ^
            (h4 >>> 11) ^
            (h4 >>> 25) ^
            (h4 << 26) ^
            (h4 << 21) ^
            (h4 << 7)) +
          (h6 ^ (h4 & (h5 ^ h6))) +
          this._K[i]) |
        0;

      h7 = h6;
      h6 = h5;
      h5 = h4;
      h4 = h3 + tmp;
      h3 = h2;
      h2 = h1;
      h1 = h0;
      h0 =
        (tmp +
          ((h1 & h2) ^ (h3 & (h1 ^ h2))) +
          ((h1 >>> 2) ^
            (h1 >>> 13) ^
            (h1 >>> 22) ^
            (h1 << 30) ^
            (h1 << 19) ^
            (h1 << 10))) |
        0;
    }

    h[0] = (h[0] + h0) | 0;
    h[1] = (h[1] + h1) | 0;
    h[2] = (h[2] + h2) | 0;
    h[3] = (h[3] + h3) | 0;
    h[4] = (h[4] + h4) | 0;
    h[5] = (h[5] + h5) | 0;
    h[6] = (h[6] + h6) | 0;
    h[7] = (h[7] + h7) | 0;
  }
}

/** Generates a SHA256 hash of the input data. */
export function sha256(
  msg: string | Uint8Array,
  inputEncoding?: string,
  outputEncoding?: string
): string | Uint8Array {
  return new SHA256().update(msg, inputEncoding).digest(outputEncoding);
}
