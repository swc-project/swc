(() => {
    let lateAsserts;
    const dec = (value, ctx) => {
        assertEq(() => value, undefined);
        assertEq(() => ctx.kind, 'field');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(Foo), 123);
            assertEq(() => {
                ctx.access.set(Foo, 321);
                return get$foo(Foo);
            }, 321);
        };
    };
    let get$foo;
    class Foo {
        @dec
        static #foo = 123;
        static { get$foo = x => x.#foo; }
    }
    assertEq(() => get$foo(Foo), 123);
    lateAsserts();
})();
