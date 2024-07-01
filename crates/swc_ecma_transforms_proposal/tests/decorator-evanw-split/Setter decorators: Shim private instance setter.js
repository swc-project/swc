(() => {
    let bar;
    const dec = (fn, ctx) => {
        bar = function (x) { fn.call(this, x + 1); };
        return bar;
    };
    let set$foo;
    class Foo {
        bar = 123;
        @dec
        set #foo(x) { this.bar = x; }
        static { set$foo = (x, y) => { x.#foo = y; }; }
    }
    var obj = new Foo;
    assertEq(() => set$foo(obj, 321), undefined);
    assertEq(() => obj.bar, 322);
})();
