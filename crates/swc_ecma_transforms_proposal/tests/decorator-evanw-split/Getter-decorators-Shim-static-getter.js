(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function () { return fn.call(this) + 1; };
        return bar;
    };
    class Foo {
        static bar = 123;
        @dec
        static get foo() { return this.bar; }
    }
    assertEq(() => Object.getOwnPropertyDescriptor(Foo, 'foo').get, bar);
    assertEq(() => Foo.foo, 124);
})();
