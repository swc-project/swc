// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/request.ts


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
import { Deferred, deferred, extend, Timeout, timeout } from "./util.ts";
import type { Msg, RequestOptions } from "./types.ts";
import { ErrorCode, NatsError } from "./error.ts";
import type { MuxSubscription } from "./muxsubscription.ts";
import { nuid } from "./nuid.ts";

export class Request {
  token: string;
  received: number = 0;
  deferred: Deferred<Msg> = deferred();
  timer: Timeout<Msg>;
  private mux: MuxSubscription;

  constructor(
    mux: MuxSubscription,
    opts: RequestOptions = { timeout: 1000 },
  ) {
    this.mux = mux;
    this.token = nuid.next();
    extend(this, opts);
    this.timer = timeout<Msg>(opts.timeout);
  }

  resolver(err: Error | null, msg: Msg): void {
    if (this.timer) {
      this.timer.cancel();
    }
    if (err) {
      this.deferred.reject(err);
    } else {
      this.deferred.resolve(msg);
    }
    this.cancel();
  }

  cancel(err?: NatsError): void {
    if (this.timer) {
      this.timer.cancel();
    }
    this.mux.cancel(this);
    this.deferred.reject(
      err ? err : NatsError.errorForCode(ErrorCode.CANCELLED),
    );
  }
}
