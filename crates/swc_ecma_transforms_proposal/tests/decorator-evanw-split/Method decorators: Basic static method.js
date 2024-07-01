(() => {
    const old = {};
    const dec = (key, name) => (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, name);
        assertEq(() => ctx.kind, 'method');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, false);
        assertEq(() => ctx.access.has({ [key]: false }), true);
        assertEq(() => ctx.access.has({ bar: true }), false);
        assertEq(() => ctx.access.get({ [key]: 123 }), 123);
        assertEq(() => 'set' in ctx.access, false);
        old[key] = fn;
    };
    const bar = Symbol('bar');
    const baz = Symbol();
    class Foo {
        @dec('foo', 'foo')
        static foo() { }
        @dec(bar, '[bar]')
        static [bar]() { }
        @dec(baz, '')
        static [baz]() { }
    }
    assertEq(() => Foo.foo, old['foo']);
    assertEq(() => Foo[bar], old[bar]);
    assertEq(() => Foo[baz], old[baz]);
})();
