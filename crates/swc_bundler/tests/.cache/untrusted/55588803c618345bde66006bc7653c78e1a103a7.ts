// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/protocol.ts


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
import {
  ConnectionOptions,
  DebugEvents,
  DEFAULT_MAX_PING_OUT,
  DEFAULT_PING_INTERVAL,
  DEFAULT_RECONNECT_TIME_WAIT,
  Empty,
  Events,
  PublishOptions,
  ServerInfo,
  Status,
  Subscription,
} from "./types.ts";
import { newTransport, Transport } from "./transport.ts";
import { ErrorCode, NatsError } from "./error.ts";
import {
  CR_LF,
  CRLF,
  Deferred,
  deferred,
  delay,
  extend,
  timeout,
} from "./util.ts";
import { nuid } from "./nuid.ts";
import { DataBuffer } from "./databuffer.ts";
import { ServerImpl, Servers } from "./servers.ts";
import { Dispatcher, QueuedIterator } from "./queued_iterator.ts";
import type { MsgHdrs, MsgHdrsImpl } from "./headers.ts";
import { SubscriptionImpl } from "./subscription.ts";
import { Subscriptions } from "./subscriptions.ts";
import { MuxSubscription } from "./muxsubscription.ts";
import type { Request } from "./request.ts";
import { Heartbeat, PH } from "./heartbeats.ts";
import { Kind, MsgArg, Parser, ParserEvent } from "./parser.ts";
import { MsgImpl } from "./msg.ts";
import { fastDecoder, fastEncoder } from "./encoders.ts";

const FLUSH_THRESHOLD = 1024 * 32;

export const INFO = /^INFO\s+([^\r\n]+)\r\n/i;

export function createInbox(prefix: string = ""): string {
  prefix = prefix || "_INBOX";
  if (typeof prefix !== "string") {
    throw (new Error("prefix must be a string"));
  }
  return `${prefix}.${nuid.next()}`;
}

const PONG_CMD = fastEncoder("PONG\r\n");
const PING_CMD = fastEncoder("PING\r\n");

export class Connect {
  echo?: boolean;
  no_responders?: boolean;
  protocol: number;
  verbose?: boolean;
  pedantic?: boolean;
  jwt?: string;
  nkey?: string;
  sig?: string;
  user?: string;
  pass?: string;
  auth_token?: string;
  tls_required?: boolean;
  name?: string;
  lang: string;
  version: string;
  headers?: boolean;

  constructor(
    transport: { version: string; lang: string },
    opts: ConnectionOptions,
    nonce?: string,
  ) {
    this.protocol = 1;
    this.version = transport.version;
    this.lang = transport.lang;
    this.echo = opts.noEcho ? false : undefined;
    this.verbose = opts.verbose;
    this.pedantic = opts.pedantic;
    this.tls_required = opts.tls ? true : undefined;
    this.name = opts.name;

    const creds =
      (opts && opts.authenticator ? opts.authenticator(nonce) : {}) || {};
    extend(this, creds);
  }
}

export interface Publisher {
  publish(
    subject: string,
    data: Uint8Array,
    options?: { reply?: string; headers?: MsgHdrs },
  ): void;
}

export class ProtocolHandler implements Dispatcher<ParserEvent> {
  connected: boolean;
  connectedOnce: boolean;
  infoReceived: boolean;
  info?: ServerInfo;
  muxSubscriptions: MuxSubscription;
  options: ConnectionOptions;
  outbound: DataBuffer;
  pongs: Array<Deferred<void>>;
  subscriptions: Subscriptions;
  transport!: Transport;
  noMorePublishing: boolean;
  connectError?: (err?: Error) => void;
  publisher: Publisher;
  _closed: boolean;
  closed: Deferred<Error | void>;
  listeners: QueuedIterator<Status>[];
  heartbeats: Heartbeat;
  parser: Parser;
  outMsgs: number;
  inMsgs: number;
  outBytes: number;
  inBytes: number;
  pendingLimit: number;
  lastError?: NatsError;
  abortReconnect: boolean;

