// Loaded from https://deno.land/x/abc@v1.2.4/group.ts


import type { HandlerFunc, MiddlewareFunc } from "./types.ts";
import type { Application } from "./app.ts";

import { join } from "./vendor/https/deno.land/std/path/mod.ts";
import { NotFoundHandler } from "./util.ts";

export class Group {
  prefix: string;
  middleware: MiddlewareFunc[];
  app: Application;

  constructor(opts: { app: Application; prefix: string }) {
    this.prefix = opts.prefix || "";
    this.app = opts.app || ({} as Application);

    this.middleware = [];
  }

  use(...m: MiddlewareFunc[]): Group {
    this.middleware.push(...m);
    if (this.middleware.length !== 0) {
      this.any("", NotFoundHandler);
    }
    return this;
  }

  connect(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("CONNECT", path, h, ...m);
  }
  delete(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("DELETE", path, h, ...m);
  }
  get(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("GET", path, h, ...m);
  }
  head(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("HEAD", path, h, ...m);
  }
  options(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("OPTIONS", path, h, ...m);
  }
  patch(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("PATCH", path, h, ...m);
  }
  post(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("POST", path, h, ...m);
  }
  put(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("PUT", path, h, ...m);
  }
  trace(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    return this.add("TRACE", path, h, ...m);
  }
  any(path: string, h: HandlerFunc, ...m: MiddlewareFunc[]): Group {
    const methods = [
      "CONNECT",
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
      "TRACE",
    ];
    for (const method of methods) {
      this.add(method, path, h, ...m);
    }
    return this;
  }
  match(
    methods: string[],
    path: string,
    h: HandlerFunc,
    ...m: MiddlewareFunc[]
  ): Group {
    for (const method of methods) {
      this.add(method, path, h, ...m);
    }
    return this;
  }
  add(
    method: string,
    path: string,
    handler: HandlerFunc,
    ...middleware: MiddlewareFunc[]
  ): Group {
    this.app.add(
      method,
      this.prefix + path,
      handler,
      ...this.middleware,
      ...middleware,
    );
    return this;
  }

  static(prefix: string, root: string): Group {
    this.app.static(join(this.prefix, prefix), root);
    return this;
  }

  file(p: string, filepath: string, ...m: MiddlewareFunc[]): Group {
    this.app.file(join(this.prefix, p), filepath, ...m);
    return this;
  }

  group(prefix: string, ...m: MiddlewareFunc[]): Group {
    const g = this.app.group(this.prefix + prefix, ...this.middleware, ...m);
    return g;
  }
}
