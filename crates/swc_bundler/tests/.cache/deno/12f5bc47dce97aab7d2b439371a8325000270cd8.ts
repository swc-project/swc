// Loaded from https://deno.land/x/oak@v6.3.1/application.ts


// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.

import { Context } from "./context.ts";
import {
  serve as defaultServe,
  serveTLS as defaultServeTls,
  Status,
  STATUS_TEXT,
} from "./deps.ts";
import { Key, KeyStack } from "./keyStack.ts";
import { compose, Middleware } from "./middleware.ts";
import type {
  Serve,
  Server,
  ServerRequest,
  ServerResponse,
  ServeTls,
} from "./types.d.ts";

export interface ListenOptionsBase {
  hostname?: string;
  port: number;
  secure?: false;
  signal?: AbortSignal;
}

export interface ListenOptionsTls {
  certFile: string;
  hostname?: string;
  keyFile: string;
  port: number;
  secure: true;
  signal?: AbortSignal;
}

export type ListenOptions = ListenOptionsTls | ListenOptionsBase;

function isOptionsTls(options: ListenOptions): options is ListenOptionsTls {
  return options.secure === true;
}

interface ApplicationErrorEventListener<S> {
  (evt: ApplicationErrorEvent<S>): void | Promise<void>;
}

interface ApplicationErrorEventListenerObject<S> {
  handleEvent(evt: ApplicationErrorEvent<S>): void | Promise<void>;
}

interface ApplicationErrorEventInit<S extends State> extends ErrorEventInit {
  context?: Context<S>;
}

type ApplicationErrorEventListenerOrEventListenerObject<S> =
  | ApplicationErrorEventListener<S>
  | ApplicationErrorEventListenerObject<S>;

interface ApplicationListenEventListener {
  (evt: ApplicationListenEvent): void | Promise<void>;
}

interface ApplicationListenEventListenerObject {
  handleEvent(evt: ApplicationListenEvent): void | Promise<void>;
}

interface ApplicationListenEventInit extends EventInit {
  hostname?: string;
  port: number;
  secure: boolean;
}

type ApplicationListenEventListenerOrEventListenerObject =
  | ApplicationListenEventListener
  | ApplicationListenEventListenerObject;

export interface ApplicationOptions<S> {
  /** An initial set of keys (or instance of `KeyGrip`) to be used for signing
   * cookies produced by the application. */
  keys?: KeyStack | Key[];

  /** If set to `true`, proxy headers will be trusted when processing requests.
   * This defaults to `false`. */
  proxy?: boolean;

  /** The `server()` function to be used to read requests.
   * 
   * _Not used generally, as this is just for mocking for test purposes_ */
  serve?: Serve;

  /** The `server()` function to be used to read requests.
   * 
   * _Not used generally, as this is just for mocking for test purposes_ */
  serveTls?: ServeTls;

  /** The initial state object for the application, of which the type can be
   * used to infer the type of the state for both the application and any of the
   * application's context. */
  state?: S;
}

interface RequestState {
  handling: Set<Promise<void>>;
  closing: boolean;
  closed: boolean;
  server: Server;
}

// deno-lint-ignore no-explicit-any
export type State = Record<string | number | symbol, any>;

const ADDR_REGEXP = /^\[?([^\]]*)\]?:([0-9]{1,5})$/;

export class ApplicationErrorEvent<S extends State> extends ErrorEvent {
  context?: Context<S>;

  constructor(eventInitDict: ApplicationErrorEventInit<S>) {
    super("error", eventInitDict);
    this.context = eventInitDict.context;
  }
}

export class ApplicationListenEvent extends Event {
  hostname?: string;
  port: number;
  secure: boolean;

  constructor(eventInitDict: ApplicationListenEventInit) {
    super("listen", eventInitDict);
    this.hostname = eventInitDict.hostname;
    this.port = eventInitDict.port;
    this.secure = eventInitDict.secure;
  }
}

/** A class which registers middleware (via `.use()`) and then processes
 * inbound requests against that middleware (via `.listen()`).
 *
 * The `context.state` can be typed via passing a generic argument when
 * constructing an instance of `Application`.
 */
