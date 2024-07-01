(() => {
    let lateAsserts;
    const dec = (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, 'set #foo');
        assertEq(() => ctx.kind, 'setter');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => 'get' in ctx.access, false);
            assertEq(() => {
                ctx.access.set(Foo, 123);
                return Foo.bar;
            }, 123);
        };
    };
    let set$foo;
    class Foo {
        static bar = 0;
        @dec
        static set #foo(x) { this.bar = x; }
        static { set$foo = (x, y) => { x.#foo = y; }; }
    }
    lateAsserts();
    assertEq(() => set$foo(Foo, 321), undefined);
    assertEq(() => Foo.bar, 321);
})();
