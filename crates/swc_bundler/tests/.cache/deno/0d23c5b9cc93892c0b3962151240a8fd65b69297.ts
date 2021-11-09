// Loaded from https://deno.land/std@0.89.0/io/writers.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
type Writer = Deno.Writer;
type WriterSync = Deno.WriterSync;

/** Writer utility for buffering string chunks */
export class StringWriter implements Writer, WriterSync {
  private chunks: Uint8Array[] = [];
  private byteLength = 0;
  private cache: string | undefined;

  constructor(private base: string = "") {
    const c = new TextEncoder().encode(base);
    this.chunks.push(c);
    this.byteLength += c.byteLength;
  }

  write(p: Uint8Array): Promise<number> {
    return Promise.resolve(this.writeSync(p));
  }

  writeSync(p: Uint8Array): number {
    this.chunks.push(p);
    this.byteLength += p.byteLength;
    this.cache = undefined;
    return p.byteLength;
  }

  toString(): string {
    if (this.cache) {
      return this.cache;
    }
    const buf = new Uint8Array(this.byteLength);
    let offs = 0;
    for (const chunk of this.chunks) {
      buf.set(chunk, offs);
      offs += chunk.byteLength;
    }
    this.cache = new TextDecoder().decode(buf);
    return this.cache;
  }
}
