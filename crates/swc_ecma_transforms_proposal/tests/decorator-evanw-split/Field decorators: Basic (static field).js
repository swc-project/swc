(() => {
    const dec = (key) => (value, ctx) => {
        assertEq(() => value, undefined);
        assertEq(() => ctx.kind, 'field');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, true);
        assertEq(() => ctx.private, false);
        assertEq(() => ctx.access.has({ [key]: false }), true);
        assertEq(() => ctx.access.has({ bar: true }), false);
        assertEq(() => ctx.access.get({ [key]: 123 }), 123);
        assertEq(() => {
            const obj = {};
            ctx.access.set(obj, 321);
            return obj[key];
        }, 321);
    };
    const bar = Symbol('bar');
    const baz = Symbol();
    class Foo {
        @dec('foo')
        static foo = 123;
        @dec(bar)
        static [bar] = 123;
        @dec(baz)
        static [baz] = 123;
    }
    assertEq(() => Foo.foo, 123);
    assertEq(() => Foo[bar], 123);
    assertEq(() => Foo[baz], 123);
})();
