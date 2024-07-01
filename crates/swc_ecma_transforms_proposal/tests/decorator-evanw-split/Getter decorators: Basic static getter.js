(() => {
    const dec = (key, name) => (fn, ctx) => {
        assertEq(() => typeof fn, 'function');
        assertEq(() => fn.name, name);
        assertEq(() => ctx.kind, 'getter');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, false);
        assertEq(() => ctx.access.has({ [key]: false }), true);
        assertEq(() => ctx.access.has({ bar: true }), false);
        assertEq(() => ctx.access.get({ [key]: 123 }), 123);
        assertEq(() => 'set' in ctx.access, false);
    };
    const bar = Symbol('bar');
    const baz = Symbol();
    class Foo {
        static bar = 123;
        @dec('foo', 'get foo')
        static get foo() { return this.bar; }
        @dec(bar, 'get [bar]')
        static get [bar]() { return this.bar; }
        @dec(baz, 'get ')
        static get [baz]() { return this.bar; }
    }
    assertEq(() => Foo.foo, 123);
    assertEq(() => Foo[bar], 123);
    assertEq(() => Foo[baz], 123);
})();
