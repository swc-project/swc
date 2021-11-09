// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/parser.ts


// deno-lint-ignore-file no-undef
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
import type { Dispatcher } from "./queued_iterator.ts";
import { DenoBuffer } from "./denobuffer.ts";
import { TD } from "./encoders.ts";

export enum Kind {
  OK,
  ERR,
  MSG,
  INFO,
  PING,
  PONG,
}

export interface ParserEvent {
  kind: Kind;
  msg?: MsgArg;
  data?: Uint8Array;
}

export function describe(e: ParserEvent): string {
  let ks: string;
  let data = "";

  switch (e.kind) {
    case Kind.MSG:
      ks = "MSG";
      break;
    case Kind.OK:
      ks = "OK";
      break;
    case Kind.ERR:
      ks = "ERR";
      data = TD.decode(e.data);
      break;
    case Kind.PING:
      ks = "PING";
      break;
    case Kind.PONG:
      ks = "PONG";
      break;
    case Kind.INFO:
      ks = "INFO";
      data = TD.decode(e.data);
  }
  return `${ks}: ${data}`;
}

export interface MsgArg {
  subject: Uint8Array;
  reply?: Uint8Array;
  sid: number;
  hdr: number;
  size: number;
}

function newMsgArg(): MsgArg {
  const ma = {} as MsgArg;
  ma.sid = -1;
  ma.hdr = -1;
  ma.size = -1;

  return ma;
}

const ASCII_0 = 48;
const ASCII_9 = 57;

// This is an almost verbatim port of the Go NATS parser
// https://github.com/nats-io/nats.go/blob/master/parser.go
export class Parser {
  dispatcher: Dispatcher<ParserEvent>;
  state: State;
  as: number;
  drop: number;
  hdr: number;
  ma!: MsgArg;
  argBuf?: DenoBuffer;
  msgBuf?: DenoBuffer;

  constructor(dispatcher: Dispatcher<ParserEvent>) {
    this.dispatcher = dispatcher;
    this.state = State.OP_START;
    this.as = 0;
    this.drop = 0;
    this.hdr = 0;
  }

