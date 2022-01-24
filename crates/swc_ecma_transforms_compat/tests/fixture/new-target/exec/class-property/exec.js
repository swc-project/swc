"use strict";

class Foo {
    bar = new.target;
    ["baz"] = new.target;
}

const foo = new Foo();

expect(foo.bar).toBe(undefined);
expect(foo.baz).toBe(undefined);
