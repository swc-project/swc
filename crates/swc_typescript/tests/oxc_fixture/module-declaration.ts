import "foo";
declare module "foo" {
  interface Foo {}
  const foo = 42;
}

declare global {
  interface Bar {}
  const bar = 42;
}

import { type X } from "./x";
type Y = 1;

declare module "foo" {
  interface Foo {
    x: X;
    y: Y;
  }
}

// should not be emitted
module baz {
  interface Baz {}
  const baz = 42;
}

declare module x {
  interface Qux {}
  const qux = 42;
}
