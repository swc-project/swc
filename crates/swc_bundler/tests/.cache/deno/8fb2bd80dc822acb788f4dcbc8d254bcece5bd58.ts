// Loaded from https://deno.land/x/oak/server_sent_event.ts


// Copyright 2018-2021 the oak authors. All rights reserved. MIT license.

import type { Application } from "./application.ts";
import { assert, BufWriter } from "./deps.ts";
import type { ServerRequest } from "./types.d.ts";

const encoder = new TextEncoder();

export interface ServerSentEventInit extends EventInit {
  /** An optional `id` which will be sent with the event and exposed in the
   * client `EventSource`. */
  id?: number;

  /** The replacer is passed to `JSON.stringify` when converting the `data`
   * property to a JSON string. */
  replacer?:
    | (string | number)[]
    // deno-lint-ignore no-explicit-any
    | ((this: any, key: string, value: any) => any);

  /** Space is passed to `JSON.stringify` when converting the `data` property
   * to a JSON string. */
  space?: string | number;
}

export interface ServerSentEventTargetOptions {
  /** Additional headers to send to the client during startup.  These headers
   * will overwrite any of the default headers if the key is duplicated. */
  headers?: Headers;
}

class CloseEvent extends Event {
  constructor(eventInit: EventInit) {
    super("close", eventInit);
  }
}

/** An event which contains information which will be sent to the remote
 * connection and be made available in an `EventSource` as an event. */
export class ServerSentEvent extends Event {
  #data: string;
  #id?: number;
  #type: string;

  constructor(
    type: string,
    // deno-lint-ignore no-explicit-any
    data: any,
    { replacer, space, ...eventInit }: ServerSentEventInit = {},
  ) {
    super(type, eventInit);
    this.#type = type;
    try {
      this.#data = typeof data === "string"
        ? data
        : JSON.stringify(data, replacer as (string | number)[], space);
    } catch (e) {
      assert(e instanceof Error);
      throw new TypeError(
        `data could not be coerced into a serialized string.\n  ${e.message}`,
      );
    }
    const { id } = eventInit;
    this.#id = id;
  }

  /** The data associated with the event, which will be sent to the client and
   * be made available in the `EventSource`. */
  get data(): string {
    return this.#data;
  }

  /** The optional ID associated with the event that will be sent to the client
   * and be made available in the `EventSource`. */
  get id(): number | undefined {
    return this.#id;
  }

