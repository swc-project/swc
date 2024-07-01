(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function (x) { fn.call(this, x + 1); };
        return bar;
    };
    let set$foo;
    class Foo {
        static bar = 123;
        @dec
        static set #foo(x) { this.bar = x; }
        static { set$foo = (x, y) => { x.#foo = y; }; }
    }
    assertEq(() => set$foo(Foo, 321), undefined);
    assertEq(() => Foo.bar, 322);
})();
