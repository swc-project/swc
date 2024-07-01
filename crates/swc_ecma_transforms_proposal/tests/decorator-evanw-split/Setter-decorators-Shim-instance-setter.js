(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function (x) { fn.call(this, x + 1); };
        return bar;
    };
    class Foo {
        bar = 123;
        @dec
        set foo(x) { this.bar = x; }
    }
    assertEq(() => Object.getOwnPropertyDescriptor(Foo.prototype, 'foo').set, bar);
    var obj = new Foo;
    obj.foo = 321;
    assertEq(() => obj.bar, 322);
})();
