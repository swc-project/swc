// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-rc4/nats-base-client/options.ts


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

import { extend } from "./util.ts";
import { ErrorCode, NatsError } from "./error.ts";
import {
  ConnectionOptions,
  DEFAULT_HOST,
  DEFAULT_JITTER,
  DEFAULT_JITTER_TLS,
  DEFAULT_MAX_PING_OUT,
  DEFAULT_MAX_RECONNECT_ATTEMPTS,
  DEFAULT_PING_INTERVAL,
  DEFAULT_RECONNECT_TIME_WAIT,
  ServerInfo,
} from "./types.ts";
import { buildAuthenticator } from "./authenticator.ts";
import { defaultPort } from "./transport.ts";
import { createInbox } from "./mod.ts";

export function defaultOptions(): ConnectionOptions {
  return {
    maxPingOut: DEFAULT_MAX_PING_OUT,
    maxReconnectAttempts: DEFAULT_MAX_RECONNECT_ATTEMPTS,
    noRandomize: false,
    pedantic: false,
    pingInterval: DEFAULT_PING_INTERVAL,
    reconnect: true,
    reconnectJitter: DEFAULT_JITTER,
    reconnectJitterTLS: DEFAULT_JITTER_TLS,
    reconnectTimeWait: DEFAULT_RECONNECT_TIME_WAIT,
    tls: undefined,
    verbose: false,
    waitOnFirstConnect: false,
  } as ConnectionOptions;
}

export function parseOptions(opts?: ConnectionOptions): ConnectionOptions {
  const dhp = `${DEFAULT_HOST}:${defaultPort()}`;
  opts = opts || { servers: [dhp] };
  if (opts.port) {
    opts.servers = [`${DEFAULT_HOST}:${opts.port}`];
  }
  if (typeof opts.servers === "string") {
    opts.servers = [opts.servers];
  }
  if (opts.servers && opts.servers.length === 0) {
    opts.servers = [dhp];
  }
  const options = extend(defaultOptions(), opts);

  // tokens don't get users
  if (opts.user && opts.token) {
    throw NatsError.errorForCode(ErrorCode.BAD_AUTHENTICATION);
  }

  // if authenticator, no other options allowed
  if (
    opts.authenticator && (
      opts.token || opts.user || opts.pass
    )
  ) {
    throw NatsError.errorForCode(ErrorCode.BAD_AUTHENTICATION);
  }
  options.authenticator = buildAuthenticator(options);

  ["reconnectDelayHandler", "authenticator"].forEach((n) => {
    if (options[n] && typeof options[n] !== "function") {
      throw new NatsError(
        `${n} option should be a function`,
        ErrorCode.NOT_FUNC,
      );
    }
  });

  if (!options.reconnectDelayHandler) {
    options.reconnectDelayHandler = () => {
      let extra = options.tls
        ? options.reconnectJitterTLS
        : options.reconnectJitter;
      if (extra) {
        extra++;
        extra = Math.floor(Math.random() * extra);
      }
      return options.reconnectTimeWait + extra;
    };
  }

  if (options.inboxPrefix) {
    try {
      createInbox(options.inboxPrefix);
    } catch (err) {
      throw new NatsError(err.message, ErrorCode.API_ERROR);
    }
  }

  return options;
}

export function checkOptions(info: ServerInfo, options: ConnectionOptions) {
  const { proto, tls_required: tlsRequired } = info;
  if ((proto === undefined || proto < 1) && options.noEcho) {
    throw new NatsError("noEcho", ErrorCode.SERVER_OPTION_NA);
  }
  if (options.tls && !tlsRequired) {
    throw new NatsError("tls", ErrorCode.SERVER_OPTION_NA);
  }
}

export function checkUnsupportedOption(prop: string, v?: string) {
  if (v) {
    throw new NatsError(prop, ErrorCode.INVALID_OPTION);
  }
}
