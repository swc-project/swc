(() => {
    let lateAsserts;
    const dec = (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, 'get #foo');
        assertEq(() => ctx.kind, 'getter');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(Foo), 123);
            assertEq(() => 'set' in ctx.access, false);
        };
    };
    let get$foo;
    class Foo {
        static #bar = 123;
        @dec
        static get #foo() { return this.#bar; }
        static { get$foo = x => x.#foo; }
    }
    assertEq(() => get$foo(Foo), 123);
    lateAsserts();
})();
