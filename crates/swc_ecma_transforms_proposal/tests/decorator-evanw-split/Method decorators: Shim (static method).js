(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function () { return fn.call(this) + 1; };
        return bar;
    };
    class Foo {
        static bar = 123;
        @dec
        static foo() { return this.bar; }
    }
    assertEq(() => Foo.foo, bar);
    assertEq(() => Foo.foo(), 124);
})();
