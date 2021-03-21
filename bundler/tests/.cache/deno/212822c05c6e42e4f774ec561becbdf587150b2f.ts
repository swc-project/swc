// Loaded from https://deno.land/x/abc@v1.2.4/router.ts


import type { HandlerFunc } from "./types.ts";
import type { Context } from "./context.ts";

import { Node } from "./vendor/https/deno.land/x/router/mod.ts";
import { hasTrailingSlash, NotFoundHandler } from "./util.ts";

export class Router {
  trees: Record<string, Node> = {};

  add(method: string, path: string, h: HandlerFunc): void {
    if (path[0] !== "/") {
      path = `/${path}`;
    }

    if (hasTrailingSlash(path)) {
      path = path.slice(0, path.length - 1);
    }

    let root = this.trees[method];
    if (!root) {
      root = new Node();
      this.trees[method] = root;
    }

    root.add(path, h);
  }

  find(method: string, c: Context): HandlerFunc {
    const node = this.trees[method];
    let path = c.path;
    if (hasTrailingSlash(path)) {
      path = path.slice(0, path.length - 1);
    }
    let h: HandlerFunc | undefined;
    if (node) {
      const [handle, params] = node.find(path);
      if (params) {
        for (const [k, v] of params) {
          c.params[k] = v;
        }
      }

      if (handle) {
        h = handle as HandlerFunc;
      }
    }

    return h ?? NotFoundHandler;
  }
}
