// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.1/nats-base-client/jsclient.ts


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
  AckPolicy,
  ConsumerAPI,
  ConsumerConfig,
  ConsumerInfo,
  ConsumerInfoable,
  ConsumerOpts,
  DeliverPolicy,
  Destroyable,
  Empty,
  JetStreamClient,
  JetStreamOptions,
  JetStreamPublishOptions,
  JetStreamPullSubscription,
  JetStreamSubscription,
  JetStreamSubscriptionOptions,
  JsMsg,
  Msg,
  NatsConnection,
  PubAck,
  Pullable,
  PullOptions,
  ReplayPolicy,
  RequestOptions,
} from "./types.ts";
import { BaseApiClient } from "./jsbaseclient_api.ts";
import {
  checkJsError,
  isFlowControlMsg,
  nanos,
  validateDurableName,
  validateStreamName,
} from "./jsutil.ts";
import { ConsumerAPIImpl } from "./jsconsumer_api.ts";
import { toJsMsg } from "./jsmsg.ts";
import {
  MsgAdapter,
  TypedSubscription,
  TypedSubscriptionOptions,
} from "./typedsub.ts";
import { ErrorCode, isNatsError, NatsError } from "./error.ts";
import { SubscriptionImpl } from "./subscription.ts";
import { QueuedIterator, QueuedIteratorImpl } from "./queued_iterator.ts";
import { Timeout, timeout } from "./util.ts";
import { createInbox } from "./protocol.ts";
import { headers } from "./headers.ts";
import type { ConsumerOptsBuilder } from "./jsconsumeropts.ts";
import { consumerOpts, isConsumerOptsBuilder } from "./jsconsumeropts.ts";

export interface JetStreamSubscriptionInfoable {
  info: JetStreamSubscriptionInfo | null;
}

enum PubHeaders {
  MsgIdHdr = "Nats-Msg-Id",
  ExpectedStreamHdr = "Nats-Expected-Stream",
  ExpectedLastSeqHdr = "Nats-Expected-Last-Sequence",
  ExpectedLastMsgIdHdr = "Nats-Expected-Last-Msg-Id",
}