  servers: Servers;
  server!: ServerImpl;

  constructor(options: ConnectionOptions, publisher: Publisher) {
    this._closed = false;
    this.connected = false;
    this.connectedOnce = false;
    this.infoReceived = false;
    this.noMorePublishing = false;
    this.abortReconnect = false;
    this.listeners = [];
    this.pendingLimit = FLUSH_THRESHOLD;
    this.outMsgs = 0;
    this.inMsgs = 0;
    this.outBytes = 0;
    this.inBytes = 0;
    this.options = options;
    this.publisher = publisher;
    this.subscriptions = new Subscriptions();
    this.muxSubscriptions = new MuxSubscription();
    this.outbound = new DataBuffer();
    this.pongs = [];
    //@ts-ignore: options.pendingLimit is hidden
    this.pendingLimit = options.pendingLimit || this.pendingLimit;
    this.servers = new Servers(
      !options.noRandomize,
      //@ts-ignore: servers should be a list
      options.servers,
    );
    this.closed = deferred<Error | void>();
    this.parser = new Parser(this);

    this.heartbeats = new Heartbeat(
      this as PH,
      this.options.pingInterval || DEFAULT_PING_INTERVAL,
      this.options.maxPingOut || DEFAULT_MAX_PING_OUT,
    );
  }

  resetOutbound(): void {
    this.outbound.reset();
    const pongs = this.pongs;
    this.pongs = [];
    // reject the pongs
    pongs.forEach((p) => {
      p.reject(NatsError.errorForCode(ErrorCode.DISCONNECT));
    });
    this.parser = new Parser(this);
    this.infoReceived = false;
  }

  dispatchStatus(status: Status): void {
    this.listeners.forEach((q) => {
      q.push(status);
    });
  }

  status(): AsyncIterable<Status> {
    const iter = new QueuedIterator<Status>();
    this.listeners.push(iter);
    return iter;
  }

  private prepare(): Deferred<void> {
    this.info = undefined;
    this.resetOutbound();

    const pong = deferred<void>();
    this.pongs.unshift(pong);

    this.connectError = (err?: Error) => {
      pong.reject(err);
    };

    this.transport = newTransport();
    this.transport.closed()
      .then(async (err?) => {
        this.connected = false;
        if (!this.isClosed()) {
          await this.disconnected(this.transport.closeError);
          return;
        }
      });

    return pong;
  }

  public disconnect(): void {
    this.dispatchStatus({ type: DebugEvents.STALE_CONNECTION, data: "" });
    this.transport.disconnect();
  }

  async disconnected(err?: Error): Promise<void> {
    this.dispatchStatus(
      {
        type: Events.DISCONNECT,
        data: this.servers.getCurrentServer().toString(),
      },
    );
    if (this.options.reconnect) {
      await this.dialLoop()
        .then(() => {
          this.dispatchStatus(
            {
              type: Events.RECONNECT,
              data: this.servers.getCurrentServer().toString(),
            },
          );
        })
        .catch((err) => {
          this._close(err);
        });
    } else {
      await this._close();
    }
  }

  async dial(srv: ServerImpl): Promise<void> {
    const pong = this.prepare();
    let timer;
    try {
      timer = timeout(this.options.timeout || 20000);
      const cp = this.transport.connect(srv, this.options);
      await Promise.race([cp, timer]);
      (async () => {
        try {
          for await (const b of this.transport) {
            this.parser.parse(b);
          }
        } catch (err) {
          console.log("reader closed", err);
        }
      })().then();
    } catch (err) {
      pong.reject(err);
    }

    try {
      await Promise.race([timer, pong]);
      if (timer) {
        timer.cancel();
      }
      this.connected = true;
      this.connectError = undefined;
      this.sendSubscriptions();
      this.connectedOnce = true;
      this.server.didConnect = true;
      this.server.reconnects = 0;
      this.flushPending();
      this.heartbeats.start();
    } catch (err) {
      if (timer) {
        timer.cancel();
      }
      await this.transport.close(err);
      throw err;
    }
  }

