import type { Foo } from "./foo.ts";

function _bar(...Foo: Foo) {
    console.log(Foo);
}

function _bar2(Foo: Foo, other = Foo) {
    Foo;
}
