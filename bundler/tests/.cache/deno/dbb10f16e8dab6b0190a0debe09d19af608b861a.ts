// Loaded from https://deno.land/x/oak/router.ts


/**
 * Adapted directly from @koa/router at
 * https://github.com/koajs/router/ which is licensed as:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Alexander C. Mingoia
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import type { State } from "./application.ts";
import type { Context } from "./context.ts";
import {
  assert,
  compile,
  Key,
  ParseOptions,
  pathParse,
  pathToRegexp,
  Status,
  TokensToRegexpOptions,
} from "./deps.ts";
import { httpErrors } from "./httpError.ts";
import { compose, Middleware } from "./middleware.ts";
import type { HTTPMethods, RedirectStatus } from "./types.d.ts";
import { decodeComponent } from "./util.ts";

interface Matches {
  path: Layer[];
  pathAndMethod: Layer[];
  route: boolean;
}

export interface RouterAllowedMethodsOptions {
  /** Use the value returned from this function instead of an HTTP error
   * `MethodNotAllowed`. */
  // deno-lint-ignore no-explicit-any
  methodNotAllowed?(): any;

  /** Use the value returned from this function instead of an HTTP error
   * `NotImplemented`. */
  // deno-lint-ignore no-explicit-any
  notImplemented?(): any;

  /** When dealing with a non-implemented method or a method not allowed, throw
   * an error instead of setting the status and header for the response. */
  throw?: boolean;
}

export interface Route<
  P extends RouteParams = RouteParams,
  // deno-lint-ignore no-explicit-any
  S extends State = Record<string, any>,
> {
  /** The HTTP methods that this route handles. */
  methods: HTTPMethods[];

  /** The middleware that will be applied to this route. */
  middleware: RouterMiddleware<P, S>[];

  /** An optional name for the route. */
  name?: string;

  /** Options that were used to create the route. */
  options: LayerOptions;

  /** The parameters that are identified in the route that will be parsed out
   * on matched requests. */
  paramNames: (keyof P)[];

  /** The path that this route manages. */
  path: string;

  /** The regular expression used for matching and parsing parameters for the
   * route. */
  regexp: RegExp;
}

/** The context passed router middleware.  */
export interface RouterContext<
  P extends RouteParams = RouteParams,
  // deno-lint-ignore no-explicit-any
  S extends State = Record<string, any>,
> extends Context<S> {
  /** When matching the route, an array of the capturing groups from the regular
   * expression. */
  captures: string[];

  /** The routes that were matched for this request. */
  matched?: Layer<P, S>[];

  /** Any parameters parsed from the route when matched. */
  params: P;

  /** A reference to the router instance. */
  router: Router;

  /** If the matched route has a `name`, the matched route name is provided
   * here. */
  routeName?: string;

  /** Overrides the matched path for future route middleware, when a
   * `routerPath` option is not defined on the `Router` options. */
  routerPath?: string;
}

export interface RouterMiddleware<
  P extends RouteParams = RouteParams,
  // deno-lint-ignore no-explicit-any
  S extends State = Record<string, any>,
> {
  (context: RouterContext<P, S>, next: () => Promise<void>):
    | Promise<void>
    | void;
  /** For route parameter middleware, the `param` key for this parameter will
   * be set. */
  param?: keyof P;
}

export interface RouterOptions {
  /** Override the default set of methods supported by the router. */
  methods?: HTTPMethods[];

  /** Only handle routes where the requested path starts with the prefix. */
  prefix?: string;

  /** Override the `request.url.pathname` when matching middleware to run. */
  routerPath?: string;

  /** Determines if routes are matched in a case sensitive way.  Defaults to
   * `false`. */
  sensitive?: boolean;

  /** Determines if routes are matched strictly, where the trailing `/` is not
   * optional.  Defaults to `false`. */
  strict?: boolean;
}

/** Middleware that will be called by the router when handling a specific
 * parameter, which the middleware will be called when a request matches the
 * route parameter. */
export interface RouterParamMiddleware<
  P extends RouteParams = RouteParams,
  // deno-lint-ignore no-explicit-any
  S extends State = Record<string, any>,
> {
  (
    param: string,
    context: RouterContext<P, S>,
    next: () => Promise<void>,
  ): Promise<void> | void;
}

export type RouteParams = Record<string | number, string | undefined>;

