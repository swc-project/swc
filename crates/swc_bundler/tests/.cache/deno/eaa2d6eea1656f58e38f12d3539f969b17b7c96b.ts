// Loaded from https://deno.land/x/oak/async_iterable_reader.ts


// Copyright 2018-2021 the oak authors. All rights reserved. MIT license.

import { copyBytes } from "./deps.ts";

export class AsyncIterableReader<T> implements Deno.Reader {
  #asyncIterator: AsyncIterator<T>;
  #closed = false;
  #current: Uint8Array | undefined;
  #processValue: (value: T) => Uint8Array;

  constructor(
    asyncIterable: AsyncIterable<T>,
    processValue: (value: T) => Uint8Array,
  ) {
    this.#asyncIterator = asyncIterable[Symbol.asyncIterator]();
    this.#processValue = processValue;
  }

  #close = () => {
    if (this.#asyncIterator.return) {
      this.#asyncIterator.return();
    }
    // deno-lint-ignore no-explicit-any
    (this as any).#asyncIterator = undefined;
    this.#closed = true;
  };

  async read(p: Uint8Array): Promise<number | null> {
    if (this.#closed) {
      return null;
    }
    if (p.byteLength === 0) {
      this.#close();
      return 0;
    }
    if (!this.#current) {
      const { value, done } = await this.#asyncIterator.next();
      if (done) {
        this.#close();
      }
      if (value !== undefined) {
        this.#current = this.#processValue(value);
      }
    }
    if (!this.#current) {
      if (!this.#closed) {
        this.#close();
      }
      return null;
    }
    const len = copyBytes(this.#current, p);
    if (len >= this.#current.byteLength) {
      this.#current = undefined;
    } else {
      this.#current = this.#current.slice(len);
    }
    return len;
  }
}
