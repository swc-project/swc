(() => {
    let lateAsserts;
    const dec = (value, ctx) => {
        assertEq(() => value, undefined);
        assertEq(() => ctx.kind, 'field');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, false);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(new Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(new Foo), 123);
            assertEq(() => {
                const obj = new Foo;
                ctx.access.set(obj, 321);
                return get$foo(obj);
            }, 321);
        };
    };
    let get$foo;
    class Foo {
        @dec
        #foo = 123;
        static { get$foo = x => x.#foo; }
    }
    assertEq(() => get$foo(new Foo()), 123);
    lateAsserts();
})();
