(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function () { return fn.call(this) + 1; };
        return bar;
    };
    class Foo {
        bar = 123;
        @dec
        foo() { return this.bar; }
    }
    assertEq(() => Foo.prototype.foo, bar);
    assertEq(() => new Foo().foo(), 124);
})();
