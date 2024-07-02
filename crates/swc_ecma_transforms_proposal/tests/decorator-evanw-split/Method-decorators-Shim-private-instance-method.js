(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function () { return fn.call(this) + 1; };
        return bar;
    };
    let $foo;
    class Foo {
        bar = 123;
        @dec
        #foo() { return this.bar; }
        static { $foo = new Foo().#foo; }
    }
    assertEq(() => $foo, bar);
    assertEq(() => bar.call(new Foo), 124);
})();
