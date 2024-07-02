(() => {
    const dec = (key, name) => (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, name);
        assertEq(() => ctx.kind, 'getter');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, false);
        assertEq(() => ctx.private, false);
        assertEq(() => ctx.access.has({ [key]: false }), true);
        assertEq(() => ctx.access.has({ bar: true }), false);
        assertEq(() => ctx.access.get({ [key]: 123 }), 123);
        assertEq(() => 'set' in ctx.access, false);
    };
    const bar = Symbol('bar');
    const baz = Symbol();
    class Foo {
        bar = 123;
        @dec('foo', 'get foo')
        get foo() { return this.bar; }
        @dec(bar, 'get [bar]')
        get [bar]() { return this.bar; }
        @dec(baz, 'get ')
        get [baz]() { return this.bar; }
    }
    assertEq(() => new Foo().foo, 123);
    assertEq(() => new Foo()[bar], 123);
    assertEq(() => new Foo()[baz], 123);
})();
