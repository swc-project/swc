(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function () { return fn.call(this) + 1; };
        return bar;
    };
    let $foo;
    class Foo {
        static bar = 123;
        @dec
        static #foo() { return this.bar; }
        static { $foo = this.#foo; }
    }
    assertEq(() => $foo, bar);
    assertEq(() => bar.call(Foo), 124);
})();
