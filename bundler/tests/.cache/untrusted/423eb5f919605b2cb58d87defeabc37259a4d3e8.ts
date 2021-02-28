// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/codec.ts


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

import { ErrorCode, NatsError } from "./error.ts";
import { TD, TE } from "./encoders.ts";

export interface Codec<T> {
  encode(d: T): Uint8Array;
  decode(a: Uint8Array): T;
}

export function StringCodec(): Codec<string> {
  return {
    encode(d: string): Uint8Array {
      return TE.encode(d);
    },
    decode(a: Uint8Array): string {
      return TD.decode(a);
    },
  };
}

export function JSONCodec<T = unknown>(): Codec<T> {
  return {
    encode(d: T): Uint8Array {
      try {
        if (d === undefined) {
          // @ts-ignore: json will not handle undefined
          d = null;
        }
        return TE.encode(JSON.stringify(d));
      } catch (err) {
        throw NatsError.errorForCode(ErrorCode.BAD_JSON, err);
      }
    },

    decode(a: Uint8Array): T {
      try {
        return JSON.parse(TD.decode(a));
      } catch (err) {
        throw NatsError.errorForCode(ErrorCode.BAD_JSON, err);
      }
    },
  };
}
