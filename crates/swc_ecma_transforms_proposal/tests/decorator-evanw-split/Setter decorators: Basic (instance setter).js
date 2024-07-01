(() => {
    const dec = (key, name) => (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, name);
        assertEq(() => ctx.kind, 'setter');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, false);
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
        bar = 0;
        @dec('foo', 'set foo')
        set foo(x) { this.bar = x; }
        @dec(bar, 'set [bar]')
        set [bar](x) { this.bar = x; }
        @dec(baz, 'set ')
        set [baz](x) { this.bar = x; }
    }
    var obj = new Foo;
    obj.foo = 321;
    assertEq(() => obj.bar, 321);
    obj[bar] = 4321;
    assertEq(() => obj.bar, 4321);
    obj[baz] = 54321;
    assertEq(() => obj.bar, 54321);
})();