export class JetStreamClientImpl extends BaseApiClient
  implements JetStreamClient {
  api: ConsumerAPI;
  constructor(nc: NatsConnection, opts?: JetStreamOptions) {
    super(nc, opts);
    this.api = new ConsumerAPIImpl(nc, opts);
  }

  async publish(
    subj: string,
    data: Uint8Array = Empty,
    opts?: Partial<JetStreamPublishOptions>,
  ): Promise<PubAck> {
    opts = opts ?? {};
    opts.expect = opts.expect ?? {};
    const mh = headers();
    if (opts) {
      if (opts.msgID) {
        mh.set(PubHeaders.MsgIdHdr, opts.msgID);
      }
      if (opts.expect.lastMsgID) {
        mh.set(PubHeaders.ExpectedLastMsgIdHdr, opts.expect.lastMsgID);
      }
      if (opts.expect.streamName) {
        mh.set(PubHeaders.ExpectedStreamHdr, opts.expect.streamName);
      }
      if (opts.expect.lastSequence) {
        mh.set(PubHeaders.ExpectedLastSeqHdr, `${opts.expect.lastSequence}`);
      }
    }

    const to = opts.timeout ?? this.timeout;
    const ro = {} as RequestOptions;
    if (to) {
      ro.timeout = to;
    }
    if (opts) {
      ro.headers = mh;
    }

    const r = await this.nc.request(subj, data, ro);

    const pa = this.parseJsResponse(r) as PubAck;
    if (pa.stream === "") {
      throw NatsError.errorForCode(ErrorCode.JetStreamInvalidAck);
    }
    pa.duplicate = pa.duplicate ? pa.duplicate : false;
    return pa;
  }

  async pull(stream: string, durable: string): Promise<JsMsg> {
    validateStreamName(stream);
    validateDurableName(durable);
    const msg = await this.nc.request(
      // FIXME: specify expires
      `${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`,
      this.jc.encode({ no_wait: true, batch: 1, expires: nanos(this.timeout) }),
      { noMux: true, timeout: this.timeout },
    );
    const err = checkJsError(msg);
    if (err) {
      throw (err);
    }
    return toJsMsg(msg);
  }

  /*
  * Returns available messages upto specified batch count.
  * If expires is set the iterator will wait for the specified
  * amount of millis before closing the subscription.
  * If no_wait is specified, the iterator will return no messages.
  * @param stream
  * @param durable
  * @param opts
  */
  fetch(
    stream: string,
    durable: string,
    opts: Partial<PullOptions> = {},
  ): QueuedIterator<JsMsg> {
    validateStreamName(stream);
    validateDurableName(durable);

    let timer: Timeout<void> | null = null;

    const args: Partial<PullOptions> = {};
    args.batch = opts.batch ?? 1;
    args.no_wait = opts.no_wait ?? false;
    const expires = opts.expires ?? 0;
    if (expires) {
      args.expires = nanos(expires);
    }
    if (expires === 0 && args.no_wait === false) {
      throw new Error("expires or no_wait is required");
    }

    const qi = new QueuedIteratorImpl<JsMsg>();
    const wants = args.batch;
    let received = 0;
    qi.dispatchedFn = (m: JsMsg | null) => {
      if (m) {
        received++;
        if (timer && m.info.pending === 0) {
          // the expiration will close it
          return;
        }
        // if we have one pending and we got the expected
        // or there are no more stop the iterator
        if (
          qi.getPending() === 1 && m.info.pending === 0 || wants === received
        ) {
          qi.stop();
        }
      }
    };

    const inbox = createInbox(this.nc.options.inboxPrefix);
    const sub = this.nc.subscribe(inbox, {
      max: opts.batch,
      callback: (err: Error | null, msg) => {
        if (err === null) {
          err = checkJsError(msg);
        }
        if (err !== null) {
          if (timer) {
            timer.cancel();
            timer = null;
          }
          if (
            isNatsError(err) && err.code === ErrorCode.JetStream404NoMessages
          ) {
            qi.stop();
          } else {
            qi.stop(err);
          }
        } else {
          qi.received++;
          qi.push(toJsMsg(msg));
        }
      },
    });

    // timer on the client  the issue is that the request
    // is started on the client, which means that it will expire
    // on the client first
    if (expires) {
      timer = timeout<void>(expires);
      timer.catch(() => {
        if (!sub.isClosed()) {
          sub.drain();
          timer = null;
        }
      });
    }

    (async () => {
      // close the iterator if the connection or subscription closes unexpectedly
      await (sub as SubscriptionImpl).closed;
      if (timer !== null) {
        timer.cancel();
        timer = null;
      }
      qi.stop();
    })().catch();

    this.nc.publish(
      `${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`,
      this.jc.encode(args),
      { reply: inbox },
    );
    return qi;
  }

  async pullSubscribe(
    subject: string,
    opts: ConsumerOptsBuilder | Partial<ConsumerOpts> = consumerOpts(),
  ): Promise<JetStreamPullSubscription> {
    const cso = await this._processOptions(subject, opts);
    if (!cso.attached) {
      cso.config.filter_subject = subject;
    }
    if (cso.config.deliver_subject) {
      throw new Error(
        "consumer info specifies deliver_subject - pull consumers cannot have deliver_subject set",
      );
    }

    const ackPolicy = cso.config.ack_policy;
    if (ackPolicy === AckPolicy.None || ackPolicy === AckPolicy.All) {
      throw new Error("ack policy for pull consumers must be explicit");
    }

    const so = this._buildTypedSubscriptionOpts(cso);
    const sub = new JetStreamPullSubscriptionImpl(
      this,
      cso.deliver,
      so,
    );

    try {
      await this._maybeCreateConsumer(cso);
    } catch (err) {
      sub.unsubscribe();
      throw err;
    }
    sub.info = cso;
    return sub as JetStreamPullSubscription;
  }

  async subscribe(
    subject: string,
    opts: ConsumerOptsBuilder | Partial<ConsumerOpts> = consumerOpts(),
  ): Promise<JetStreamSubscription> {
    const cso = await this._processOptions(subject, opts);
    // this effectively requires deliver subject to be specified
    // as an option otherwise we have a pull consumer
    if (!cso.config.deliver_subject) {
      throw new Error(
        "consumer info specifies a pull consumer - deliver_subject is required",
      );
    }

    const so = this._buildTypedSubscriptionOpts(cso);
    const sub = new JetStreamSubscriptionImpl(
      this,
      cso.deliver,
      so,
    );
    try {
      await this._maybeCreateConsumer(cso);
    } catch (err) {
      sub.unsubscribe();
      throw err;
    }
    sub.info = cso;
    return sub;
  }

  async _processOptions(
    subject: string,
    opts: ConsumerOptsBuilder | Partial<ConsumerOpts> = consumerOpts(),
  ): Promise<JetStreamSubscriptionInfo> {
    const jsi =
      (isConsumerOptsBuilder(opts)
        ? opts.getOpts()
        : opts) as JetStreamSubscriptionInfo;

    jsi.api = this;
    jsi.config = jsi.config ?? {} as ConsumerConfig;
    jsi.stream = jsi.stream ? jsi.stream : await this.findStream(subject);

    jsi.attached = false;
    if (jsi.config.durable_name) {
      try {
        const info = await this.api.info(jsi.stream, jsi.config.durable_name);
        if (info) {
          if (
            info.config.filter_subject && info.config.filter_subject !== subject
          ) {
            throw new Error("subject does not match consumer");
          }
          jsi.config = info.config;
          jsi.attached = true;
        }
      } catch (err) {
        //consumer doesn't exist
        if (err.code !== "404") {
          throw err;
        }
      }
    }

    if (!jsi.attached) {
      jsi.config.filter_subject = subject;
      // jsi.config.deliver_subject = jsi.config.deliver_subject ??
      //   createInbox(this.nc.options.inboxPrefix);
    }

    jsi.deliver = jsi.config.deliver_subject ??
      createInbox(this.nc.options.inboxPrefix);

    return jsi;
  }

  _buildTypedSubscriptionOpts(
    jsi: JetStreamSubscriptionInfo,
  ): TypedSubscriptionOptions<JsMsg> {
    const so = {} as TypedSubscriptionOptions<JsMsg>;
    so.adapter = msgAdapter(jsi.callbackFn === undefined);
    if (jsi.callbackFn) {
      so.callback = jsi.callbackFn;
    }
    if (!jsi.mack) {
      so.dispatchedFn = autoAckJsMsg;
    }
    so.max = jsi.max ?? 0;
    return so;
  }

  async _maybeCreateConsumer(jsi: JetStreamSubscriptionInfo): Promise<void> {
    if (jsi.attached) {
      return;
    }
    jsi.config = Object.assign({
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      ack_wait: nanos(30 * 1000),
      replay_policy: ReplayPolicy.Instant,
    }, jsi.config);

    const ci = await this.api.add(jsi.stream, jsi.config);
    jsi.name = ci.name;
    jsi.config = ci.config;
  }
}

