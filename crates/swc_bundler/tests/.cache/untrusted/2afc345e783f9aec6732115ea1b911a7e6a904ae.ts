// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.1/nats-base-client/jsutil.ts


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
  ConsumerConfig,
  DeliverPolicy,
  Msg,
  Nanos,
  ReplayPolicy,
} from "./types.ts";
import { ErrorCode, NatsError } from "./error.ts";

export function validateDurableName(name?: string) {
  return validateName("durable", name);
}

export function validateStreamName(name?: string) {
  return validateName("stream", name);
}

export function validateName(context: string, name = "") {
  if (name === "") {
    throw Error(`${context} name required`);
  }
  const bad = [".", "*", ">"];
  bad.forEach((v) => {
    if (name.indexOf(v) !== -1) {
      throw Error(
        `invalid ${context} name - ${context} name cannot contain '${v}'`,
      );
    }
  });
}

export function defaultConsumer(
  name: string,
  opts: Partial<ConsumerConfig> = {},
): ConsumerConfig {
  return Object.assign({
    name: name,
    deliver_policy: DeliverPolicy.All,
    ack_policy: AckPolicy.Explicit,
    ack_wait: nanos(30 * 1000),
    replay_policy: ReplayPolicy.Instant,
  }, opts);
}

export function nanos(millis: number): Nanos {
  return millis * 1000000;
}

export function millis(ns: Nanos) {
  return ns / 1000000;
}

export function isFlowControlMsg(msg: Msg): boolean {
  const h = msg.headers;
  if (!h) {
    return false;
  }
  return h.code >= 100 && h.code < 200;
}

export function checkJsError(msg: Msg): NatsError | null {
  const h = msg.headers;
  if (!h) {
    return null;
  }
  return checkJsErrorCode(h.code, h.status);
}

export function checkJsErrorCode(
  code: number,
  description = "",
): NatsError | null {
  if (code < 300) {
    return null;
  }
  description = description.toLowerCase();
  switch (code) {
    case 503:
      return NatsError.errorForCode(
        ErrorCode.JetStreamNotEnabled,
        new Error(description),
      );
    default:
      if (description === "") {
        description = ErrorCode.Unknown;
      }
      return new NatsError(description, `${code}`);
  }
}
