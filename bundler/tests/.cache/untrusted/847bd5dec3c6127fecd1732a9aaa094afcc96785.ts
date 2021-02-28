// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/subscriptions.ts


/*
 * Copyright 2020-2021 The NATS Authors
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
import type { SubscriptionImpl } from "./subscription.ts";
import type { NatsError } from "./error.ts";
import type { Msg } from "./types.ts";

export class Subscriptions {
  mux!: SubscriptionImpl;
  subs: Map<number, SubscriptionImpl>;
  sidCounter: number;

  constructor() {
    this.sidCounter = 0;
    this.subs = new Map<number, SubscriptionImpl>();
  }

  size(): number {
    return this.subs.size;
  }

  add(s: SubscriptionImpl): SubscriptionImpl {
    this.sidCounter++;
    s.sid = this.sidCounter;
    this.subs.set(s.sid, s as SubscriptionImpl);
    return s;
  }

  setMux(s: SubscriptionImpl): SubscriptionImpl {
    this.mux = s;
    return s;
  }

  getMux(): SubscriptionImpl | null {
    return this.mux;
  }

  get(sid: number): (SubscriptionImpl | undefined) {
    return this.subs.get(sid);
  }

  all(): (SubscriptionImpl)[] {
    const buf = [];
    for (const s of this.subs.values()) {
      buf.push(s);
    }
    return buf;
  }

  cancel(s: SubscriptionImpl): void {
    if (s) {
      s.close();
      if (s.cleanupFn) {
        try {
          s.cleanupFn(s, s.info);
        } catch (err) {
          // ignoring
        }
      }
      this.subs.delete(s.sid);
    }
  }

  handleError(err?: NatsError): boolean {
    let handled = false;
    if (err) {
      const re = /^'Permissions Violation for Subscription to "(\S+)"'/i;
      const ma = re.exec(err.message);
      if (ma) {
        const subj = ma[1];
        this.subs.forEach((sub) => {
          if (subj == sub.subject) {
            sub.callback(err, {} as Msg);
            sub.close();
            handled = sub !== this.mux;
          }
        });
      }
    }
    return handled;
  }

  close() {
    this.subs.forEach((sub) => {
      sub.close();
    });
  }
}
