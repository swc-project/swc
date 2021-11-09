// Loaded from https://deno.land/x/mysql/src/deferred.ts


import { Deferred, deferred } from "../deps.ts";

/** @ignore */
export class DeferredStack<T> {
  private _queue: Deferred<T>[] = [];
  private _size = 0;

  constructor(
    readonly _maxSize: number,
    private _array: T[] = [],
    private readonly creator: () => Promise<T>,
  ) {
    this._size = _array.length;
  }

  get size(): number {
    return this._size;
  }

  get maxSize(): number {
    return this._maxSize;
  }

  get available(): number {
    return this._array.length;
  }

  async pop(): Promise<T> {
    if (this._array.length) {
      return this._array.pop()!;
    } else if (this._size < this._maxSize) {
      this._size++;
      let item: T;
      try {
        item = await this.creator();
      } catch (err) {
        this._size--;
        throw err;
      }
      return item;
    }
    const defer = deferred<T>();
    this._queue.push(defer);
    return await defer;
  }

  /** Returns false if the item is consumed by a deferred pop */
  push(item: T): boolean {
    if (this._queue.length) {
      this._queue.shift()!.resolve(item);
      return false;
    } else {
      this._array.push(item);
      return true;
    }
  }

  tryPopAvailable() {
    return this._array.pop();
  }

  remove(item: T): boolean {
    const index = this._array.indexOf(item);
    if (index < 0) return false;
    this._array.splice(index, 1);
    this._size--;
    return true;
  }

  reduceSize() {
    this._size--;
  }
}
