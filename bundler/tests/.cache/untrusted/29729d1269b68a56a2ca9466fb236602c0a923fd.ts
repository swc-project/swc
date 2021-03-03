// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/msg.ts


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
import { Empty, Msg } from "./types.ts";
import { MsgHdrs, MsgHdrsImpl } from "./headers.ts";
import type { Publisher } from "./protocol.ts";
import type { MsgArg } from "./parser.ts";
import { TD } from "./encoders.ts";

export class MsgImpl implements Msg {
  _headers?: MsgHdrs;
  _msg: MsgArg;
  _rdata: Uint8Array;
  _reply!: string;
  _subject!: string;
  publisher: Publisher;

  constructor(msg: MsgArg, data: Uint8Array, publisher: Publisher) {
    this._msg = msg;
    this._rdata = data;
    this.publisher = publisher;
  }

  get subject(): string {
    if (this._subject) {
      return this._subject;
    }
    this._subject = TD.decode(this._msg.subject);
    return this._subject;
  }

  get reply(): string {
    if (this._reply) {
      return this._reply;
    }
    this._reply = TD.decode(this._msg.reply);
    return this._reply;
  }

  get sid(): number {
    return this._msg.sid;
  }

  get headers(): (MsgHdrs | undefined) {
    if (this._msg.hdr > -1 && !this._headers) {
      const buf = this._rdata.subarray(0, this._msg.hdr);
      this._headers = MsgHdrsImpl.decode(buf);
    }
    return this._headers;
  }

  get data(): Uint8Array {
    if (!this._rdata) {
      return new Uint8Array(0);
    }
    return this._msg.hdr > -1
      ? this._rdata.subarray(this._msg.hdr)
      : this._rdata;
  }

  // eslint-ignore-next-line @typescript-eslint/no-explicit-any
  respond(
    data: Uint8Array = Empty,
    opts?: { headers?: MsgHdrs; reply?: string },
  ): boolean {
    if (this.reply) {
      this.publisher.publish(this.reply, data, opts);
      return true;
    }
    return false;
  }
}
