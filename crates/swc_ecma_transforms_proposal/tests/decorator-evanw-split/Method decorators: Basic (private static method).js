(() => {
    let old;
    let lateAsserts;
    const dec = (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, '#foo');
        assertEq(() => ctx.kind, 'method');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(Foo), $foo);
            assertEq(() => 'set' in ctx.access, false);
        };
        old = fn;
    };
    let $foo;
    class Foo {
        @dec
        static #foo() { }
        static { $foo = this.#foo; }
    }
    assertEq(() => $foo, old);
    lateAsserts();
})();