  toString(): string {
    const data = `data: ${this.#data.split("\n").join("\ndata: ")}\n`;
    return `${this.#type === "__message" ? "" : `event: ${this.#type}\n`}${
      this.#id ? `id: ${String(this.#id)}\n` : ""
    }${data}\n`;
  }
}

const response = `HTTP/1.1 200 OK\n`;

const responseHeaders = new Headers(
  [
    ["Connection", "Keep-Alive"],
    ["Content-Type", "text/event-stream"],
    ["Cache-Control", "no-cache"],
    ["Keep-Alive", `timeout=${Number.MAX_SAFE_INTEGER}`],
  ],
);

export class ServerSentEventTarget extends EventTarget {
  #app: Application;
  #closed = false;
  #prev = Promise.resolve();
  #ready: Promise<void> | true;
  #serverRequest: ServerRequest;
  #writer: BufWriter;

  #send = async (payload: string, prev: Promise<void>): Promise<void> => {
    if (this.#closed) {
      return;
    }
    if (this.#ready !== true) {
      await this.#ready;
      this.#ready = true;
    }
    try {
      await prev;
      await this.#writer.write(encoder.encode(payload));
      await this.#writer.flush();
    } catch (error) {
      this.dispatchEvent(new CloseEvent({ cancelable: false }));
      const errorEvent = new ErrorEvent("error", { error });
      this.dispatchEvent(errorEvent);
      this.#app.dispatchEvent(errorEvent);
    }
  };

  #setup = async (overrideHeaders?: Headers): Promise<void> => {
    const headers = new Headers(responseHeaders);
    if (overrideHeaders) {
      for (const [key, value] of overrideHeaders) {
        headers.set(key, value);
      }
    }
    let payload = response;
    for (const [key, value] of headers) {
      payload += `${key}: ${value}\n`;
    }
    payload += `\n`;
    try {
      await this.#writer.write(encoder.encode(payload));
      await this.#writer.flush();
    } catch (error) {
      this.dispatchEvent(new CloseEvent({ cancelable: false }));
      const errorEvent = new ErrorEvent("error", { error });
      this.dispatchEvent(errorEvent);
      this.#app.dispatchEvent(errorEvent);
      throw error;
    }
  };

  /** Is set to `true` if events cannot be sent to the remote connection.
   * Otherwise it is set to `false`.
   * 
   * *Note*: This flag is lazily set, and might not reflect a closed state until
   * another event, comment or message is attempted to be processed. */
  get closed(): boolean {
    return this.#closed;
  }

  constructor(
    app: Application,
    serverRequest: ServerRequest,
    { headers }: ServerSentEventTargetOptions = {},
  ) {
    super();
    this.#app = app;
    this.#serverRequest = serverRequest;
    this.#writer = this.#serverRequest.w;
    this.addEventListener("close", () => {
      this.#closed = true;
      try {
        this.#serverRequest.conn.close();
      } catch (error) {
        if (!(error instanceof Deno.errors.BadResource)) {
          const errorEvent = new ErrorEvent("error", { error });
          this.dispatchEvent(errorEvent);
          this.#app.dispatchEvent(errorEvent);
        }
      }
    });
    this.#ready = this.#setup(headers);
  }

  /** Stop sending events to the remote connection and close the connection. */
  async close(): Promise<void> {
    if (this.#ready !== true) {
      await this.#ready;
    }
    await this.#prev;
    this.dispatchEvent(new CloseEvent({ cancelable: false }));
  }

  /** Send a comment to the remote connection.  Comments are not exposed to the
   * client `EventSource` but are used for diagnostics and helping ensure a
   * connection is kept alive.
   * 
   * ```ts
   * import { Application } from "https://deno.land/x/oak/mod.ts";
   * 
   * const app = new Application();
   * 
   * app.use((ctx) => {
   *    const sse = ctx.getSSETarget();
   *    sse.dispatchComment("this is a comment");
   * });
   * 
   * await app.listen();
   * ```
   */
  dispatchComment(comment: string): boolean {
    this.#prev = this.#send(
      `: ${comment.split("\n").join("\n: ")}\n\n`,
      this.#prev,
    );
    return true;
  }

  /** Dispatch a message to the client.  This message will contain `data: ` only
   * and be available on the client `EventSource` on the `onmessage` or an event
   * listener of type `"message"`. */
  // deno-lint-ignore no-explicit-any
  dispatchMessage(data: any): boolean {
    const event = new ServerSentEvent("__message", data);
    return this.dispatchEvent(event);
  }

  /** Dispatch a server sent event to the client.  The event `type` will be
   * sent as `event: ` to the client which will be raised as a `MessageEvent`
   * on the `EventSource` in the client.
   * 
   * Any local event handlers will be dispatched to first, and if the event
   * is cancelled, it will not be sent to the client.
   * 
   * ```ts
   * import { Application, ServerSentEvent } from "https://deno.land/x/oak/mod.ts";
   * 
   * const app = new Application();
   * 
   * app.use((ctx) => {
   *    const sse = ctx.getSSETarget();
   *    const evt = new ServerSentEvent("ping", "hello");
   *    sse.dispatchEvent(evt);
   * });
   * 
   * await app.listen();
   * ```
   */
  dispatchEvent(event: ServerSentEvent): boolean;
  dispatchEvent(event: CloseEvent | ErrorEvent): boolean;
  dispatchEvent(event: ServerSentEvent | CloseEvent | ErrorEvent): boolean {
    const dispatched = super.dispatchEvent(event);
    if (dispatched && event instanceof ServerSentEvent) {
      this.#prev = this.#send(String(event), this.#prev);
    }
    return dispatched;
  }
}