type LayerOptions = TokensToRegexpOptions & ParseOptions & {
  ignoreCaptures?: boolean;
  name?: string;
};

type UrlOptions = TokensToRegexpOptions & ParseOptions & {
  /** When generating a URL from a route, add the query to the URL.  If an
   * object */
  query?: URLSearchParams | Record<string, string> | string;
};

/** Generate a URL from a string, potentially replace route params with
 * values. */
function toUrl(url: string, params: RouteParams = {}, options?: UrlOptions) {
  const tokens = pathParse(url);
  let replace: RouteParams = {};

  if (tokens.some((token) => typeof token === "object")) {
    replace = params;
  } else {
    options = params;
  }

  const toPath = compile(url, options);
  const replaced = toPath(replace);

  if (options && options.query) {
    const url = new URL(replaced, "http://oak");
    if (typeof options.query === "string") {
      url.search = options.query;
    } else {
      url.search = String(
        options.query instanceof URLSearchParams
          ? options.query
          : new URLSearchParams(options.query),
      );
    }
    return `${url.pathname}${url.search}${url.hash}`;
  }
  return replaced;
}

class Layer<
  P extends RouteParams = RouteParams,
  // deno-lint-ignore no-explicit-any
  S extends State = Record<string, any>,
> {
  #opts: LayerOptions;
  #paramNames: Key[] = [];
  #regexp: RegExp;

  methods: HTTPMethods[];
  name?: string;
  path: string;
  stack: RouterMiddleware<P, S>[];

  constructor(
    path: string,
    methods: HTTPMethods[],
    middleware: RouterMiddleware<P, S> | RouterMiddleware<P, S>[],
    { name, ...opts }: LayerOptions = {},
  ) {
    this.#opts = opts;
    this.name = name;
    this.methods = [...methods];
    if (this.methods.includes("GET")) {
      this.methods.unshift("HEAD");
    }
    this.stack = Array.isArray(middleware) ? middleware : [middleware];
    this.path = path;
    this.#regexp = pathToRegexp(path, this.#paramNames, this.#opts);
  }

  match(path: string): boolean {
    return this.#regexp.test(path);
  }

  params(
    captures: string[],
    existingParams: RouteParams = {},
  ): RouteParams {
    const params = existingParams;
    for (let i = 0; i < captures.length; i++) {
      if (this.#paramNames[i]) {
        const c = captures[i];
        params[this.#paramNames[i].name] = c ? decodeComponent(c) : c;
      }
    }
    return params;
  }

  captures(path: string): string[] {
    if (this.#opts.ignoreCaptures) {
      return [];
    }
    return path.match(this.#regexp)?.slice(1) ?? [];
  }

  url(
    params: RouteParams = {},
    options?: UrlOptions,
  ): string {
    const url = this.path.replace(/\(\.\*\)/g, "");
    return toUrl(url, params, options);
  }

  param(
    param: string,
    // deno-lint-ignore no-explicit-any
    fn: RouterParamMiddleware<any, any>,
  ) {
    const stack = this.stack;
    const params = this.#paramNames;
    const middleware: RouterMiddleware = function (
      this: Router,
      ctx,
      next,
    ): Promise<void> | void {
      const p = ctx.params[param];
      assert(p);
      return fn.call(this, p, ctx, next);
    };
    middleware.param = param;

    const names = params.map((p) => p.name);

    const x = names.indexOf(param);
    if (x >= 0) {
      for (let i = 0; i < stack.length; i++) {
        const fn = stack[i];
        if (!fn.param || names.indexOf(fn.param as (string | number)) > x) {
          stack.splice(i, 0, middleware);
          break;
        }
      }
    }
    return this;
  }

  setPrefix(prefix: string): this {
    if (this.path) {
      this.path = this.path !== "/" || this.#opts.strict === true
        ? `${prefix}${this.path}`
        : prefix;
      this.#paramNames = [];
      this.#regexp = pathToRegexp(this.path, this.#paramNames, this.#opts);
    }
    return this;
  }

  // deno-lint-ignore no-explicit-any
  toJSON(): Route<any, any> {
    return {
      methods: [...this.methods],
      middleware: [...this.stack],
      paramNames: this.#paramNames.map((key) => key.name),
      path: this.path,
      regexp: this.#regexp,
      options: { ...this.#opts },
    };
  }
}

/** An interface for registering middleware that will run when certain HTTP
 * methods and paths are requested, as well as provides a way to parameterize
 * parts of the requested path. */
export class Router<
  RP extends RouteParams = RouteParams,
  // deno-lint-ignore no-explicit-any
  RS extends State = Record<string, any>,
> {
  #opts: RouterOptions;
  #methods: HTTPMethods[];
  // deno-lint-ignore no-explicit-any
  #params: Record<string, RouterParamMiddleware<any, any>> = {};
  #stack: Layer[] = [];

  #match = (path: string, method: HTTPMethods): Matches => {
    const matches: Matches = {
      path: [],
      pathAndMethod: [],
      route: false,
    };

    for (const route of this.#stack) {
      if (route.match(path)) {
        matches.path.push(route);
        if (route.methods.length === 0 || route.methods.includes(method)) {
          matches.pathAndMethod.push(route);
          if (route.methods.length) {
            matches.route = true;
          }
        }
      }
    }

    return matches;
  };

  #register = (
    path: string | string[],
    middleware: RouterMiddleware[],
    methods: HTTPMethods[],
    options: LayerOptions = {},
  ): void => {
    if (Array.isArray(path)) {
      for (const p of path) {
        this.#register(p, middleware, methods, options);
      }
      return;
    }

    const { end, name, sensitive, strict, ignoreCaptures } = options;
    const route = new Layer(path, methods, middleware, {
      end: end === false ? end : true,
      name,
      sensitive: sensitive ?? this.#opts.sensitive ?? false,
      strict: strict ?? this.#opts.strict ?? false,
      ignoreCaptures,
    });

    if (this.#opts.prefix) {
      route.setPrefix(this.#opts.prefix);
    }

    for (const [param, mw] of Object.entries(this.#params)) {
      route.param(param, mw);
    }

    this.#stack.push(route);
  };

  #route = (name: string): Layer | undefined => {
    for (const route of this.#stack) {
      if (route.name === name) {
        return route;
      }
    }
  };

  #useVerb = (
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware,
    middleware: RouterMiddleware[],
    methods: HTTPMethods[],
  ): void => {
    let name: string | undefined = undefined;
    let path: string;
    if (typeof pathOrMiddleware === "string") {
      name = nameOrPath;
      path = pathOrMiddleware;
    } else {
      path = nameOrPath;
      middleware.unshift(pathOrMiddleware);
    }

    this.#register(path, middleware, methods, { name });
  };

  constructor(opts: RouterOptions = {}) {
    this.#opts = opts;
    this.#methods = opts.methods ?? [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ];
  }

  /** Register named middleware for the specified routes when the `DELETE`,
   * `GET`, `POST`, or `PUT` method is requested. */
  all<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `DELETE`,
   * `GET`, `POST`, or `PUT` method is requested. */
  all<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  all<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["DELETE", "GET", "POST", "PUT"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Middleware that handles requests for HTTP methods registered with the
   * router.  If none of the routes handle a method, then "not allowed" logic
   * will be used.  If a method is supported by some routes, but not the
   * particular matched router, then "not implemented" will be returned.
   * 
   * The middleware will also automatically handle the `OPTIONS` method,
   * responding with a `200 OK` when the `Allowed` header sent to the allowed
   * methods for a given route.
   * 
   * By default, a "not allowed" request will respond with a `405 Not Allowed`
   * and a "not implemented" will respond with a `501 Not Implemented`. Setting
   * the option `.throw` to `true` will cause the middleware to throw an
   * `HTTPError` instead of setting the response status.  The error can be
   * overridden by providing a `.notImplemented` or `.notAllowed` method in the
   * options, of which the value will be returned will be thrown instead of the
   * HTTP error. */
  allowedMethods(
    options: RouterAllowedMethodsOptions = {},
  ): Middleware {
    const implemented = this.#methods;

    const allowedMethods: Middleware = async (context, next) => {
      const ctx = context as RouterContext;
      await next();
      if (!ctx.response.status || ctx.response.status === Status.NotFound) {
        assert(ctx.matched);
        const allowed = new Set<HTTPMethods>();
        for (const route of ctx.matched) {
          for (const method of route.methods) {
            allowed.add(method);
          }
        }

        const allowedStr = [...allowed].join(", ");
        if (!implemented.includes(ctx.request.method)) {
          if (options.throw) {
            throw options.notImplemented
              ? options.notImplemented()
              : new httpErrors.NotImplemented();
          } else {
            ctx.response.status = Status.NotImplemented;
            ctx.response.headers.set("Allowed", allowedStr);
          }
        } else if (allowed.size) {
          if (ctx.request.method === "OPTIONS") {
            ctx.response.status = Status.OK;
            ctx.response.headers.set("Allowed", allowedStr);
          } else if (!allowed.has(ctx.request.method)) {
            if (options.throw) {
              throw options.methodNotAllowed
                ? options.methodNotAllowed()
                : new httpErrors.MethodNotAllowed();
            } else {
              ctx.response.status = Status.MethodNotAllowed;
              ctx.response.headers.set("Allowed", allowedStr);
            }
          }
        }
      }
    };

    return allowedMethods;
  }

  /** Register named middleware for the specified routes when the `DELETE`,
   *  method is requested. */
  delete<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `DELETE`,
   * method is requested. */
  delete<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  delete<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["DELETE"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Iterate over the routes currently added to the router.  To be compatible
   * with the iterable interfaces, both the key and value are set to the value
   * of the route. */
  *entries(): IterableIterator<[Route, Route]> {
    for (const route of this.#stack) {
      const value = route.toJSON();
      yield [value, value];
    }
  }

  /** Iterate over the routes currently added to the router, calling the
   * `callback` function for each value. */
  forEach(
    callback: (value1: Route, value2: Route, router: this) => void,
    // deno-lint-ignore no-explicit-any
    thisArg: any = null,
  ): void {
    for (const route of this.#stack) {
      const value = route.toJSON();
      callback.call(thisArg, value, value, this);
    }
  }

  /** Register named middleware for the specified routes when the `GET`,
   *  method is requested. */
  get<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `GET`,
   * method is requested. */
  get<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  get<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["GET"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Register named middleware for the specified routes when the `HEAD`,
   *  method is requested. */
  head<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `HEAD`,
   * method is requested. */
  head<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  head<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["HEAD"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Iterate over the routes currently added to the router.  To be compatible
   * with the iterable interfaces, the key is set to the value of the route. */
  *keys(): IterableIterator<Route> {
    for (const route of this.#stack) {
      yield route.toJSON();
    }
  }

  /** Register named middleware for the specified routes when the `OPTIONS`,
   * method is requested. */
  options<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `OPTIONS`,
   * method is requested. */
  options<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  options<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["OPTIONS"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Register param middleware, which will be called when the particular param
   * is parsed from the route. */
  param<S extends State = RS>(
    param: keyof RP,
    middleware: RouterParamMiddleware<RP, S>,
  ): Router<RP, S> {
    this.#params[param as string] = middleware;
    for (const route of this.#stack) {
      route.param(param as string, middleware);
    }
    return this;
  }

  /** Register named middleware for the specified routes when the `PATCH`,
   * method is requested. */
  patch<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `PATCH`,
   * method is requested. */
  patch<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  patch<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["PATCH"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Register named middleware for the specified routes when the `POST`,
   * method is requested. */
  post<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `POST`,
   * method is requested. */
  post<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  post<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["POST"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Set the router prefix for this router. */
  prefix(prefix: string): this {
    prefix = prefix.replace(/\/$/, "");
    this.#opts.prefix = prefix;
    for (const route of this.#stack) {
      route.setPrefix(prefix);
    }
    return this;
  }

  /** Register named middleware for the specified routes when the `PUT`
   * method is requested. */
  put<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware for the specified routes when the `PUT`
   * method is requested. */
  put<P extends RouteParams = RP, S extends State = RS>(
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  put<P extends RouteParams = RP, S extends State = RS>(
    nameOrPath: string,
    pathOrMiddleware: string | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    this.#useVerb(
      nameOrPath,
      pathOrMiddleware as (string | RouterMiddleware),
      middleware as RouterMiddleware[],
      ["PUT"],
    );
    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Register a direction middleware, where when the `source` path is matched
   * the router will redirect the request to the `destination` path.  A `status`
   * of `302 Found` will be set by default.
   * 
   * The `source` and `destination` can be named routes. */
  redirect(
    source: string,
    destination: string,
    status: RedirectStatus = Status.Found,
  ): this {
    if (source[0] !== "/") {
      const s = this.url(source);
      if (!s) {
        throw new RangeError(`Could not resolve named route: "${source}"`);
      }
      source = s;
    }
    if (destination[0] !== "/") {
      const d = this.url(destination);
      if (!d) {
        throw new RangeError(`Could not resolve named route: "${source}"`);
      }
      destination = d;
    }

    this.all(source, (ctx) => {
      ctx.response.redirect(destination);
      ctx.response.status = status;
    });
    return this;
  }

  /** Return middleware that will do all the route processing that the router
   * has been configured to handle.  Typical usage would be something like this:
   * 
   * ```ts
   * import { Application, Router } from "https://deno.land/x/oak/mod.ts";
   * 
   * const app = new Application();
   * const router = new Router();
   * 
   * // register routes
   * 
   * app.use(router.routes());
   * app.use(router.allowedMethods());
   * await app.listen({ port: 80 });
   * ```
   */
  routes(): Middleware {
    const dispatch = (
      context: Context,
      next: () => Promise<void>,
    ): Promise<void> => {
      const ctx = context as RouterContext;
      let pathname: string;
      let method: HTTPMethods;
      try {
        const { url: { pathname: p }, method: m } = ctx.request;
        pathname = p;
        method = m;
      } catch (e) {
        return Promise.reject(e);
      }
      const path = this.#opts.routerPath ?? ctx.routerPath ??
        decodeURIComponent(pathname);
      const matches = this.#match(path, method);

      if (ctx.matched) {
        ctx.matched.push(...matches.path);
      } else {
        ctx.matched = [...matches.path];
      }

      // deno-lint-ignore no-explicit-any
      ctx.router = this as Router<any, any>;

      if (!matches.route) return next();

      const { pathAndMethod: matchedRoutes } = matches;

      const chain = matchedRoutes.reduce(
        (prev, route) => [
          ...prev,
          (ctx: RouterContext, next: () => Promise<void>): Promise<void> => {
            ctx.captures = route.captures(path);
            ctx.params = route.params(ctx.captures, ctx.params);
            ctx.routeName = route.name;
            return next();
          },
          ...route.stack,
        ],
        [] as RouterMiddleware[],
      );
      return compose(chain)(ctx, next);
    };
    dispatch.router = this;
    return dispatch;
  }

  /** Generate a URL pathname for a named route, interpolating the optional
   * params provided.  Also accepts an optional set of options. */
  url<P extends RouteParams = RP>(
    name: string,
    params?: P,
    options?: UrlOptions,
  ): string | undefined {
    const route = this.#route(name);

    if (route) {
      return route.url(params, options);
    }
  }

  /** Register middleware to be used on every matched route. */
  use<P extends RouteParams = RP, S extends State = RS>(
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  /** Register middleware to be used on every route that matches the supplied
   * `path`. */
  use<P extends RouteParams = RP, S extends State = RS>(
    path: string | string[],
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>;
  use<P extends RouteParams = RP, S extends State = RS>(
    pathOrMiddleware: string | string[] | RouterMiddleware<P, S>,
    ...middleware: RouterMiddleware<P, S>[]
  ): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)> {
    let path: string | string[] | undefined;
    if (
      typeof pathOrMiddleware === "string" || Array.isArray(pathOrMiddleware)
    ) {
      path = pathOrMiddleware;
    } else {
      middleware.unshift(pathOrMiddleware);
    }

    this.#register(
      path ?? "(.*)",
      middleware as RouterMiddleware[],
      [],
      { end: false, ignoreCaptures: !path },
    );

    // deno-lint-ignore no-explicit-any
    return this as Router<any, any>;
  }

  /** Iterate over the routes currently added to the router. */
  *values(): IterableIterator<Route<RP, RS>> {
    for (const route of this.#stack) {
      yield route.toJSON();
    }
  }

  /** Provide an iterator interface that iterates over the routes registered
   * with the router. */
  *[Symbol.iterator](): IterableIterator<Route<RP, RS>> {
    for (const route of this.#stack) {
      yield route.toJSON();
    }
  }

  /** Generate a URL pathname based on the provided path, interpolating the
   * optional params provided.  Also accepts an optional set of options. */
  static url(
    path: string,
    params?: RouteParams,
    options?: UrlOptions,
  ): string {
    return toUrl(path, params, options);
  }
}
