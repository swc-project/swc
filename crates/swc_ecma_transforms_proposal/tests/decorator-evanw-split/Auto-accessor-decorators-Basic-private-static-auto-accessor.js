(() => {
    let lateAsserts;
    const dec = (target, ctx) => {
        assertEq(() => typeof target.get, 'function');
        assertEq(() => typeof target.set, 'function');
        assertEq(() => target.get.name, 'get #foo');
        assertEq(() => target.set.name, 'set #foo');
        assertEq(() => ctx.kind, 'accessor');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(Foo), 0);
            assertEq(() => {
                ctx.access.set(Foo, 123);
                return get$foo(Foo);
            }, 123);
        };
    };
    let get$foo;
    let set$foo;
    class Foo {
        @dec
        static accessor #foo = 0;
        static {
            get$foo = x => x.#foo;
            set$foo = (x, y) => { x.#foo = y; };
        }
    }
    lateAsserts();
    assertEq(() => set$foo(Foo, 321), undefined);
    assertEq(() => get$foo(Foo), 321);
})();
