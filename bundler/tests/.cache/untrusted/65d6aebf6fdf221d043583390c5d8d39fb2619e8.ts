// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/error.ts


/*
 * Copyright 2018-2020 The NATS Authors
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

export enum ErrorCode {
  // emitted by the client
  API_ERROR = "BAD API",
  BAD_AUTHENTICATION = "BAD_AUTHENTICATION",
  BAD_CREDS = "BAD_CREDS",
  BAD_HEADER = "BAD_HEADER",
  BAD_JSON = "BAD_JSON",
  BAD_PAYLOAD = "BAD_PAYLOAD",
  BAD_SUBJECT = "BAD_SUBJECT",
  CANCELLED = "CANCELLED",
  CONNECTION_CLOSED = "CONNECTION_CLOSED",
  CONNECTION_DRAINING = "CONNECTION_DRAINING",
  CONNECTION_REFUSED = "CONNECTION_REFUSED",
  CONNECTION_TIMEOUT = "CONNECTION_TIMEOUT",
  DISCONNECT = "DISCONNECT",
  INVALID_OPTION = "INVALID_OPTION",
  INVALID_PAYLOAD_TYPE = "INVALID_PAYLOAD",
  MAX_PAYLOAD_EXCEEDED = "MAX_PAYLOAD_EXCEEDED",
  NOT_FUNC = "NOT_FUNC",
  REQUEST_ERROR = "REQUEST_ERROR",
  SERVER_OPTION_NA = "SERVER_OPT_NA",
  SUB_CLOSED = "SUB_CLOSED",
  SUB_DRAINING = "SUB_DRAINING",
  TIMEOUT = "TIMEOUT",
  TLS = "TLS",
  UNKNOWN = "UNKNOWN_ERROR",
  WSS_REQUIRED = "WSS_REQUIRED",

  // emitted by the server
  AUTHORIZATION_VIOLATION = "AUTHORIZATION_VIOLATION",
  NATS_PROTOCOL_ERR = "NATS_PROTOCOL_ERR",
  PERMISSIONS_VIOLATION = "PERMISSIONS_VIOLATION",
}

export class Messages {
  static messages = new Messages();
  messages: Map<string, string>;

  constructor() {
    this.messages = new Map<string, string>();

    this.messages.set(
      ErrorCode.INVALID_PAYLOAD_TYPE,
      "Invalid payload type - payloads can be 'binary', 'string', or 'json'",
    );
    this.messages.set(ErrorCode.BAD_JSON, "Bad JSON");

    this.messages.set(
      ErrorCode.WSS_REQUIRED,
      "TLS is required, therefore a secure websocket connection is also required",
    );
  }

  static getMessage(s: string): string {
    return Messages.messages.getMessage(s);
  }

  getMessage(s: string): string {
    return this.messages.get(s) || s;
  }
}

export class NatsError extends Error {
  name: string;
  message: string;
  code: string;
  chainedError?: Error;

  /**
     * @param {String} message
     * @param {String} code
     * @param {Error} [chainedError]
     * @constructor
     *
     * @api private
     */
  constructor(message: string, code: string, chainedError?: Error) {
    super(message);
    this.name = "NatsError";
    this.message = message;
    this.code = code;
    this.chainedError = chainedError;
  }

  static errorForCode(code: string, chainedError?: Error): NatsError {
    let m = Messages.getMessage(code);
    return new NatsError(m, code, chainedError);
  }
}
