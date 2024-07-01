(() => {
    const dec = (key) => (value, ctx) => {
        assertEq(() => value, undefined);
        assertEq(() => ctx.kind, 'field');
        assertEq(() => ctx.name, key);
        assertEq(() => ctx.static, false);
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
        foo = 123;
        @dec(bar)
        [bar] = 123;
        @dec(baz)
        [baz] = 123;
    }
    assertEq(() => new Foo().foo, 123);
    assertEq(() => new Foo()[bar], 123);
    assertEq(() => new Foo()[baz], 123);
})();
