import foo, { bar as baz } from "pkg";
import * as ns from "pkg2" with { type: "json" };
import "side-effect";

export { foo as defaultFoo, baz } from "pkg";
export * as everything from "pkg2";

export default class Runner {
  run() {
    return foo(baz) + ns.extra;
  }
}

export const answer = 42;
