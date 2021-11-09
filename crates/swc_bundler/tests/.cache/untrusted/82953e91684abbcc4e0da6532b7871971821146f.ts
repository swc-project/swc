// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/queued_iterator.ts


/*
 * Copyright 2020 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { deferred } from "./util.ts";
import { ErrorCode, NatsError } from "./error.ts";

export interface Dispatcher<T> {
  push(v: T): void;
}

export class QueuedIterator<T> implements Dispatcher<T> {
  inflight = 0;
  processed = 0;
  received = 0; // this is updated by the protocol
  protected noIterator = false;
  protected done = false;
  private signal = deferred<void>();
  private yields: T[] = [];
  private err?: Error;

  [Symbol.asyncIterator]() {
    return this.iterate();
  }

  push(v: T) {
    if (this.done) {
      return;
    }
    this.yields.push(v);
    this.signal.resolve();
  }

  async *iterate(): AsyncIterableIterator<T> {
    if (this.noIterator) {
      throw new NatsError("unsupported iterator", ErrorCode.API_ERROR);
    }
    while (true) {
      if (this.yields.length === 0) {
        await this.signal;
      }
      if (this.err) {
        throw this.err;
      }
      const yields = this.yields;
      this.inflight = yields.length;
      this.yields = [];
      for (let i = 0; i < yields.length; i++) {
        this.processed++;
        yield yields[i];
        this.inflight--;
      }
      // yielding could have paused and microtask
      // could have added messages. Prevent allocations
      // if possible
      if (this.done) {
        break;
      } else if (this.yields.length === 0) {
        yields.length = 0;
        this.yields = yields;
        this.signal = deferred();
      }
    }
  }

  stop(err?: Error): void {
    this.err = err;
    this.done = true;
    this.signal.resolve();
  }

  getProcessed(): number {
    return this.noIterator ? this.received : this.processed;
  }

  getPending(): number {
    return this.yields.length + this.inflight;
  }

  getReceived(): number {
    return this.received;
  }
}
