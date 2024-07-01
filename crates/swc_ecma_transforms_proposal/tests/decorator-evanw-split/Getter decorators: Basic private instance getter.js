(() => {
    let lateAsserts;
    const dec = (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, 'get #foo');
        assertEq(() => ctx.kind, 'getter');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, false);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(new Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(new Foo), 123);
            assertEq(() => 'set' in ctx.access, false);
        };
    };
    let get$foo;
    class Foo {
        #bar = 123;
        @dec
        get #foo() { return this.#bar; }
        static { get$foo = x => x.#foo; }
    }
    assertEq(() => get$foo(new Foo), 123);
    lateAsserts();
})();
