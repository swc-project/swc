(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function () { return fn.call(this) + 1; };
        return bar;
    };
    let get$foo;
    class Foo {
        #bar = 123;
        @dec
        get #foo() { return this.#bar; }
        static { get$foo = x => x.#foo; }
    }
    assertEq(() => get$foo(new Foo), 124);
})();
