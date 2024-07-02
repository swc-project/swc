(() => {
    let lateAsserts;
    const dec = (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, 'set #foo');
        assertEq(() => ctx.kind, 'setter');
        assertEq(() => ctx.name, '#foo');
        assertEq(() => ctx.static, false);
        assertEq(() => ctx.private, true);
        lateAsserts = () => {
            assertEq(() => ctx.access.has(new Foo), true);
            assertEq(() => ctx.access.has({}), false);
            assertEq(() => 'get' in ctx.access, false);
            assertEq(() => {
                const obj = new Foo;
                ctx.access.set(obj, 123);
                return obj.bar;
            }, 123);
        };
    };
    let set$foo;
    class Foo {
        bar = 0;
        @dec
        set #foo(x) { this.bar = x; }
        static { set$foo = (x, y) => { x.#foo = y; }; }
    }
    lateAsserts();
    var obj = new Foo;
    assertEq(() => set$foo(obj, 321), undefined);
    assertEq(() => obj.bar, 321);
})();
