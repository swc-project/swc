// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/transport.ts


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
import {
  ConnectionOptions,
  DEFAULT_PORT,
  Server,
  URLParseFn,
} from "./types.ts";

let transportConfig: TransportFactory;
export function setTransportFactory(config: TransportFactory): void {
  transportConfig = config;
}

export function defaultPort(): number {
  return transportConfig !== undefined &&
      transportConfig.defaultPort !== undefined
    ? transportConfig.defaultPort
    : DEFAULT_PORT;
}

export function getUrlParseFn(): URLParseFn | undefined {
  return transportConfig !== undefined && transportConfig.urlParseFn
    ? transportConfig.urlParseFn
    : undefined;
}

export function newTransport(): Transport {
  if (!transportConfig || typeof transportConfig.factory !== "function") {
    throw new Error("transport fn is not set");
  }
  return transportConfig.factory();
}

export interface TransportFactory {
  factory?: () => Transport;
  defaultPort?: number;
  urlParseFn?: URLParseFn;
}

export interface Transport extends AsyncIterable<Uint8Array> {
  readonly isClosed: boolean;
  readonly lang: string;
  readonly version: string;
  readonly closeError?: Error;

  connect(
    server: Server,
    opts: ConnectionOptions,
  ): Promise<void>;

  [Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array>;

  isEncrypted(): boolean;

  send(frame: Uint8Array): Promise<void>;

  close(err?: Error): Promise<void>;

  disconnect(): void;

  closed(): Promise<void | Error>;
}
