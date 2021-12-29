// Loaded from https://deno.land/std@0.114.0/async/tee.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

// Utility for representing n-tuple
type Tuple<T, N extends number> = N extends N
  ? number extends N ? T[] : TupleOf<T, N, []>
  : never;
type TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : TupleOf<T, N, [T, ...R]>;

interface QueueNode<T> {
  value: T;
  next: QueueNode<T> | undefined;
}

class Queue<T> {
  #source: AsyncIterator<T>;
  #queue: QueueNode<T>;
  head: QueueNode<T>;

  done: boolean;

  constructor(iterable: AsyncIterable<T>) {
    this.#source = iterable[Symbol.asyncIterator]();
    this.#queue = {
      value: undefined!,
      next: undefined,
    };
    this.head = this.#queue;
    this.done = false;
  }

  async next(): Promise<void> {
    const result = await this.#source.next();
    if (!result.done) {
      const nextNode: QueueNode<T> = {
        value: result.value,
        next: undefined,
      };
      this.#queue.next = nextNode;
      this.#queue = nextNode;
    } else {
      this.done = true;
    }
  }
}

/**
 * Branches the given async iterable into the n branches.
 *
 * Example:
 *
 * ```ts
 *     import { tee } from "./tee.ts";
 *
 *     const gen = async function* gen() {
 *       yield 1;
 *       yield 2;
 *       yield 3;
 *     }
 *
 *     const [branch1, branch2] = tee(gen());
 *
 *     (async () => {
 *       for await (const n of branch1) {
 *         console.log(n); // => 1, 2, 3
 *       }
 *     })();
 *
 *     (async () => {
 *       for await (const n of branch2) {
 *         console.log(n); // => 1, 2, 3
 *       }
 *     })();
 * ```
 */
export function tee<T, N extends number = 2>(
  iterable: AsyncIterable<T>,
  n: N = 2 as N,
): Tuple<AsyncIterable<T>, N> {
  const queue = new Queue<T>(iterable);

  async function* generator(): AsyncGenerator<T> {
    let buffer = queue.head;
    while (true) {
      if (buffer.next) {
        buffer = buffer.next;
        yield buffer.value;
      } else if (queue.done) {
        return;
      } else {
        await queue.next();
      }
    }
  }

  const branches = Array.from({ length: n }).map(
    () => generator(),
  ) as Tuple<
    AsyncIterable<T>,
    N
  >;
  return branches;
}
