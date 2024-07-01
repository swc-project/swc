(() => {
    let oldAddInitializer;
    let got;
    const dec = (fn, ctx) => {
        ctx.addInitializer(function (...args) {
            got = { this: this, args };
        });
        if (oldAddInitializer)
            assertThrows(() => oldAddInitializer(() => { }), TypeError);
        assertThrows(() => ctx.addInitializer({}), TypeError);
        oldAddInitializer = ctx.addInitializer;
    };
    class Foo {
        @dec
        @dec
        set foo(x) { }
    }
    assertEq(() => got, undefined);
    const instance = new Foo;
    assertEq(() => got.this, instance);
    assertEq(() => got.args.length, 0);
})();
