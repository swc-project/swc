// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/subscription.ts


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
import { QueuedIterator } from "./queued_iterator.ts";
import type { Base, Msg, Subscription, SubscriptionOptions } from "./types.ts";
import { deferred, extend, Timeout, timeout } from "./util.ts";
import { ErrorCode, NatsError } from "./error.ts";
import type { ProtocolHandler } from "./protocol.ts";

export class SubscriptionImpl extends QueuedIterator<Msg>
  implements Base, Subscription {
  sid!: number;
  queue?: string;
  draining: boolean = false;
  max?: number;
  subject: string;
  drained?: Promise<void>;
  protocol: ProtocolHandler;
  timer?: Timeout<void>;

  constructor(
    protocol: ProtocolHandler,
    subject: string,
    opts: SubscriptionOptions = {},
  ) {
    super();
    extend(this, opts);
    this.protocol = protocol;
    this.subject = subject;
    this.noIterator = typeof opts.callback === "function";

    if (opts.timeout) {
      this.timer = timeout<void>(opts.timeout);
      this.timer
        .then(() => {
          // timer was cancelled
          this.timer = undefined;
        })
        .catch((err) => {
          // timer fired
          this.stop(err);
        });
    }
  }

  callback(err: NatsError | null, msg: Msg) {
    this.cancelTimeout();
    err ? this.stop(err) : this.push(msg);
  }

  close(): void {
    if (!this.isClosed()) {
      this.cancelTimeout();
      this.stop();
    }
  }

  unsubscribe(max?: number): void {
    this.protocol.unsubscribe(this, max);
  }

  cancelTimeout(): void {
    if (this.timer) {
      this.timer.cancel();
      this.timer = undefined;
    }
  }

  drain(): Promise<void> {
    if (this.protocol.isClosed()) {
      throw NatsError.errorForCode(ErrorCode.CONNECTION_CLOSED);
    }
    if (this.isClosed()) {
      throw NatsError.errorForCode(ErrorCode.SUB_CLOSED);
    }
    if (!this.drained) {
      this.protocol.unsub(this);
      this.drained = this.protocol.flush(deferred<void>());
      this.drained.then(() => {
        this.protocol.subscriptions.cancel(this);
      });
    }
    return this.drained;
  }

  isDraining(): boolean {
    return this.draining;
  }

  isClosed(): boolean {
    return this.done;
  }

  getSubject(): string {
    return this.subject;
  }

  getMax(): number | undefined {
    return this.max;
  }

  getID(): number {
    return this.sid;
  }
}
