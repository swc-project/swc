// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/heartbeats.ts


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
import { Deferred, deferred } from "./util.ts";
import { DebugEvents, Status } from "./types.ts";

export interface PH {
  flush(p?: Deferred<void>): Promise<void>;
  disconnect(): void;
  dispatchStatus(status: Status): void;
}

export class Heartbeat {
  ph: PH;
  interval: number;
  maxOut: number;
  timer?: number;
  pendings: Promise<void>[];

  constructor(ph: PH, interval: number, maxOut: number) {
    this.ph = ph;
    this.interval = interval;
    this.maxOut = maxOut;
    this.pendings = [];
  }

  // api to start the heartbeats, since this can be
  // spuriously called from dial, ensure we don't
  // leak timers
  start() {
    this.cancel();
    this._schedule();
  }

  // api for canceling the heartbeats, if stale is
  // true it will initiate a client disconnect
  cancel(stale?: boolean) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this._reset();
    if (stale) {
      this.ph.disconnect();
    }
  }

  _schedule() {
    // @ts-ignore: node is not a number - we treat this opaquely
    this.timer = setTimeout(() => {
      this.ph.dispatchStatus(
        { type: DebugEvents.PING_TIMER, data: `${this.pendings.length + 1}` },
      );
      if (this.pendings.length === this.maxOut) {
        this.cancel(true);
        return;
      }
      const ping = deferred<void>();
      this.ph.flush(ping)
        .then(() => {
          this._reset();
        })
        .catch(() => {
          // we disconnected - pongs were rejected
          this.cancel();
        });
      this.pendings.push(ping);
      this._schedule();
    }, this.interval);
  }

  _reset() {
    // clear pendings after resolving them
    this.pendings = this.pendings.filter((p) => {
      const d = p as Deferred<void>;
      d.resolve();
      return false;
    });
  }
}