  parse(buf: Uint8Array): void {
    // @ts-ignore: on node.js module is a global
    if (typeof module !== "undefined" && module.exports) {
      // Uint8Array.slice() copies in node it doesn't and it is faster
      buf.subarray = buf.slice;
    }

    let i: number;
    for (i = 0; i < buf.length; i++) {
      const b = buf[i];
      switch (this.state) {
        case State.OP_START:
          switch (b) {
            case cc.M:
            case cc.m:
              this.state = State.OP_M;
              this.hdr = -1;
              this.ma = newMsgArg();
              break;
            case cc.H:
            case cc.h:
              this.state = State.OP_H;
              this.hdr = 0;
              this.ma = newMsgArg();
              break;
            case cc.P:
            case cc.p:
              this.state = State.OP_P;
              break;
            case cc.PLUS:
              this.state = State.OP_PLUS;
              break;
            case cc.MINUS:
              this.state = State.OP_MINUS;
              break;
            case cc.I:
            case cc.i:
              this.state = State.OP_I;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_H:
          switch (b) {
            case cc.M:
            case cc.m:
              this.state = State.OP_M;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_M:
          switch (b) {
            case cc.S:
            case cc.s:
              this.state = State.OP_MS;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_MS:
          switch (b) {
            case cc.G:
            case cc.g:
              this.state = State.OP_MSG;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_MSG:
          switch (b) {
            case cc.SPACE:
            case cc.TAB:
              this.state = State.OP_MSG_SPC;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_MSG_SPC:
          switch (b) {
            case cc.SPACE:
            case cc.TAB:
              continue;
            default:
              this.state = State.MSG_ARG;
              this.as = i;
          }
          break;
        case State.MSG_ARG:
          switch (b) {
            case cc.CR:
              this.drop = 1;
              break;
            case cc.NL: {
              const arg: Uint8Array = this.argBuf
                ? this.argBuf.bytes()
                : buf.subarray(this.as, i - this.drop);
              this.processMsgArgs(arg);
              this.drop = 0;
              this.as = i + 1;
              this.state = State.MSG_PAYLOAD;

              // jump ahead with the index. If this overruns
              // what is left we fall out and process a split buffer.
              i = this.as + this.ma.size - 1;
              break;
            }
            default:
              if (this.argBuf) {
                this.argBuf.writeByte(b);
              }
          }
          break;
        case State.MSG_PAYLOAD:
          if (this.msgBuf) {
            if (this.msgBuf.length >= this.ma.size) {
              const data = this.msgBuf.bytes({ copy: false });
              this.dispatcher.push(
                { kind: Kind.MSG, msg: this.ma, data: data },
              );
              this.argBuf = undefined;
              this.msgBuf = undefined;
              this.state = State.MSG_END;
            } else {
              let toCopy = this.ma.size - this.msgBuf.length;
              const avail = buf.length - i;

              if (avail < toCopy) {
                toCopy = avail;
              }

              if (toCopy > 0) {
                this.msgBuf.write(buf.subarray(i, i + toCopy));
                i = (i + toCopy) - 1;
              } else {
                this.msgBuf.writeByte(b);
              }
            }
          } else if (i - this.as >= this.ma.size) {
            this.dispatcher.push(
              { kind: Kind.MSG, msg: this.ma, data: buf.subarray(this.as, i) },
            );
            this.argBuf = undefined;
            this.msgBuf = undefined;
            this.state = State.MSG_END;
          }
          break;
        case State.MSG_END:
          switch (b) {
            case cc.NL:
              this.drop = 0;
              this.as = i + 1;
              this.state = State.OP_START;
              break;
            default:
              continue;
          }
          break;
        case State.OP_PLUS:
          switch (b) {
            case cc.O:
            case cc.o:
              this.state = State.OP_PLUS_O;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_PLUS_O:
          switch (b) {
            case cc.K:
            case cc.k:
              this.state = State.OP_PLUS_OK;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_PLUS_OK:
          switch (b) {
            case cc.NL:
              this.dispatcher.push({ kind: Kind.OK });
              this.drop = 0;
              this.state = State.OP_START;
              break;
          }
          break;
        case State.OP_MINUS:
          switch (b) {
            case cc.E:
            case cc.e:
              this.state = State.OP_MINUS_E;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_MINUS_E:
          switch (b) {
            case cc.R:
            case cc.r:
              this.state = State.OP_MINUS_ER;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_MINUS_ER:
          switch (b) {
            case cc.R:
            case cc.r:
              this.state = State.OP_MINUS_ERR;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_MINUS_ERR:
          switch (b) {
            case cc.SPACE:
            case cc.TAB:
              this.state = State.OP_MINUS_ERR_SPC;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_MINUS_ERR_SPC:
          switch (b) {
            case cc.SPACE:
            case cc.TAB:
              continue;
            default:
              this.state = State.MINUS_ERR_ARG;
              this.as = i;
          }
          break;
        case State.MINUS_ERR_ARG:
          switch (b) {
            case cc.CR:
              this.drop = 1;
              break;
            case cc.NL: {
              let arg: Uint8Array;
              if (this.argBuf) {
                arg = this.argBuf.bytes();
                this.argBuf = undefined;
              } else {
                arg = buf.subarray(this.as, i - this.drop);
              }
              this.dispatcher.push({ kind: Kind.ERR, data: arg });
              this.drop = 0;
              this.as = i + 1;
              this.state = State.OP_START;
              break;
            }
            default:
              if (this.argBuf) {
                this.argBuf.write(Uint8Array.of(b));
              }
          }
          break;
        case State.OP_P:
          switch (b) {
            case cc.I:
            case cc.i:
              this.state = State.OP_PI;
              break;
            case cc.O:
            case cc.o:
              this.state = State.OP_PO;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_PO:
          switch (b) {
            case cc.N:
            case cc.n:
              this.state = State.OP_PON;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_PON:
          switch (b) {
            case cc.G:
            case cc.g:
              this.state = State.OP_PONG;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_PONG:
          switch (b) {
            case cc.NL:
              this.dispatcher.push({ kind: Kind.PONG });
              this.drop = 0;
              this.state = State.OP_START;
              break;
          }
          break;
        case State.OP_PI:
          switch (b) {
            case cc.N:
            case cc.n:
              this.state = State.OP_PIN;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_PIN:
          switch (b) {
            case cc.G:
            case cc.g:
              this.state = State.OP_PING;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_PING:
          switch (b) {
            case cc.NL:
              this.dispatcher.push({ kind: Kind.PING });
              this.drop = 0;
              this.state = State.OP_START;
              break;
          }
          break;
        case State.OP_I:
          switch (b) {
            case cc.N:
            case cc.n:
              this.state = State.OP_IN;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_IN:
          switch (b) {
            case cc.F:
            case cc.f:
              this.state = State.OP_INF;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_INF:
          switch (b) {
            case cc.O:
            case cc.o:
              this.state = State.OP_INFO;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_INFO:
          switch (b) {
            case cc.SPACE:
            case cc.TAB:
              this.state = State.OP_INFO_SPC;
              break;
            default:
              throw this.fail(buf.subarray(i));
          }
          break;
        case State.OP_INFO_SPC:
          switch (b) {
            case cc.SPACE:
            case cc.TAB:
              continue;
            default:
              this.state = State.INFO_ARG;
              this.as = i;
          }
          break;
        case State.INFO_ARG:
          switch (b) {
            case cc.CR:
              this.drop = 1;
              break;
            case cc.NL: {
              let arg: Uint8Array;
              if (this.argBuf) {
                arg = this.argBuf.bytes();
                this.argBuf = undefined;
              } else {
                arg = buf.subarray(this.as, i - this.drop);
              }
              this.dispatcher.push({ kind: Kind.INFO, data: arg });
              this.drop = 0;
              this.as = i + 1;
              this.state = State.OP_START;
              break;
            }
            default:
              if (this.argBuf) {
                this.argBuf.writeByte(b);
              }
          }
          break;
        default:
          throw this.fail(buf.subarray(i));
      }
    }

    if (
      (this.state === State.MSG_ARG || this.state === State.MINUS_ERR_ARG ||
        this.state === State.INFO_ARG) && !this.argBuf
    ) {
      this.argBuf = new DenoBuffer(buf.subarray(this.as, i - this.drop));
    }

    if (this.state === State.MSG_PAYLOAD && !this.msgBuf) {
      if (!this.argBuf) {
        this.cloneMsgArg();
      }
      this.msgBuf = new DenoBuffer(buf.subarray(this.as));
    }
  }

  cloneMsgArg() {
    const s = this.ma.subject.length;
    const r = this.ma.reply ? this.ma.reply.length : 0;
    const buf = new Uint8Array(s + r);
    buf.set(this.ma.subject);
    if (this.ma.reply) {
      buf.set(this.ma.reply, s);
    }
    this.argBuf = new DenoBuffer(buf);
    this.ma.subject = buf.subarray(0, s);
    if (this.ma.reply) {
      this.ma.reply = buf.subarray(r);
    }
  }

  processMsgArgs(arg: Uint8Array): void {
    if (this.hdr >= 0) {
      return this.processHeaderMsgArgs(arg);
    }

    const args: Uint8Array[] = [];
    let start = -1;
    for (let i = 0; i < arg.length; i++) {
      const b = arg[i];
      switch (b) {
        case cc.SPACE:
        case cc.TAB:
        case cc.CR:
        case cc.NL:
          if (start >= 0) {
            args.push(arg.subarray(start, i));
            start = -1;
          }
          break;
        default:
          if (start < 0) {
            start = i;
          }
      }
    }
    if (start >= 0) {
      args.push(arg.subarray(start));
    }

    switch (args.length) {
      case 3:
        this.ma.subject = args[0];
        this.ma.sid = this.protoParseInt(args[1]);
        this.ma.reply = undefined;
        this.ma.size = this.protoParseInt(args[2]);
        break;
      case 4:
        this.ma.subject = args[0];
        this.ma.sid = this.protoParseInt(args[1]);
        this.ma.reply = args[2];
        this.ma.size = this.protoParseInt(args[3]);
        break;
      default:
        throw this.fail(arg, "processMsgArgs Parse Error");
    }

    if (this.ma.sid < 0) {
      throw this.fail(arg, "processMsgArgs Bad or Missing Sid Error");
    }
    if (this.ma.size < 0) {
      throw this.fail(arg, "processMsgArgs Bad or Missing Size Error");
    }
  }

  fail(data: Uint8Array, label = ""): Error {
    if (!label) {
      label = `parse error [${this.state}]`;
    } else {
      label = `${label} [${this.state}]`;
    }

    return new Error(`${label}: ${TD.decode(data)}`);
  }

  processHeaderMsgArgs(arg: Uint8Array): void {
    const args: Uint8Array[] = [];
    let start = -1;
    for (let i = 0; i < arg.length; i++) {
      const b = arg[i];
      switch (b) {
        case cc.SPACE:
        case cc.TAB:
        case cc.CR:
        case cc.NL:
          if (start >= 0) {
            args.push(arg.subarray(start, i));
            start = -1;
          }
          break;
        default:
          if (start < 0) {
            start = i;
          }
      }
    }
    if (start >= 0) {
      args.push(arg.subarray(start));
    }

    switch (args.length) {
      case 4:
        this.ma.subject = args[0];
        this.ma.sid = this.protoParseInt(args[1]);
        this.ma.reply = undefined;
        this.ma.hdr = this.protoParseInt(args[2]);
        this.ma.size = this.protoParseInt(args[3]);
        break;
      case 5:
        this.ma.subject = args[0];
        this.ma.sid = this.protoParseInt(args[1]);
        this.ma.reply = args[2];
        this.ma.hdr = this.protoParseInt(args[3]);
        this.ma.size = this.protoParseInt(args[4]);
        break;
      default:
        throw this.fail(arg, "processHeaderMsgArgs Parse Error");
    }

    if (this.ma.sid < 0) {
      throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Sid Error");
    }
    if (this.ma.hdr < 0 || this.ma.hdr > this.ma.size) {
      throw this.fail(
        arg,
        "processHeaderMsgArgs Bad or Missing Header Size Error",
      );
    }
    if (this.ma.size < 0) {
      throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Size Error");
    }
  }

  protoParseInt(a: Uint8Array): number {
    if (a.length === 0) {
      return -1;
    }
    let n = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] < ASCII_0 || a[i] > ASCII_9) {
        return -1;
      }
      n = n * 10 + (a[i] - ASCII_0);
    }
    return n;
  }
}

export enum State {
  OP_START = 0,
  OP_PLUS,
  OP_PLUS_O,
  OP_PLUS_OK,
  OP_MINUS,
  OP_MINUS_E,
  OP_MINUS_ER,
  OP_MINUS_ERR,
  OP_MINUS_ERR_SPC,
  MINUS_ERR_ARG,
  OP_M,
  OP_MS,
  OP_MSG,
  OP_MSG_SPC,
  MSG_ARG,
  MSG_PAYLOAD,
  MSG_END,
  OP_H,
  OP_P,
  OP_PI,
  OP_PIN,
  OP_PING,
  OP_PO,
  OP_PON,
  OP_PONG,
  OP_I,
  OP_IN,
  OP_INF,
  OP_INFO,
  OP_INFO_SPC,
  INFO_ARG,
}

enum cc {
  CR = "\r".charCodeAt(0),
  E = "E".charCodeAt(0),
  e = "e".charCodeAt(0),
  F = "F".charCodeAt(0),
  f = "f".charCodeAt(0),
  G = "G".charCodeAt(0),
  g = "g".charCodeAt(0),
  H = "H".charCodeAt(0),
  h = "h".charCodeAt(0),
  I = "I".charCodeAt(0),
  i = "i".charCodeAt(0),
  K = "K".charCodeAt(0),
  k = "k".charCodeAt(0),
  M = "M".charCodeAt(0),
  m = "m".charCodeAt(0),
  MINUS = "-".charCodeAt(0),
  N = "N".charCodeAt(0),
  n = "n".charCodeAt(0),
  NL = "\n".charCodeAt(0),
  O = "O".charCodeAt(0),
  o = "o".charCodeAt(0),
  P = "P".charCodeAt(0),
  p = "p".charCodeAt(0),
  PLUS = "+".charCodeAt(0),
  R = "R".charCodeAt(0),
  r = "r".charCodeAt(0),
  S = "S".charCodeAt(0),
  s = "s".charCodeAt(0),
  SPACE = " ".charCodeAt(0),
  TAB = "\t".charCodeAt(0),
}
