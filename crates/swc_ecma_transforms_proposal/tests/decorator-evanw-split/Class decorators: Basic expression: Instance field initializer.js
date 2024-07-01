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
    class Class {
        Foo = 
        @dec('Foo')
        class {
        };
    }
    const Foo = new Class().Foo;
    assertEq(() => Foo, old);
    class Class2 {
        Bar = 
        @dec('Baz')
        class Baz {
        };
    }
    const Bar = new Class2().Bar;
    assertEq(() => Bar, old);
})();