  async dialLoop(): Promise<void> {
    let lastError: Error | undefined;
    while (true) {
      const wait = this.options.reconnectDelayHandler
        ? this.options.reconnectDelayHandler()
        : DEFAULT_RECONNECT_TIME_WAIT;
      let maxWait = wait;
      const srv = this.selectServer();
      if (!srv || this.abortReconnect) {
        throw lastError || NatsError.errorForCode(ErrorCode.CONNECTION_REFUSED);
      }
      const now = Date.now();
      if (srv.lastConnect === 0 || srv.lastConnect + wait <= now) {
        srv.lastConnect = Date.now();
        try {
          this.dispatchStatus(
            { type: DebugEvents.RECONNECTING, data: srv.toString() },
          );
          await this.dial(srv);
          break;
        } catch (err) {
          lastError = err;
          if (!this.connectedOnce) {
            if (this.options.waitOnFirstConnect) {
              continue;
            }
            this.servers.removeCurrentServer();
          }
          srv.reconnects++;
          const mra = this.options.maxReconnectAttempts || 0;
          if (mra !== -1 && srv.reconnects >= mra) {
            this.servers.removeCurrentServer();
          }
        }
      } else {
        maxWait = Math.min(maxWait, srv.lastConnect + wait - now);
        await delay(maxWait);
      }
    }
  }

  public static async connect(
    options: ConnectionOptions,
    publisher: Publisher,
  ): Promise<ProtocolHandler> {
    const h = new ProtocolHandler(options, publisher);
    await h.dialLoop();
    return h;
  }

  static toError(s: string) {
    const t = s ? s.toLowerCase() : "";
    if (t.indexOf("permissions violation") !== -1) {
      return new NatsError(s, ErrorCode.PERMISSIONS_VIOLATION);
    } else if (t.indexOf("authorization violation") !== -1) {
      return new NatsError(s, ErrorCode.AUTHORIZATION_VIOLATION);
    } else if (t.indexOf("user authentication expired") !== -1) {
      return new NatsError(s, ErrorCode.AUTHENTICATION_EXPIRED);
    } else {
      return new NatsError(s, ErrorCode.NATS_PROTOCOL_ERR);
    }
  }

  processMsg(msg: MsgArg, data: Uint8Array) {
    this.inMsgs++;
    this.inBytes += data.length;
    if (!this.subscriptions.sidCounter) {
      return;
    }

    const sub = this.subscriptions.get(msg.sid) as SubscriptionImpl;
    if (!sub) {
      return;
    }
    sub.received += 1;

    if (sub.callback) {
      sub.callback(null, new MsgImpl(msg, data, this));
    }

    if (sub.max !== undefined && sub.received >= sub.max) {
      sub.unsubscribe();
    }
  }

  async processError(m: Uint8Array) {
    const s = fastDecoder(m);
    const err = ProtocolHandler.toError(s);
    const handled = this.subscriptions.handleError(err);
    if (!handled) {
      this.dispatchStatus({ type: Events.ERROR, data: err.code });
    }
    await this.handleError(err);
  }

  async handleError(err: NatsError) {
    if (err.isAuthError()) {
      this.handleAuthError(err);
    }
    if (err.isPermissionError() || err.isProtocolError()) {
      await this._close(err);
    }
    this.lastError = err;
  }

  handleAuthError(err: NatsError) {
    if (this.lastError && err.code === this.lastError.code) {
      this.abortReconnect = true;
    }
    if (this.connectError) {
      this.connectError(err);
    } else {
      this.disconnect();
    }
  }

  processPing() {
    this.transport.send(PONG_CMD);
  }

