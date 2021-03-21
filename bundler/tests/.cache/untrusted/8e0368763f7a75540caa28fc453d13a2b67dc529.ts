// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/nats.ts


/*
 * Copyright 2018-2021 The NATS Authors
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

import { deferred, isUint8Array } from "./util.ts";
import { createInbox, ProtocolHandler } from "./protocol.ts";
import { SubscriptionImpl } from "./subscription.ts";
import { ErrorCode, NatsError } from "./error.ts";
import {
  ConnectionOptions,
  Empty,
  Msg,
  NatsConnection,
  PublishOptions,
  RequestOptions,
  ServerInfo,
  Stats,
  Status,
  Subscription,
  SubscriptionOptions,
} from "./types.ts";
import { parseOptions } from "./options.ts";
import { QueuedIterator } from "./queued_iterator.ts";
import { Request } from "./request.ts";
import { isRequestError } from "./msg.ts";

export class NatsConnectionImpl implements NatsConnection {
  options: ConnectionOptions;
  protocol!: ProtocolHandler;
  draining: boolean;
  listeners: QueuedIterator<Status>[];

  private constructor(opts: ConnectionOptions) {
    this.draining = false;
    this.options = parseOptions(opts);
    this.listeners = [];
  }

  public static connect(opts: ConnectionOptions = {}): Promise<NatsConnection> {
    return new Promise<NatsConnection>((resolve, reject) => {
      const nc = new NatsConnectionImpl(opts);
      ProtocolHandler.connect(nc.options, nc)
        .then((ph: ProtocolHandler) => {
          nc.protocol = ph;
          (async function () {
            for await (const s of ph.status()) {
              nc.listeners.forEach((l) => {
                l.push(s);
              });
            }
          })();
          resolve(nc);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  closed(): Promise<void | Error> {
    return this.protocol.closed;
  }

  async close() {
    await this.protocol.close();
  }

  publish(
    subject: string,
    data: Uint8Array = Empty,
    options?: PublishOptions,
  ): void {
    subject = subject || "";
    if (subject.length === 0) {
      throw NatsError.errorForCode(ErrorCode.BAD_SUBJECT);
    }
    // if argument is not undefined/null and not a Uint8Array, toss
    if (data && !isUint8Array(data)) {
      throw NatsError.errorForCode(ErrorCode.BAD_PAYLOAD);
    }
    this.protocol.publish(subject, data, options);
  }

  subscribe(
    subject: string,
    opts: SubscriptionOptions = {},
  ): Subscription {
    if (this.isClosed()) {
      throw NatsError.errorForCode(ErrorCode.CONNECTION_CLOSED);
    }
    if (this.isDraining()) {
      throw NatsError.errorForCode(ErrorCode.CONNECTION_DRAINING);
    }
    subject = subject || "";
    if (subject.length === 0) {
      throw NatsError.errorForCode(ErrorCode.BAD_SUBJECT);
    }

    const sub = new SubscriptionImpl(this.protocol, subject, opts);
    this.protocol.subscribe(sub);
    return sub;
  }

  request(
    subject: string,
    data: Uint8Array = Empty,
    opts: RequestOptions = { timeout: 1000, noMux: false },
  ): Promise<Msg> {
    if (this.isClosed()) {
      return Promise.reject(
        NatsError.errorForCode(ErrorCode.CONNECTION_CLOSED),
      );
    }
    if (this.isDraining()) {
      return Promise.reject(
        NatsError.errorForCode(ErrorCode.CONNECTION_DRAINING),
      );
    }
    subject = subject || "";
    if (subject.length === 0) {
      return Promise.reject(NatsError.errorForCode(ErrorCode.BAD_SUBJECT));
    }
    opts.timeout = opts.timeout || 1000;
    if (opts.timeout < 1) {
      return Promise.reject(new NatsError("timeout", ErrorCode.INVALID_OPTION));
    }
    if (!opts.noMux && opts.reply) {
      return Promise.reject(
        new NatsError(
          "reply can only be used with noMux",
          ErrorCode.INVALID_OPTION,
        ),
      );
    }

    if (opts.noMux) {
      const inbox = opts.reply
        ? opts.reply
        : createInbox(this.options.inboxPrefix);
      const d = deferred<Msg>();
      this.subscribe(
        inbox,
        {
          max: 1,
          timeout: opts.timeout,
          callback: (err, msg) => {
            if (err) {
              d.reject(err);
            } else {
              err = isRequestError(msg);
              if (err) {
                d.reject(err);
              } else {
                d.resolve(msg);
              }
            }
          },
        },
      );
      this.publish(subject, data, { reply: inbox });
      return d;
    } else {
      const r = new Request(this.protocol.muxSubscriptions, opts);
      this.protocol.request(r);

      try {
        this.publish(
          subject,
          data,
          {
            reply: `${this.protocol.muxSubscriptions.baseInbox}${r.token}`,
            headers: opts.headers,
          },
        );
      } catch (err) {
        r.cancel(err);
      }

      const p = Promise.race([r.timer, r.deferred]);
      p.catch(() => {
        r.cancel();
      });
      return p;
    }
  }

  /***
     * Flushes to the server. Promise resolves when round-trip completes.
     * @returns {Promise<void>}
     */
  flush(): Promise<void> {
    return this.protocol.flush();
  }

  drain(): Promise<void> {
    if (this.isClosed()) {
      return Promise.reject(
        NatsError.errorForCode(ErrorCode.CONNECTION_CLOSED),
      );
    }
    if (this.isDraining()) {
      return Promise.reject(
        NatsError.errorForCode(ErrorCode.CONNECTION_DRAINING),
      );
    }
    this.draining = true;
    return this.protocol.drain();
  }

  isClosed(): boolean {
    return this.protocol.isClosed();
  }

  isDraining(): boolean {
    return this.draining;
  }

  getServer(): string {
    const srv = this.protocol.getServer();
    return srv ? srv.listen : "";
  }

  status(): AsyncIterable<Status> {
    const iter = new QueuedIterator<Status>();
    this.listeners.push(iter);
    return iter;
  }

  get info(): (ServerInfo | undefined) {
    return this.protocol.isClosed() ? undefined : this.protocol.info;
  }

  stats(): Stats {
    return {
      inBytes: this.protocol.inBytes,
      outBytes: this.protocol.outBytes,
      inMsgs: this.protocol.inMsgs,
      outMsgs: this.protocol.outMsgs,
    };
  }
}
