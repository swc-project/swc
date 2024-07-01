(() => {
    let old;
    const dec = (name) => (cls, ctx) => {
        assertEq(() => typeof cls, 'function');
        assertEq(() => cls.name, name);
        assertEq(() => ctx.kind, 'class');
        assertEq(() => ctx.name, name);
        assertEq(() => 'static' in ctx, false);
        assertEq(() => 'private' in ctx, false);
        assertEq(() => 'access' in ctx, false);
        old = cls;
    };
    const obj = {
        Foo: 
        @dec('Foo')
        class {
        },
    };
    assertEq(() => obj.Foo, old);
    const obj2 = {
        Bar: 
        @dec('Baz')
        class Baz {
        },
    };
    assertEq(() => obj2.Bar, old);
})();
