(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function (x) { fn.call(this, x + 1); };
        return bar;
    };
    class Foo {
        static bar = 123;
        @dec
        static set foo(x) { this.bar = x; }
    }
    assertEq(() => Object.getOwnPropertyDescriptor(Foo, 'foo').set, bar);
    Foo.foo = 321;
    assertEq(() => Foo.bar, 322);
})();
