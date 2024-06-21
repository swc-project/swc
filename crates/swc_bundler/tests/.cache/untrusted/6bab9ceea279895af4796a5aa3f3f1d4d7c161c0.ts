// Loaded from https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.1/nats-base-client/error.ts


/*
 * Copyright 2018-2021 The NATS Authors
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
  ApiError = "BAD API",
  BadAuthentication = "BAD_AUTHENTICATION",
  BadCreds = "BAD_CREDS",
  BadHeader = "BAD_HEADER",
  BadJson = "BAD_JSON",
  BadPayload = "BAD_PAYLOAD",
  BadSubject = "BAD_SUBJECT",
  Cancelled = "CANCELLED",
  ConnectionClosed = "CONNECTION_CLOSED",
  ConnectionDraining = "CONNECTION_DRAINING",
  ConnectionRefused = "CONNECTION_REFUSED",
  ConnectionTimeout = "CONNECTION_TIMEOUT",
  Disconnect = "DISCONNECT",
  InvalidOption = "INVALID_OPTION",
  InvalidPayload = "INVALID_PAYLOAD",
  MaxPayloadExceeded = "MAX_PAYLOAD_EXCEEDED",
  NoResponders = "503",
  NotFunction = "NOT_FUNC",
  RequestError = "REQUEST_ERROR",
  ServerOptionNotAvailable = "SERVER_OPT_NA",
  SubClosed = "SUB_CLOSED",
  SubDraining = "SUB_DRAINING",
  Timeout = "TIMEOUT",
  Tls = "TLS",
  Unknown = "UNKNOWN_ERROR",
  WssRequired = "WSS_REQUIRED",

  // jetstream
  JetStreamInvalidAck = "JESTREAM_INVALID_ACK",
  JetStream404NoMessages = "404",
  JetStream408RequestTimeout = "408",
  JetStream409MaxAckPendingExceeded = "409",
  JetStreamNotEnabled = "503",

  // emitted by the server
  AuthorizationViolation = "AUTHORIZATION_VIOLATION",
  AuthenticationExpired = "AUTHENTICATION_EXPIRED",
  ProtocolError = "NATS_PROTOCOL_ERR",
  PermissionsViolation = "PERMISSIONS_VIOLATION",
}

export class Messages {
  messages: Map<string, string>;

  constructor() {
    this.messages = new Map<string, string>();
    this.messages.set(
      ErrorCode.InvalidPayload,
      "Invalid payload type - payloads can be 'binary', 'string', or 'json'",
    );
    this.messages.set(ErrorCode.BadJson, "Bad JSON");
    this.messages.set(
      ErrorCode.WssRequired,
      "TLS is required, therefore a secure websocket connection is also required",
    );
  }

  static getMessage(s: string): string {
    return messages.getMessage(s);
  }

  getMessage(s: string): string {
    return this.messages.get(s) || s;
  }
}

// safari doesn't support static class members
const messages: Messages = new Messages();

export function isNatsError(err: NatsError | Error): err is NatsError {
  return typeof (err as NatsError).code === "string";
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
    const m = Messages.getMessage(code);
    return new NatsError(m, code, chainedError);
  }

  isAuthError(): boolean {
    return this.code === ErrorCode.AuthenticationExpired ||
      this.code === ErrorCode.AuthorizationViolation;
  }

  isPermissionError(): boolean {
    return this.code === ErrorCode.PermissionsViolation;
  }

  isProtocolError(): boolean {
    return this.code === ErrorCode.ProtocolError;
  }
}
