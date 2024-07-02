(() => {
    const old = {};
    const dec = (key, name) => (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, name);
        assertEq(() => ctx.kind, 'method');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, false);
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
        foo() { }
        @dec(bar, '[bar]')
        [bar]() { }
        @dec(baz, '')
        [baz]() { }
    }
    assertEq(() => Foo.prototype.foo, old['foo']);
    assertEq(() => Foo.prototype[bar], old[bar]);
    assertEq(() => Foo.prototype[baz], old[baz]);
})();