class JetStreamSubscriptionImpl extends TypedSubscription<JsMsg>
  implements JetStreamSubscriptionInfoable, Destroyable, ConsumerInfoable {
  constructor(
    js: BaseApiClient,
    subject: string,
    opts: JetStreamSubscriptionOptions,
  ) {
    super(js.nc, subject, opts);
  }

  set info(info: JetStreamSubscriptionInfo | null) {
    (this.sub as SubscriptionImpl).info = info;
  }

  get info(): JetStreamSubscriptionInfo | null {
    return this.sub.info as JetStreamSubscriptionInfo;
  }

  async destroy(): Promise<void> {
    if (!this.isClosed()) {
      await this.drain();
    }
    const jinfo = this.sub.info as JetStreamSubscriptionInfo;
    const name = jinfo.config.durable_name ?? jinfo.name;
    const subj = `${jinfo.api.prefix}.CONSUMER.DELETE.${jinfo.stream}.${name}`;
    await jinfo.api._request(subj);
  }

  async consumerInfo(): Promise<ConsumerInfo> {
    const jinfo = this.sub.info as JetStreamSubscriptionInfo;
    const name = jinfo.config.durable_name ?? jinfo.name;
    const subj = `${jinfo.api.prefix}.CONSUMER.INFO.${jinfo.stream}.${name}`;
    return await jinfo.api._request(subj) as ConsumerInfo;
  }
}

