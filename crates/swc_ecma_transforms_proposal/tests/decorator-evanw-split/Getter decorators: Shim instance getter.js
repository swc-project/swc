(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function () { return fn.call(this) + 1; };
        return bar;
    };
    class Foo {
        bar = 123;
        @dec
        get foo() { return this.bar; }
    }
    assertEq(() => Object.getOwnPropertyDescriptor(Foo.prototype, 'foo').get, bar);
    assertEq(() => new Foo().foo, 124);
})();
