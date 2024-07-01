(() => {
    let old;
    let lateAsserts;
    const dec = (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, '#foo');
        assertEq(() => ctx.kind, 'method');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, false);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(new Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(new Foo), $foo);
            assertEq(() => 'set' in ctx.access, false);
        };
        old = fn;
    };
    let $foo;
    class Foo {
        @dec
        #foo() { }
        static { $foo = new Foo().#foo; }
    }
    assertEq(() => $foo, old);
    lateAsserts();
})();
