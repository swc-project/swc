(() => {
    const dec = (key, getName, setName) => (target, ctx) => {
        assertEq(() => typeof target.get, 'function');
        assertEq(() => typeof target.set, 'function');
        assertEq(() => target.get.name, getName);
        assertEq(() => target.set.name, setName);
        assertEq(() => ctx.kind, 'accessor');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, false);
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
        accessor foo = 0;
        @dec(bar, 'get [bar]', 'set [bar]')
        accessor [bar] = 0;
        @dec(baz, 'get ', 'set ')
        accessor [baz] = 0;
    }
    var obj = new Foo;
    obj.foo = 321;
    assertEq(() => obj.foo, 321);
    obj[bar] = 4321;
    assertEq(() => obj[bar], 4321);
    obj[baz] = 54321;
    assertEq(() => obj[baz], 54321);
})();
