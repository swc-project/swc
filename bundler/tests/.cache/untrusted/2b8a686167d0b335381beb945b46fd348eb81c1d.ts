// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/bench.ts


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

import { Empty, NatsConnection } from "./types.ts";
import { nuid } from "./nuid.ts";
import { deferred, Perf } from "./util.ts";
import { ErrorCode, NatsError } from "./error.ts";
import type { NatsConnectionImpl } from "./nats.ts";

export class Metric {
  name: string;
  duration: number;
  date: number;
  payload: number;
  msgs: number;
  lang!: string;
  version!: string;
  bytes: number;
  asyncRequests?: boolean;
  min?: number;
  max?: number;

  constructor(name: string, duration: number) {
    this.name = name;
    this.duration = duration;
    this.date = Date.now();
    this.payload = 0;
    this.msgs = 0;
    this.bytes = 0;
  }

  toString(): string {
    const sec = (this.duration) / 1000;
    const mps = Math.round(this.msgs / sec);
    const label = this.asyncRequests ? "asyncRequests" : "";
    let minmax = "";
    if (this.max) {
      minmax = `${this.min}/${this.max}`;
    }

    return `${this.name}${label ? " [asyncRequests]" : ""} ${
      humanizeNumber(mps)
    } msgs/sec - [${sec.toFixed(2)} secs] ~ ${
      throughput(this.bytes, sec)
    } ${minmax}`;
  }

  toCsv(): string {
    return `"${this.name}",${
      new Date(this.date).toISOString()
    },${this.lang},${this.version},${this.msgs},${this.payload},${this.bytes},${this.duration},${
      this.asyncRequests ? this.asyncRequests : false
    }\n`;
  }

  static header(): string {
    return `Test,Date,Lang,Version,Count,MsgPayload,Bytes,Millis,Async\n`;
  }
}

export interface BenchOpts {
  callbacks?: boolean;
  msgs?: number;
  size?: number;
  subject?: string;
  asyncRequests?: boolean;
  pub?: boolean;
  sub?: boolean;
  rep?: boolean;
  req?: boolean;
}

export class Bench {
  nc: NatsConnection;
  callbacks: boolean;
  msgs: number;
  size: number;
  subject: string;
  asyncRequests?: boolean;
  pub?: boolean;
  sub?: boolean;
  req?: boolean;
  rep?: boolean;
  perf: Perf;
  payload: Uint8Array;

  constructor(
    nc: NatsConnection,
    opts: BenchOpts = {
      msgs: 100000,
      size: 128,
      subject: "",
      asyncRequests: false,
      pub: false,
      sub: false,
      req: false,
      rep: false,
    },
  ) {
    this.nc = nc;
    this.callbacks = opts.callbacks || false;
    this.msgs = opts.msgs || 0;
    this.size = opts.size || 0;
    this.subject = opts.subject || nuid.next();
    this.asyncRequests = opts.asyncRequests || false;
    this.pub = opts.pub || false;
    this.sub = opts.sub || false;
    this.req = opts.req || false;
    this.rep = opts.rep || false;
    this.perf = new Perf();
    this.payload = this.size ? new Uint8Array(this.size) : Empty;

    if (!this.pub && !this.sub && !this.req && !this.rep) {
      throw new Error("No bench option selected");
    }
  }

  async run(): Promise<Metric[]> {
    this.nc.closed()
      .then((err) => {
        if (err) {
          throw new NatsError(
            `bench closed with an error: ${err.message}`,
            ErrorCode.UNKNOWN,
            err,
          );
        }
      });

    if (this.callbacks) {
      await this.runCallbacks();
    } else {
      await this.runAsync();
    }
    return this.processMetrics();
  }

  processMetrics(): Metric[] {
    const nc = this.nc as NatsConnectionImpl;
    const { lang, version } = nc.protocol.transport;

    if (this.pub && this.sub) {
      this.perf.measure("pubsub", "pubStart", "subStop");
    }

    const measures = this.perf.getEntries();
    const pubsub = measures.find((m) => m.name === "pubsub");
    const req = measures.find((m) => m.name === "req");
    const pub = measures.find((m) => m.name === "pub");
    const sub = measures.find((m) => m.name === "sub");

    const stats = this.nc.stats();

    const metrics: Metric[] = [];
    if (pubsub) {
      const { name, duration } = pubsub;
      const m = new Metric(name, duration);
      m.msgs = this.msgs * 2;
      m.bytes = stats.inBytes + stats.outBytes;
      m.lang = lang;
      m.version = version;
      m.payload = this.payload.length;
      metrics.push(m);
    }

    if (pub) {
      const { name, duration } = pub;
      const m = new Metric(name, duration);
      m.msgs = this.msgs;
      m.bytes = stats.outBytes;
      m.lang = lang;
      m.version = version;
      m.payload = this.payload.length;
      metrics.push(m);
    }

    if (sub) {
      const { name, duration } = sub;
      const m = new Metric(name, duration);
      m.msgs = this.msgs;
      m.bytes = stats.inBytes;
      m.lang = lang;
      m.version = version;
      m.payload = this.payload.length;
      metrics.push(m);
    }

    if (req) {
      const { name, duration } = req;
      const m = new Metric(name, duration);
      m.msgs = this.msgs * 2;
      m.bytes = stats.inBytes + stats.outBytes;
      m.lang = lang;
      m.version = version;
      m.payload = this.payload.length;
      metrics.push(m);
    }

    return metrics;
  }

