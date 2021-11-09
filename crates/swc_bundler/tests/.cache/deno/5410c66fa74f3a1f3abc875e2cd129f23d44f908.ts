// Loaded from https://deno.land/x/oak/buf_reader.ts


// Copyright 2018-2021 the oak authors. All rights reserved. MIT license.

import { assert } from "./deps.ts";
import { stripEol } from "./util.ts";

export interface ReadLineResult {
  bytes: Uint8Array;
  eol: boolean;
}

const DEFAULT_BUF_SIZE = 4096;
const MIN_BUF_SIZE = 16;
const MAX_CONSECUTIVE_EMPTY_READS = 100;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);

export class BufferFullError extends Error {
  name = "BufferFullError";
  constructor(public partial: Uint8Array) {
    super("Buffer full");
  }
}

/** BufReader implements buffering for a Reader object. */
export class BufReader {
  #buffer!: Uint8Array;
  #reader!: Deno.Reader;
  #posRead = 0;
  #posWrite = 0;
  #eof = false;

  // Reads a new chunk into the buffer.
  #fill = async (): Promise<void> => {
    // Slide existing data to beginning.
    if (this.#posRead > 0) {
      this.#buffer.copyWithin(0, this.#posRead, this.#posWrite);
      this.#posWrite -= this.#posRead;
      this.#posRead = 0;
    }

    if (this.#posWrite >= this.#buffer.byteLength) {
      throw Error("bufio: tried to fill full buffer");
    }

    // Read new data: try a limited number of times.
    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
      const rr = await this.#reader.read(this.#buffer.subarray(this.#posWrite));
      if (rr === null) {
        this.#eof = true;
        return;
      }
      assert(rr >= 0, "negative read");
      this.#posWrite += rr;
      if (rr > 0) {
        return;
      }
    }

    throw new Error(
      `No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`,
    );
  };

  #reset = (buffer: Uint8Array, reader: Deno.Reader): void => {
    this.#buffer = buffer;
    this.#reader = reader;
    this.#eof = false;
  };

  constructor(rd: Deno.Reader, size: number = DEFAULT_BUF_SIZE) {
    if (size < MIN_BUF_SIZE) {
      size = MIN_BUF_SIZE;
    }
    this.#reset(new Uint8Array(size), rd);
  }

  buffered(): number {
    return this.#posWrite - this.#posRead;
  }

  async readLine(
    strip = true,
  ): Promise<{ bytes: Uint8Array; eol: boolean } | null> {
    let line: Uint8Array | null;

    try {
      line = await this.readSlice(LF);
    } catch (err) {
      let { partial } = err;
      assert(
        partial instanceof Uint8Array,
        "Caught error from `readSlice()` without `partial` property",
      );

      // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
      // just return whatever is available and set the `more` flag.
      if (!(err instanceof BufferFullError)) {
        throw err;
      }

      // Handle the case where "\r\n" straddles the buffer.
      if (
        !this.#eof &&
        partial.byteLength > 0 &&
        partial[partial.byteLength - 1] === CR
      ) {
        // Put the '\r' back on buf and drop it from line.
        // Let the next call to ReadLine check for "\r\n".
        assert(
          this.#posRead > 0,
          "Tried to rewind past start of buffer",
        );
        this.#posRead--;
        partial = partial.subarray(0, partial.byteLength - 1);
      }

      return { bytes: partial, eol: this.#eof };
    }

    if (line === null) {
      return null;
    }

    if (line.byteLength === 0) {
      return { bytes: line, eol: true };
    }

    if (strip) {
      line = stripEol(line);
    }
    return { bytes: line, eol: true };
  }

  async readSlice(delim: number): Promise<Uint8Array | null> {
    let s = 0; // search start index
    let slice: Uint8Array | undefined;

    while (true) {
      // Search buffer.
      let i = this.#buffer.subarray(this.#posRead + s, this.#posWrite).indexOf(
        delim,
      );
      if (i >= 0) {
        i += s;
        slice = this.#buffer.subarray(this.#posRead, this.#posRead + i + 1);
        this.#posRead += i + 1;
        break;
      }

      // EOF?
      if (this.#eof) {
        if (this.#posRead === this.#posWrite) {
          return null;
        }
        slice = this.#buffer.subarray(this.#posRead, this.#posWrite);
        this.#posRead = this.#posWrite;
        break;
      }

      // Buffer full?
      if (this.buffered() >= this.#buffer.byteLength) {
        this.#posRead = this.#posWrite;
        // #4521 The internal buffer should not be reused across reads because it causes corruption of data.
        const oldbuf = this.#buffer;
        const newbuf = this.#buffer.slice(0);
        this.#buffer = newbuf;
        throw new BufferFullError(oldbuf);
      }

      s = this.#posWrite - this.#posRead; // do not rescan area we scanned before

      // Buffer is not full.
      try {
        await this.#fill();
      } catch (err) {
        err.partial = slice;
        throw err;
      }
    }
    return slice;
  }
}