class JetStreamPullSubscriptionImpl extends JetStreamSubscriptionImpl
  implements Pullable {
  constructor(
    js: BaseApiClient,
    subject: string,
    opts: TypedSubscriptionOptions<JsMsg>,
  ) {
    super(js, subject, opts);
  }
  pull(opts: Partial<PullOptions> = { batch: 1 }): void {
    const { stream, config } = this.sub.info as JetStreamSubscriptionInfo;
    const consumer = config.durable_name;
    const args: Partial<PullOptions> = {};
    args.batch = opts.batch ?? 1;
    args.no_wait = opts.no_wait ?? false;
    // FIXME: this is nanos
    if (opts.expires && opts.expires > 0) {
      args.expires = opts.expires;
    }

    if (this.info) {
      const api = (this.info.api as BaseApiClient);
      const subj = `${api.prefix}.CONSUMER.MSG.NEXT.${stream}.${consumer}`;
      const reply = this.sub.subject;

      api.nc.publish(
        subj,
        api.jc.encode(args),
        { reply: reply },
      );
    }
  }
}

interface JetStreamSubscriptionInfo extends ConsumerOpts {
  api: BaseApiClient;
  attached: boolean;
  deliver: string;
}

function msgAdapter(iterator: boolean): MsgAdapter<JsMsg> {
  if (iterator) {
    return iterMsgAdapter;
  } else {
    return cbMsgAdapter;
  }
}

function cbMsgAdapter(
  err: NatsError | null,
  msg: Msg,
): [NatsError | null, JsMsg | null] {
  if (err) {
    return [err, null];
  }
  err = checkJsError(msg);
  if (err) {
    return [err, null];
  }
  if (isFlowControlMsg(msg)) {
    msg.respond();
    return [null, null];
  }
  const jm = toJsMsg(msg);
  try {
    // this will throw if not a JsMsg
    jm.info;
    return [null, jm];
  } catch (err) {
    return [err, null];
  }
}

function iterMsgAdapter(
  err: NatsError | null,
  msg: Msg,
): [NatsError | null, JsMsg | null] {
  if (err) {
    return [err, null];
  }

  // iterator will close if we have an error
  // check for errors that shouldn't close it
  const ne = checkJsError(msg);
  if (ne !== null) {
    switch (ne.code) {
      case ErrorCode.JetStream404NoMessages:
      case ErrorCode.JetStream408RequestTimeout:
      case ErrorCode.JetStream409MaxAckPendingExceeded:
        return [null, null];
      default:
        return [ne, null];
    }
  }
  if (isFlowControlMsg(msg)) {
    msg.respond();
    return [null, null];
  }
  const jm = toJsMsg(msg);
  try {
    // this will throw if not a JsMsg
    jm.info;
    return [null, jm];
  } catch (err) {
    return [err, null];
  }
}

function autoAckJsMsg(data: JsMsg | null) {
  if (data) {
    data.ack();
  }
}