  async runCallbacks(): Promise<void> {
    const jobs: Promise<void>[] = [];

    if (this.req) {
      const d = deferred<void>();
      jobs.push(d);
      const sub = this.nc.subscribe(
        this.subject,
        {
          max: this.msgs,
          callback: (_, m) => {
            m.respond(this.payload);
            if (sub.getProcessed() === this.msgs) {
              d.resolve();
            }
          },
        },
      );
    }

    if (this.sub) {
      const d = deferred<void>();
      jobs.push(d);
      let i = 0;
      const sub = this.nc.subscribe(this.subject, {
        max: this.msgs,
        callback: (_, msg) => {
          i++;
          if (i === 1) {
            this.perf.mark("subStart");
          }
          if (i === this.msgs) {
            this.perf.mark("subStop");
            this.perf.measure("sub", "subStart", "subStop");
            d.resolve();
          }
        },
      });
    }

    if (this.pub) {
      const job = (async () => {
        this.perf.mark("pubStart");
        for (let i = 0; i < this.msgs; i++) {
          this.nc.publish(this.subject, this.payload);
        }
        await this.nc.flush();
        this.perf.mark("pubStop");
        this.perf.measure("pub", "pubStart", "pubStop");
      })();
      jobs.push(job);
    }

    if (this.req) {
      const job = (async () => {
        if (this.asyncRequests) {
          this.perf.mark("reqStart");
          const a = [];
          for (let i = 0; i < this.msgs; i++) {
            a.push(
              this.nc.request(this.subject, this.payload, { timeout: 20000 }),
            );
          }
          await Promise.all(a);
          this.perf.mark("reqStop");
          this.perf.measure("req", "reqStart", "reqStop");
        } else {
          this.perf.mark("reqStart");
          for (let i = 0; i < this.msgs; i++) {
            await this.nc.request(this.subject);
          }
          this.perf.mark("reqStop");
          this.perf.measure("req", "reqStart", "reqStop");
        }
      })();
      jobs.push(job);
    }

    await Promise.all(jobs);
  }

  async runAsync(): Promise<void> {
    const jobs: Promise<void>[] = [];

    if (this.req) {
      const sub = this.nc.subscribe(this.subject, { max: this.msgs });
      const job = (async () => {
        for await (const m of sub) {
          m.respond(this.payload);
        }
      })();
      jobs.push(job);
    }

    if (this.sub) {
      let first = false;
      const sub = this.nc.subscribe(this.subject, { max: this.msgs });
      const job = (async () => {
        for await (const m of sub) {
          if (!first) {
            this.perf.mark("subStart");
            first = true;
          }
        }
        this.perf.mark("subStop");
        this.perf.measure("sub", "subStart", "subStop");
      })();
      jobs.push(job);
    }

    if (this.pub) {
      const job = (async () => {
        this.perf.mark("pubStart");
        for (let i = 0; i < this.msgs; i++) {
          this.nc.publish(this.subject, this.payload);
        }
        await this.nc.flush();
        this.perf.mark("pubStop");
        this.perf.measure("pub", "pubStart", "pubStop");
      })();
      jobs.push(job);
    }

    if (this.req) {
      const job = (async () => {
        if (this.asyncRequests) {
          this.perf.mark("reqStart");
          const a = [];
          for (let i = 0; i < this.msgs; i++) {
            a.push(
              this.nc.request(this.subject, this.payload, { timeout: 20000 }),
            );
          }
          await Promise.all(a);
          this.perf.mark("reqStop");
          this.perf.measure("req", "reqStart", "reqStop");
        } else {
          this.perf.mark("reqStart");
          for (let i = 0; i < this.msgs; i++) {
            await this.nc.request(this.subject);
          }
          this.perf.mark("reqStop");
          this.perf.measure("req", "reqStart", "reqStop");
        }
      })();
      jobs.push(job);
    }

    await Promise.all(jobs);
  }
}

function throughput(bytes: number, seconds: number): string {
  return humanizeBytes(bytes / seconds);
}

function humanizeBytes(bytes: number, si = false): string {
  const base = si ? 1000 : 1024;
  const pre = si
    ? ["k", "M", "G", "T", "P", "E"]
    : ["K", "M", "G", "T", "P", "E"];
  const post = si ? "iB" : "B";

  if (bytes < base) {
    return `${bytes.toFixed(2)} ${post}/sec`;
  }
  const exp = parseInt(Math.log(bytes) / Math.log(base) + "");
  const index = parseInt((exp - 1) + "");
  return `${(bytes / Math.pow(base, exp)).toFixed(2)} ${pre[index]}${post}/sec`;
}

function humanizeNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
