"use strict";
let getFoo;
let getFoo2
class Foo {
    static #foo = 42;
    static #_ = getFoo2 = this.#foo
    static {
        getFoo = () => this.#foo;
    }
}
expect(getFoo()).toBe(42);
expect(getFoo2()).toBe(42);