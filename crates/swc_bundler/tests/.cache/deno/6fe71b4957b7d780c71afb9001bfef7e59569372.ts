// Loaded from https://deno.land/x/router@v2.0.0/mod.ts


export class Node {
  children = new Map<string, Node>();
  path = "";
  func: Function | undefined;

  constructor(node?: Partial<Node>) {
    if (node) {
      Object.assign(this, node);
    }
  }

  add(path: string, func: Function): void {
    let n: Node = this;

    let i = 0;
    for (; i < path.length && !isWildcard(path[i]); ++i);
    n = n.#merge(path.slice(0, i));

    let j = i;
    for (; i < path.length; ++i) {
      if (isWildcard(path[i])) {
        if (j !== i) {
          // insert static route
          n = n.#insert(path.slice(j, i));
          j = i;
        }

        ++i;

        for (; i < path.length && path[i] !== "/"; ++i) {
          if (isWildcard(path[i])) {
            throw new Error(
              `only one wildcard per path segment is allowed, has: "${
                path.slice(
                  j,
                  i,
                )
              }" in path "${path}"`,
            );
          }
        }
        if (path[j] === ":" && i - j === 1) {
          throw new Error(
            `param must be named with a non-empty name in path "${path}"`,
          );
        }
        // insert wildcard route
        n = n.#insert(path.slice(j, i));
        j = i;
      }
    }

    if (j === path.length) {
      n.#merge("", func);
    } else {
      n.#insert(path.slice(j), func);
    }
  }

  find(
    path: string,
  ): [func: Function | undefined, params: Map<string, string>] {
    let func: Function | undefined;
    let params = new Map<string, string>();

    const stack: [node: Node, path: string, vis: boolean][] = [
      [this, path, false],
    ];

    for (let i = 0; i >= 0;) {
      const [n, p, v] = stack[i];

      let np: string | undefined; // next path

      if (v) {
        --i;
        // assert not "*"
        if (n.path[0] === ":") {
          params.delete(n.path.slice(1));
        }
        continue;
      } else {
        // vis = true
        stack[i][2] = true;
      }

      if (n.path[0] === "*") {
        if (n.path.length > 1) {
          params.set(n.path.slice(1), p);
        }
        np = undefined;
      } else if (n.path[0] === ":") {
        const [_cp, _np] = splitFromFirstSlash(p);
        params.set(n.path.slice(1), _cp);
        np = _np === "" ? undefined : _np;
      } else if (n.path === p) {
        if (n.func === undefined) {
          if (n.children.has("*")) {
            np = "";
          } else {
            --i;
            continue;
          }
        } else {
          np = undefined;
        }
      } else {
        const lcp = longestCommonPrefix(n.path, p);
        if (lcp !== n.path.length) {
          --i;
          continue;
        } else {
          np = p.slice(lcp);
        }
      }

      if (np === undefined) {
        func = n.func;
        break;
      }

      let c = n.children.get("*");
      if (c) {
        stack[++i] = [c, np, false];
      }

      if (np === "") {
        continue;
      }

      c = n.children.get(":");
      if (c) {
        stack[++i] = [c, np, false];
      }

      c = n.children.get(np[0]);
      if (c) {
        stack[++i] = [c, np, false];
      }
    }

    return [func, params];
  }

  #merge = (path: string, func?: Function): Node => {
    let n: Node = this;

    if (n.path === "" && n.children.size === 0) {
      n.path = path;
      n.func = func;

      return n;
    }

    if (path === "") {
      if (n.func) {
        throw new Error(
          `a function is already registered for path "${n.path}"`,
        );
      }
      n.func = func;

      return n;
    }

    for (;;) {
      const i = longestCommonPrefix(path, n.path);

      if (i < n.path.length) {
        const c = new Node({
          path: n.path.slice(i),
          children: n.children,
          func: n.func,
        });

        n.children = new Map([[c.path[0], c]]);
        n.path = path.slice(0, i);
        n.func = undefined;
      }

      if (i < path.length) {
        path = path.slice(i);
        let c = n.children.get(path[0]);

        if (c) {
          n = c;
          continue;
        }

        c = new Node({ path, func });
        n.children.set(path[0], c);
        n = c;
      } else if (func) {
        if (n.func) {
          throw new Error(
            `a function is already registered for path "${path}"`,
          );
        }
        n.func = func;
      }

      break;
    }

    return n;
  };

  #insert = (path: string, func?: Function): Node => {
    let n: Node = this;

    let c = n.children.get(path[0]);

    if (c) {
      n = c.#merge(path, func);
    } else {
      c = new Node({ path, func });
      n.children.set(path[0], c);
      n = c;
    }

    return n;
  };
}

function longestCommonPrefix(a: string, b: string): number {
  let i = 0;
  let len = Math.min(a.length, b.length);
  for (; i < len && a[i] === b[i]; ++i);

  return i;
}

function splitFromFirstSlash(
  path: string,
): [cp: string, np: string] {
  let i = 0;
  for (; i < path.length && path[i] !== "/"; ++i);
  return [path.slice(0, i), path.slice(i)];
}

function isWildcard(c: string): boolean {
  assert(c.length === 1);

  return c === ":" || c === "*";
}

function assert(expr: unknown, msg = ""): asserts expr {
  if (!expr) {
    throw new AssertionError(msg);
  }
}

class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}
