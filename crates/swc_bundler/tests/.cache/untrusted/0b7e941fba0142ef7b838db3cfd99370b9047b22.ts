// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/connection/deferred.ts


import { Deferred, deferred } from "../deps.ts";

export class DeferredStack<T> {
  private _array: Array<T>;
  private _queue: Array<Deferred<T>>;
  private _maxSize: number;
  private _size: number;

  constructor(
    max?: number,
    ls?: Iterable<T>,
    private _creator?: () => Promise<T>,
  ) {
    this._maxSize = max || 10;
    this._array = ls ? [...ls] : [];
    this._size = this._array.length;
    this._queue = [];
  }

  async pop(): Promise<T> {
    if (this._array.length > 0) {
      return this._array.pop()!;
    } else if (this._size < this._maxSize && this._creator) {
      this._size++;
      return await this._creator();
    }
    const d = deferred<T>();
    this._queue.push(d);
    await d;
    return this._array.pop()!;
  }

  push(value: T): void {
    this._array.push(value);
    if (this._queue.length > 0) {
      const d = this._queue.shift()!;
      d.resolve();
    }
  }

  get size(): number {
    return this._size;
  }

  get available(): number {
    return this._array.length;
  }
}
