// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.1/nats-base-client/jsmsg.ts


/*
 * Copyright 2021 The NATS Authors
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
  DeliveryInfo,
  JsMsg,
  Msg,
  NextRequest,
  RequestOptions,
} from "./types.ts";
import { MsgHdrs } from "./headers.ts";
import { DataBuffer } from "./databuffer.ts";
import { JSONCodec } from "./codec.ts";
import { MsgImpl } from "./msg.ts";
import { ProtocolHandler } from "./protocol.ts";
import { Request } from "./request.ts";

export const ACK = Uint8Array.of(43, 65, 67, 75);
const NAK = Uint8Array.of(45, 78, 65, 75);
const WPI = Uint8Array.of(43, 87, 80, 73);
const NXT = Uint8Array.of(43, 78, 88, 84);
const TERM = Uint8Array.of(43, 84, 69, 82, 77);
const SPACE = Uint8Array.of(32);

export function toJsMsg(m: Msg): JsMsg {
  return new JsMsgImpl(m);
}

export function parseInfo(s: string): DeliveryInfo {
  const tokens = s.split(".");
  if (tokens.length !== 9 && tokens[0] !== "$JS" && tokens[1] !== "ACK") {
    throw new Error(`not js message`);
  }
  // "$JS.ACK.<stream>.<consumer>.<redeliveryCount><streamSeq><deliverySequence>.<timestamp>.<pending>"
  const di = {} as DeliveryInfo;
  di.stream = tokens[2];
  di.consumer = tokens[3];
  di.redeliveryCount = parseInt(tokens[4], 10);
  di.streamSequence = parseInt(tokens[5], 10);
  di.deliverySequence = parseInt(tokens[6], 10);
  di.timestampNanos = parseInt(tokens[7], 10);
  di.pending = parseInt(tokens[8], 10);
  return di;
}

class JsMsgImpl implements JsMsg {
  msg: Msg;
  di?: DeliveryInfo;
  didAck: boolean;

  constructor(msg: Msg) {
    this.msg = msg;
    this.didAck = false;
  }

  get subject(): string {
    return this.msg.subject;
  }

  get sid(): number {
    return this.msg.sid;
  }

  get data(): Uint8Array {
    return this.msg.data;
  }

  get headers(): MsgHdrs {
    return this.msg.headers!;
  }

  get info(): DeliveryInfo {
    if (!this.di) {
      this.di = parseInfo(this.reply);
    }
    return this.di;
  }

  get redelivered(): boolean {
    return this.info.redeliveryCount > 1;
  }

  get reply(): string {
    return this.msg.reply ?? "";
  }

  get seq(): number {
    return this.info.streamSequence;
  }

  doAck(payload: Uint8Array) {
    if (!this.didAck) {
      this.didAck = true;
      this.msg.respond(payload);
    }
  }

  // this has to dig into the internals as the message has access
  // to the protocol but not the high-level client.
  async ackAck(): Promise<boolean> {
    if (!this.didAck) {
      this.didAck = true;
      if (this.msg.reply) {
        const mi = this.msg as MsgImpl;
        const proto = mi.publisher as unknown as ProtocolHandler;
        const r = new Request(proto.muxSubscriptions);
        proto.request(r);
        try {
          proto.publish(
            this.msg.reply,
            ACK,
            {
              reply: `${proto.muxSubscriptions.baseInbox}${r.token}`,
            },
          );
        } catch (err) {
          r.cancel(err);
        }
        try {
          await Promise.race([r.timer, r.deferred]);
          return true;
        } catch (err) {
          r.cancel(err);
        }
      }
    }
    return false;
  }

  ack() {
    this.doAck(ACK);
  }

  nak() {
    this.doAck(NAK);
  }

  working() {
    this.doAck(WPI);
  }

  next(subj?: string, ro?: Partial<NextRequest>) {
    let payload = NXT;
    if (ro) {
      const data = JSONCodec().encode(ro);
      payload = DataBuffer.concat(NXT, SPACE, data);
    }
    const opts = subj ? { reply: subj } as RequestOptions : undefined;
    this.msg.respond(payload, opts);
  }

  term() {
    this.doAck(TERM);
  }
}
