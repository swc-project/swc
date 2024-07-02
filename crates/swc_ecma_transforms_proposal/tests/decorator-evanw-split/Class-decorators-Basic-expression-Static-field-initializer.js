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
        static Foo = 
        @dec('Foo')
        class {
        };
    }
    assertEq(() => Class.Foo, old);
    class Class2 {
        static Bar = 
        @dec('Baz')
        class Baz {
        };
    }
    assertEq(() => Class2.Bar, old);
})();
