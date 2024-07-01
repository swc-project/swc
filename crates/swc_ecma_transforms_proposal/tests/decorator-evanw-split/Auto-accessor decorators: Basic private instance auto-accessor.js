(() => {
    let lateAsserts;
    const dec = (target, ctx) => {
        assertEq(() => typeof target.get, 'function');
        assertEq(() => typeof target.set, 'function');
        assertEq(() => target.get.name, 'get #foo');
        assertEq(() => target.set.name, 'set #foo');
        assertEq(() => ctx.kind, 'accessor');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, false);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(new Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => ctx.access.get(new Foo), 0);
            assertEq(() => {
                const obj = new Foo;
                ctx.access.set(obj, 123);
                return get$foo(obj);
            }, 123);
        };
    };
    let get$foo;
    let set$foo;
    class Foo {
        @dec
        accessor #foo = 0;
        static {
            get$foo = x => x.#foo;
            set$foo = (x, y) => { x.#foo = y; };
        }
    }
    lateAsserts();
    var obj = new Foo;
    assertEq(() => set$foo(obj, 321), undefined);
    assertEq(() => get$foo(obj), 321);
})();
