(() => {
    let oldAddInitializer;
    let got;
    const dec = (cls, ctx) => {
        ctx.addInitializer(function (...args) {
            got = { this: this, args };
        });
        if (oldAddInitializer)
            assertThrows(() => oldAddInitializer(() => { }), TypeError);
        assertThrows(() => ctx.addInitializer({}), TypeError);
        oldAddInitializer = ctx.addInitializer;
    };
    @dec
    @dec
    class Foo {
    }
    assertEq(() => got.this, Foo);
    assertEq(() => got.args.length, 0);
})();
