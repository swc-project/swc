(() => {
    const dec = (key, name) => (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, name);
        assertEq(() => ctx.kind, 'setter');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, false);
        assertEq(() => ctx.access.has({ [key]: false }), true);
        assertEq(() => ctx.access.has({ bar: true }), false);
        assertEq(() => 'get' in ctx.access, false);
        const obj = {};
        ctx.access.set(obj, 123);
        assertEq(() => obj[key], 123);
        assertEq(() => 'bar' in obj, false);
    };
    const bar = Symbol('bar');
    const baz = Symbol();
    class Foo {
        static bar = 0;
        @dec('foo', 'set foo')
        static set foo(x) { this.bar = x; }
        @dec(bar, 'set [bar]')
        static set [bar](x) { this.bar = x; }
        @dec(baz, 'set ')
        static set [baz](x) { this.bar = x; }
    }
    Foo.foo = 321;
    assertEq(() => Foo.bar, 321);
    Foo[bar] = 4321;
    assertEq(() => Foo.bar, 4321);
    Foo[baz] = 54321;
    assertEq(() => Foo.bar, 54321);
})();