// deno-lint-ignore no-explicit-any
export class Application<AS extends State = Record<string, any>>
  extends EventTarget {
  #composedMiddleware?: (context: Context<AS>) => Promise<void>;
  #keys?: KeyStack;
  #middleware: Middleware<State, Context<State>>[] = [];
  #serve: Serve;
  #serveTls: ServeTls;

  /** A set of keys, or an instance of `KeyStack` which will be used to sign
   * cookies read and set by the application to avoid tampering with the
   * cookies. */
  get keys(): KeyStack | Key[] | undefined {
    return this.#keys;
  }

  set keys(keys: KeyStack | Key[] | undefined) {
    if (!keys) {
      this.#keys = undefined;
      return;
    } else if (Array.isArray(keys)) {
      this.#keys = new KeyStack(keys);
    } else {
      this.#keys = keys;
    }
  }

  /** If `true`, proxy headers will be trusted when processing requests.  This
   * defaults to `false`. */
  proxy: boolean;

  /** Generic state of the application, which can be specified by passing the
   * generic argument when constructing:
   *
   *       const app = new Application<{ foo: string }>();
   * 
   * Or can be contextually inferred based on setting an initial state object:
   * 
   *       const app = new Application({ state: { foo: "bar" } });
   * 
   */
  state: AS;

  constructor(options: ApplicationOptions<AS> = {}) {
    super();
    const {
      state,
      keys,
      proxy,
      serve = defaultServe,
      serveTls = defaultServeTls,
    } = options;

    this.proxy = proxy ?? false;
    this.keys = keys;
    this.state = state ?? {} as AS;
    this.#serve = serve;
    this.#serveTls = serveTls;
  }

  #getComposed = (): ((context: Context<AS>) => Promise<void>) => {
    if (!this.#composedMiddleware) {
      this.#composedMiddleware = compose(this.#middleware);
    }
    return this.#composedMiddleware;
  };

  /** Deal with uncaught errors in either the middleware or sending the
   * response. */
  // deno-lint-ignore no-explicit-any
  #handleError = (context: Context<AS>, error: any): void => {
    if (!(error instanceof Error)) {
      error = new Error(`non-error thrown: ${JSON.stringify(error)}`);
    }
    const { message } = error;
    this.dispatchEvent(new ApplicationErrorEvent({ context, message, error }));
    if (!context.response.writable) {
      return;
    }
    for (const key of context.response.headers.keys()) {
      context.response.headers.delete(key);
    }
    if (error.headers && error.headers instanceof Headers) {
      for (const [key, value] of error.headers) {
        context.response.headers.set(key, value);
      }
    }
    context.response.type = "text";
    const status: Status = context.response.status =
      error instanceof Deno.errors.NotFound
        ? 404
        : error.status && typeof error.status === "number"
        ? error.status
        : 500;
    context.response.body = error.expose
      ? error.message
      : STATUS_TEXT.get(status);
  };

  /** Processing registered middleware on each request. */
  #handleRequest = async (
    request: ServerRequest,
    secure: boolean,
    state: RequestState,
  ): Promise<void> => {
    const context = new Context(this, request, secure);
    let resolve: () => void;
    const handlingPromise = new Promise<void>((res) => resolve = res);
    state.handling.add(handlingPromise);
    if (!state.closing && !state.closed) {
      try {
        await this.#getComposed()(context);
      } catch (err) {
        this.#handleError(context, err);
      }
    }
    if (context.respond === false) {
      context.response.destroy();
      resolve!();
      state.handling.delete(handlingPromise);
      return;
    }
    try {
      await request.respond(await context.response.toServerResponse());
      if (state.closing) {
        state.server.close();
        state.closed = true;
      }
    } catch (err) {
      this.#handleError(context, err);
    } finally {
      context.response.destroy();
      resolve!();
      state.handling.delete(handlingPromise);
    }
  };

  /** Add an event listener for an `"error"` event which occurs when an
   * un-caught error occurs when processing the middleware or during processing
   * of the response. */
  addEventListener(
    type: "error",
    listener: ApplicationErrorEventListenerOrEventListenerObject<AS> | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  /** Add an event listener for a `"listen"` event which occurs when the server
   * has successfully opened but before any requests start being processed. */
  addEventListener(
    type: "listen",
    listener: ApplicationListenEventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  /** Add an event listener for an event.  Currently valid event types are
   * `"error"` and `"listen"`. */
  addEventListener(
    type: "error" | "listen",
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, listener, options);
  }

  /** Handle an individual server request, returning the server response.  This
   * is similar to `.listen()`, but opening the connection and retrieving
   * requests are not the responsibility of the application.  If the generated
   * context gets set to not to respond, then the method resolves with
   * `undefined`, otherwise it resolves with a request that is compatible with
   * `std/http/server`. */
  handle = async (
    request: ServerRequest,
    secure = false,
  ): Promise<ServerResponse | undefined> => {
    if (!this.#middleware.length) {
      throw new TypeError("There is no middleware to process requests.");
    }
    const context = new Context(this, request, secure);
    try {
      await this.#getComposed()(context);
    } catch (err) {
      this.#handleError(context, err);
    }
    if (context.respond === false) {
      context.response.destroy();
      return;
    }
    try {
      const response = await context.response.toServerResponse();
      context.response.destroy();
      return response;
    } catch (err) {
      this.#handleError(context, err);
      throw err;
    }
  };

  /** Start listening for requests, processing registered middleware on each
   * request.  If the options `.secure` is undefined or `false`, the listening
   * will be over HTTP.  If the options `.secure` property is `true`, a
   * `.certFile` and a `.keyFile` property need to be supplied and requests
   * will be processed over HTTPS. */
  async listen(addr: string): Promise<void>;
  /** Start listening for requests, processing registered middleware on each
   * request.  If the options `.secure` is undefined or `false`, the listening
   * will be over HTTP.  If the options `.secure` property is `true`, a
   * `.certFile` and a `.keyFile` property need to be supplied and requests
   * will be processed over HTTPS. */
  async listen(options: ListenOptions): Promise<void>;
  async listen(options: string | ListenOptions): Promise<void> {
    if (!this.#middleware.length) {
      throw new TypeError("There is no middleware to process requests.");
    }
    if (typeof options === "string") {
      const match = ADDR_REGEXP.exec(options);
      if (!match) {
        throw TypeError(`Invalid address passed: "${options}"`);
      }
      const [, hostname, portStr] = match;
      options = { hostname, port: parseInt(portStr, 10) };
    }
    const server = isOptionsTls(options)
      ? this.#serveTls(options)
      : this.#serve(options);
    const { signal } = options;
    const state = {
      closed: false,
      closing: false,
      handling: new Set<Promise<void>>(),
      server,
    };
    if (signal) {
      signal.addEventListener("abort", () => {
        if (!state.handling.size) {
          server.close();
          state.closed = true;
        }
        state.closing = true;
      });
    }
    const { hostname, port, secure = false } = options;
    this.dispatchEvent(
      new ApplicationListenEvent({ hostname, port, secure }),
    );
    try {
      for await (const request of server) {
        this.#handleRequest(request, secure, state);
      }
      await Promise.all(state.handling);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Application Error";
      this.dispatchEvent(
        new ApplicationErrorEvent({ message, error }),
      );
    }
  }

  /** Register middleware to be used with the application.  Middleware will
   * be processed in the order it is added, but middleware can control the flow
   * of execution via the use of the `next()` function that the middleware
   * function will be called with.  The `context` object provides information
   * about the current state of the application.
   * 
   * Basic usage:
   * 
   * ```ts
   * const import { Application } from "https://deno.land/x/oak/mod.ts";
   * 
   * const app = new Application();
   * 
   * app.use((ctx, next) => {
   *   ctx.request; // contains request information
   *   ctx.response; // setups up information to use in the response;
   *   await next(); // manages the flow control of the middleware execution
   * });
   * 
   * await app.listen({ port: 80 });
   * ```
   */
  use<S extends State = AS>(
    ...middleware: Middleware<S, Context<S>>[]
  ): Application<S extends AS ? S : (S & AS)> {
    this.#middleware.push(...middleware);
    this.#composedMiddleware = undefined;
    // deno-lint-ignore no-explicit-any
    return this as Application<any>;
  }
}