  processPong() {
    const cb = this.pongs.shift();
    if (cb) {
      cb.resolve();
    }
  }

  processInfo(m: Uint8Array) {
    const info = JSON.parse(fastDecoder(m));
    this.info = info;
    const updates = this.options && this.options.ignoreClusterUpdates
      ? undefined
      : this.servers.update(info);
    if (!this.infoReceived) {
      this.infoReceived = true;
      if (this.transport.isEncrypted()) {
        this.servers.updateTLSName();
      }
      // send connect
      const { version, lang } = this.transport;
      try {
        const c = new Connect(
          { version, lang },
          this.options,
          info.nonce,
        );

        if (info.headers) {
          c.headers = true;
          c.no_responders = true;
        }
        const cs = JSON.stringify(c);
        this.transport.send(
          fastEncoder(`CONNECT ${cs}${CR_LF}`),
        );
        this.transport.send(PING_CMD);
      } catch (err) {
        this._close(
          NatsError.errorForCode(ErrorCode.BAD_AUTHENTICATION, err),
        );
      }
    }
    if (updates) {
      this.dispatchStatus({ type: Events.UPDATE, data: updates });
    }
    const ldm = info.ldm !== undefined ? info.ldm : false;
    if (ldm) {
      this.dispatchStatus(
        {
          type: Events.LDM,
          data: this.servers.getCurrentServer().toString(),
        },
      );
    }
  }

  push(e: ParserEvent): void {
    switch (e.kind) {
      case Kind.MSG: {
        const { msg, data } = e;
        this.processMsg(msg!, data!);
        break;
      }
      case Kind.OK:
        break;
      case Kind.ERR:
        this.processError(e.data!);
        break;
      case Kind.PING:
        this.processPing();
        break;
      case Kind.PONG:
        this.processPong();
        break;
      case Kind.INFO:
        this.processInfo(e.data!);
        break;
    }
  }

  sendCommand(cmd: (string | Uint8Array), ...payloads: Uint8Array[]) {
    const len = this.outbound.length();
    let buf: Uint8Array;
    if (typeof cmd === "string") {
      buf = fastEncoder(cmd);
    } else {
      buf = cmd as Uint8Array;
    }
    this.outbound.fill(buf, ...payloads);

    if (len === 0) {
      setTimeout(() => {
        this.flushPending();
      });
    } else if (this.outbound.size() >= this.pendingLimit) {
      this.flushPending();
    }
  }

  publish(
    subject: string,
    data: Uint8Array,
    options?: PublishOptions,
  ) {
    if (this.isClosed()) {
      throw NatsError.errorForCode(ErrorCode.CONNECTION_CLOSED);
    }
    if (this.noMorePublishing) {
      throw NatsError.errorForCode(ErrorCode.CONNECTION_DRAINING);
    }

    let len = data.length;
    options = options || {};
    options.reply = options.reply || "";

    let headers = Empty;
    let hlen = 0;
    if (options.headers) {
      if (this.info && !this.info.headers) {
        throw new NatsError("headers", ErrorCode.SERVER_OPTION_NA);
      }
      const hdrs = options.headers as MsgHdrsImpl;
      headers = hdrs.encode();
      hlen = headers.length;
      len = data.length + hlen;
    }

    if (this.info && len > this.info.max_payload) {
      throw NatsError.errorForCode((ErrorCode.MAX_PAYLOAD_EXCEEDED));
    }
    this.outBytes += len;
    this.outMsgs++;

    let proto: string;
    if (options.headers) {
      if (options.reply) {
        proto = `HPUB ${subject} ${options.reply} ${hlen} ${len}${CR_LF}`;
      } else {
        proto = `HPUB ${subject} ${hlen} ${len}\r\n`;
      }
      this.sendCommand(proto, headers, data, CRLF);
    } else {
      if (options.reply) {
        proto = `PUB ${subject} ${options.reply} ${len}\r\n`;
      } else {
        proto = `PUB ${subject} ${len}\r\n`;
      }
      this.sendCommand(proto, data, CRLF);
    }
  }

