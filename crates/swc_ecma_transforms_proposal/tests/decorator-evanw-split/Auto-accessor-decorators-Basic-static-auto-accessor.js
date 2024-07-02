(() => {
    const dec = (key, getName, setName) => (target, ctx) => {
        assertEq(() => typeof target.get, 'function');
        assertEq(() => typeof target.set, 'function');
        assertEq(() => target.get.name, getName);
        assertEq(() => target.set.name, setName);
        assertEq(() => ctx.kind, 'accessor');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, false);
        assertEq(() => ctx.access.has({ [key]: false }), true);
        assertEq(() => ctx.access.has({ bar: true }), false);
        assertEq(() => ctx.access.get({ [key]: 123 }), 123);
        assertEq(() => {
            const obj = {};
            ctx.access.set(obj, 123);
            return obj[key];
        }, 123);
    };
    const bar = Symbol('bar');
    const baz = Symbol();
    class Foo {
        @dec('foo', 'get foo', 'set foo')
        static accessor foo = 0;
        @dec(bar, 'get [bar]', 'set [bar]')
        static accessor [bar] = 0;
        @dec(baz, 'get ', 'set ')
        static accessor [baz] = 0;
    }
    Foo.foo = 321;
    assertEq(() => Foo.foo, 321);
    Foo[bar] = 4321;
    assertEq(() => Foo[bar], 4321);
    Foo[baz] = 54321;
    assertEq(() => Foo[baz], 54321);
})();
