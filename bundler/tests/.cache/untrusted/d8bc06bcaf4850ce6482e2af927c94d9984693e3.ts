// Loaded from https://raw.githubusercontent.com/nats-io/nats.ws/master/src/connect.ts


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
  NatsConnection,
  NatsConnectionImpl,
  setTransportFactory,
  Transport,
  TransportFactory,
} from "https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/internal_mod.ts";

import { WsTransport } from "./ws_transport.ts";

export function wsUrlParseFn(u: string): string {
  const ut = /^(.*:\/\/)(.*)/;
  if (!ut.test(u)) {
    u = `https://${u}`;
  }
  let url = new URL(u);
  const srcProto = url.protocol.toLowerCase();
  if (srcProto !== "https:" && srcProto !== "http") {
    u = u.replace(/^(.*:\/\/)(.*)/gm, "$2");
    url = new URL(`http://${u}`);
  }

  let protocol;
  let port;
  const host = url.hostname;
  const path = url.pathname;
  const search = url.search || "";

  switch (srcProto) {
    case "http:":
    case "ws:":
    case "nats:":
      port = url.port || "80";
      protocol = "ws:";
      break;
    default:
      port = url.port || "443";
      protocol = "wss:";
      break;
  }
  return `${protocol}//${host}:${port}${path}${search}`;
}

export function connect(opts: ConnectionOptions = {}): Promise<NatsConnection> {
  setTransportFactory({
    defaultPort: 443,
    urlParseFn: wsUrlParseFn,
    factory: (): Transport => {
      return new WsTransport();
    },
  } as TransportFactory);

  return NatsConnectionImpl.connect(opts);
}
