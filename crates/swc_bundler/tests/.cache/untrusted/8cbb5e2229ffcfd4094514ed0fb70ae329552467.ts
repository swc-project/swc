// Loaded from https://raw.githubusercontent.com/nats-io/nats.ws/master/src/ws_transport.ts


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

import type {
  ConnectionOptions,
  Deferred,
  Server,
  ServerInfo,
  Transport,
} from "https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/internal_mod.ts";
import {
  checkOptions,
  DataBuffer,
  deferred,
  delay,
  ErrorCode,
  extractProtocolMessage,
  INFO,
  NatsError,
  render,
} from "https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/internal_mod.ts";

const VERSION = "1.0.0-122";
const LANG = "nats.ws";

export class WsTransport implements Transport {
  version: string;
  lang: string;
  closeError?: Error;
  connected: boolean;
  private done: boolean;
  // @ts-ignore: expecting global WebSocket
  private socket: WebSocket;
  private options!: ConnectionOptions;
  socketClosed: boolean;
  encrypted: boolean;
  peeked: boolean;

  yields: Uint8Array[];
  signal: Deferred<void>;
  private closedNotification: Deferred<void | Error>;

  constructor() {
    this.version = VERSION;
    this.lang = LANG;
    this.connected = false;
    this.done = false;
    this.socketClosed = false;
    this.encrypted = false;
    this.peeked = false;
    this.yields = [];
    this.signal = deferred();
    this.closedNotification = deferred();
  }

  connect(
    server: Server,
    options: ConnectionOptions,
  ): Promise<void> {
    const connected = false;
    const connLock = deferred<void>();

    // ws client doesn't support TLS setting
    if (options.tls) {
      connLock.reject(new NatsError("tls", ErrorCode.INVALID_OPTION));
      return connLock;
    }

    this.options = options;
    const u = server.src;
    this.encrypted = u.indexOf("wss://") === 0;
    this.socket = new WebSocket(u);
    this.socket.binaryType = "arraybuffer";

    this.socket.onopen = () => {
      // we don't do anything here...
    };

    this.socket.onmessage = (me: MessageEvent) => {
      this.yields.push(new Uint8Array(me.data));
      if (this.peeked) {
        this.signal.resolve();
        return;
      }
      const t = DataBuffer.concat(...this.yields);
      const pm = extractProtocolMessage(t);
      if (pm) {
        const m = INFO.exec(pm);
        if (!m) {
          if (options.debug) {
            console.error("!!!", render(t));
          }
          connLock.reject(new Error("unexpected response from server"));
          return;
        }
        try {
          const info = JSON.parse(m[1]) as ServerInfo;
          checkOptions(info, this.options);
          this.peeked = true;
          this.connected = true;
          this.signal.resolve();
          connLock.resolve();
        } catch (err) {
          connLock.reject(err);
          return;
        }
      }
    };

    // @ts-ignore: CloseEvent is provided in browsers
    this.socket.onclose = (evt: CloseEvent) => {
      this.socketClosed = true;
      let reason: Error | undefined;
      if (this.done) return;
      if (!evt.wasClean) {
        reason = new Error(evt.reason);
      }
      this._closed(reason);
    };

    // @ts-ignore: signature can be any
    this.socket.onerror = (e: ErrorEvent | Event): void => {
      const evt = e as ErrorEvent;
      const err = new NatsError(
        evt.message,
        ErrorCode.UNKNOWN,
        new Error(evt.error),
      );
      if (!connected) {
        connLock.reject(err);
      } else {
        this._closed(err);
      }
    };
    return connLock;
  }

  disconnect(): void {
    this._closed(undefined, true);
  }

  private async _closed(err?: Error, internal = true): Promise<void> {
    if (!this.connected) return;
    if (this.done) return;
    this.closeError = err;
    if (!err) {
      while (!this.socketClosed && this.socket.bufferedAmount > 0) {
        console.log(this.socket.bufferedAmount);
        await delay(100);
      }
    }
    this.done = true;
    try {
      // 1002 endpoint error, 1000 is clean
      this.socket.close(err ? 1002 : 1000, err ? err.message : undefined);
    } catch (err) {
      // ignore this
    }
    if (internal) {
      this.closedNotification.resolve(err);
    }
  }

  get isClosed(): boolean {
    return this.done;
  }

  [Symbol.asyncIterator]() {
    return this.iterate();
  }

  async *iterate(): AsyncIterableIterator<Uint8Array> {
    while (true) {
      if (this.yields.length === 0) {
        await this.signal;
      }
      const yields = this.yields;
      this.yields = [];
      for (let i = 0; i < yields.length; i++) {
        if (this.options.debug) {
          console.info(`> ${render(yields[i])}`);
        }
        yield yields[i];
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

  isEncrypted(): boolean {
    return this.connected && this.encrypted;
  }

  send(frame: Uint8Array): Promise<void> {
    if (this.done) {
      return Promise.resolve();
    }
    try {
      this.socket.send(frame.buffer);
      if (this.options.debug) {
        console.info(`< ${render(frame)}`);
      }
      return Promise.resolve();
    } catch (err) {
      if (this.options.debug) {
        console.error(`!!! ${render(frame)}: ${err}`);
      }
      return Promise.reject(err);
    }
  }

  close(err?: Error | undefined): Promise<void> {
    return this._closed(err, false);
  }

  closed(): Promise<void | Error> {
    return this.closedNotification;
  }
}