  request(r: Request): Request {
    this.initMux();
    this.muxSubscriptions.add(r);
    return r;
  }

  subscribe(s: SubscriptionImpl): Subscription {
    this.subscriptions.add(s);
    if (s.queue) {
      this.sendCommand(`SUB ${s.subject} ${s.queue} ${s.sid}\r\n`);
    } else {
      this.sendCommand(`SUB ${s.subject} ${s.sid}\r\n`);
    }
    if (s.max) {
      this.unsubscribe(s, s.max);
    }
    return s;
  }

  unsubscribe(s: SubscriptionImpl, max?: number) {
    this.unsub(s, max);
    if (s.max === undefined || s.received >= s.max) {
      this.subscriptions.cancel(s);
    }
  }

  unsub(s: SubscriptionImpl, max?: number) {
    if (!s || this.isClosed()) {
      return;
    }
    if (max) {
      this.sendCommand(`UNSUB ${s.sid} ${max}${CR_LF}`);
    } else {
      this.sendCommand(`UNSUB ${s.sid}${CR_LF}`);
    }
    s.max = max;
  }

  flush(p?: Deferred<void>): Promise<void> {
    if (!p) {
      p = deferred<void>();
    }
    this.pongs.push(p);
    this.sendCommand(PING_CMD);
    return p;
  }

  sendSubscriptions() {
    const cmds: string[] = [];
    this.subscriptions.all().forEach((s) => {
      const sub = s as SubscriptionImpl;
      if (sub.queue) {
        cmds.push(`SUB ${sub.subject} ${sub.queue} ${sub.sid}${CR_LF}`);
      } else {
        cmds.push(`SUB ${sub.subject} ${sub.sid}${CR_LF}`);
      }
    });
    if (cmds.length) {
      this.transport.send(fastEncoder(cmds.join("")));
    }
  }

  private async _close(err?: Error): Promise<void> {
    if (this._closed) {
      return;
    }
    this.heartbeats.cancel();
    if (this.connectError) {
      this.connectError(err);
      this.connectError = undefined;
    }
    this.muxSubscriptions.close();
    this.subscriptions.close();
    this.listeners.forEach((l) => {
      l.stop();
    });
    this._closed = true;
    await this.transport.close(err);
    await this.closed.resolve(err);
  }

  close(): Promise<void> {
    return this._close();
  }

  isClosed(): boolean {
    return this._closed;
  }

  drain(): Promise<void> {
    const subs = this.subscriptions.all();
    const promises: Promise<void>[] = [];
    subs.forEach((sub: Subscription) => {
      promises.push(sub.drain());
    });
    return Promise.all(promises)
      .then(async () => {
        this.noMorePublishing = true;
        await this.flush();
        return this.close();
      })
      .catch(() => {
        // cannot happen
      });
  }

  private flushPending() {
    if (!this.infoReceived || !this.connected) {
      return;
    }

    if (this.outbound.size()) {
      const d = this.outbound.drain();
      this.transport.send(d);
    }
  }

  private initMux(): void {
    const mux = this.subscriptions.getMux();
    if (!mux) {
      const inbox = this.muxSubscriptions.init(
        createInbox(this.options.inboxPrefix),
      );
      // dot is already part of mux
      const sub = new SubscriptionImpl(this, `${inbox}*`);
      sub.callback = this.muxSubscriptions.dispatcher();
      this.subscriptions.setMux(sub);
      this.subscribe(sub);
    }
  }

  private selectServer(): ServerImpl | undefined {
    const server = this.servers.selectServer();
    if (server === undefined) {
      return undefined;
    }
    // Place in client context.
    this.server = server;
    return this.server;
  }

  getServer(): ServerImpl | undefined {
    return this.server;
  }
}
