// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/denobuffer.ts


// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This code has been ported almost directly from Go's src/bytes/buffer.go
// Copyright 2009 The Go Authors. All rights reserved. BSD license.
// https://github.com/golang/go/blob/master/LICENSE

// This code removes all Deno specific functionality to enable its use
// in a browser environment

//@internal
import { TE } from "./encoders.ts";

export class AssertionError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "AssertionError";
  }
}

export interface Reader {
  read(p: Uint8Array): number | null;
}

export interface Writer {
  write(p: Uint8Array): number;
}

// @internal
export function assert(cond: unknown, msg = "Assertion failed."): asserts cond {
  if (!cond) {
    throw new AssertionError(msg);
  }
}

// MIN_READ is the minimum ArrayBuffer size passed to a read call by
// buffer.ReadFrom. As long as the Buffer has at least MIN_READ bytes beyond
// what is required to hold the contents of r, readFrom() will not grow the
// underlying buffer.
const MIN_READ = 32 * 1024;

export const MAX_SIZE = 2 ** 32 - 2;

// `off` is the offset into `dst` where it will at which to begin writing values
// from `src`.
// Returns the number of bytes copied.
function copy(src: Uint8Array, dst: Uint8Array, off = 0): number {
  const r = dst.byteLength - off;
  if (src.byteLength > r) {
    src = src.subarray(0, r);
  }
  dst.set(src, off);
  return src.byteLength;
}

export function concat(origin?: Uint8Array, b?: Uint8Array): Uint8Array {
  if (origin === undefined && b === undefined) {
    return new Uint8Array(0);
  }
  if (origin === undefined) {
    return b!;
  }
  if (b === undefined) {
    return origin;
  }
  const output = new Uint8Array(origin.length + b.length);
  output.set(origin, 0);
  output.set(b, origin.length);
  return output;
}

export function append(origin: Uint8Array, b: number): Uint8Array {
  return concat(origin, Uint8Array.of(b));
}

export class DenoBuffer implements Reader, Writer {
  _buf: Uint8Array; // contents are the bytes _buf[off : len(_buf)]
  _off = 0; // read at _buf[off], write at _buf[_buf.byteLength]

  constructor(ab?: ArrayBuffer) {
    if (ab == null) {
      this._buf = new Uint8Array(0);
      return;
    }

    this._buf = new Uint8Array(ab);
  }

  bytes(options: { copy?: boolean } = { copy: true }): Uint8Array {
    if (options.copy === false) return this._buf.subarray(this._off);
    return this._buf.slice(this._off);
  }

  empty(): boolean {
    return this._buf.byteLength <= this._off;
  }

  get length(): number {
    return this._buf.byteLength - this._off;
  }

  get capacity(): number {
    return this._buf.buffer.byteLength;
  }

  truncate(n: number): void {
    if (n === 0) {
      this.reset();
      return;
    }
    if (n < 0 || n > this.length) {
      throw Error("bytes.Buffer: truncation out of range");
    }
    this._reslice(this._off + n);
  }

  reset(): void {
    this._reslice(0);
    this._off = 0;
  }

  _tryGrowByReslice = (n: number): number => {
    const l = this._buf.byteLength;
    if (n <= this.capacity - l) {
      this._reslice(l + n);
      return l;
    }
    return -1;
  };

  _reslice = (len: number): void => {
    assert(len <= this._buf.buffer.byteLength);
    this._buf = new Uint8Array(this._buf.buffer, 0, len);
  };

  readByte(): number | null {
    const a = new Uint8Array(1);
    if (this.read(a)) {
      return a[0];
    }
    return null;
  }

  read(p: Uint8Array): number | null {
    if (this.empty()) {
      // Buffer is empty, reset to recover space.
      this.reset();
      if (p.byteLength === 0) {
        // this edge case is tested in 'bufferReadEmptyAtEOF' test
        return 0;
      }
      return null;
    }
    const nread = copy(this._buf.subarray(this._off), p);
    this._off += nread;
    return nread;
  }

  writeByte(n: number): number {
    return this.write(Uint8Array.of(n));
  }

  writeString(s: string): number {
    return this.write(TE.encode(s));
  }

  write(p: Uint8Array): number {
    const m = this._grow(p.byteLength);
    return copy(p, this._buf, m);
  }

  _grow = (n: number): number => {
    const m = this.length;
    // If buffer is empty, reset to recover space.
    if (m === 0 && this._off !== 0) {
      this.reset();
    }
    // Fast: Try to _grow by means of a _reslice.
    const i = this._tryGrowByReslice(n);
    if (i >= 0) {
      return i;
    }
    const c = this.capacity;
    if (n <= Math.floor(c / 2) - m) {
      // We can slide things down instead of allocating a new
      // ArrayBuffer. We only need m+n <= c to slide, but
      // we instead let capacity get twice as large so we
      // don't spend all our time copying.
      copy(this._buf.subarray(this._off), this._buf);
    } else if (c + n > MAX_SIZE) {
      throw new Error("The buffer cannot be grown beyond the maximum size.");
    } else {
      // Not enough space anywhere, we need to allocate.
      const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE));
      copy(this._buf.subarray(this._off), buf);
      this._buf = buf;
    }
    // Restore this.off and len(this._buf).
    this._off = 0;
    this._reslice(Math.min(m + n, MAX_SIZE));
    return m;
  };

  grow(n: number): void {
    if (n < 0) {
      throw Error("Buffer._grow: negative count");
    }
    const m = this._grow(n);
    this._reslice(m);
  }

  readFrom(r: Reader): number {
    let n = 0;
    const tmp = new Uint8Array(MIN_READ);
    while (true) {
      const shouldGrow = this.capacity - this.length < MIN_READ;
      // read into tmp buffer if there's not enough room
      // otherwise read directly into the internal buffer
      const buf = shouldGrow
        ? tmp
        : new Uint8Array(this._buf.buffer, this.length);

      const nread = r.read(buf);
      if (nread === null) {
        return n;
      }

      // write will grow if needed
      if (shouldGrow) this.write(buf.subarray(0, nread));
      else this._reslice(this.length + nread);

      n += nread;
    }
  }
}

export function readAll(r: Reader): Uint8Array {
  const buf = new DenoBuffer();
  buf.readFrom(r);
  return buf.bytes();
}

export function writeAll(w: Writer, arr: Uint8Array): void {
  let nwritten = 0;
  while (nwritten < arr.length) {
    nwritten += w.write(arr.subarray(nwritten));
  }
}
