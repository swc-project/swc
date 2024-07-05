(() => {
    let old;
    let block;
    class Bar {
    }
    const dec = (cls, ctx) => {
        old = cls;
        return Bar;
    };
    const Foo = 
    @dec
    class Foo {
        static { block = Foo; }
        method() { return Foo; }
        static method() { return Foo; }
        field = Foo;
        static field = Foo;
        get getter() { return Foo; }
        static get getter() { return Foo; }
        set setter(x) { x.foo = Foo; }
        static set setter(x) { x.foo = Foo; }
        accessor accessor = Foo;
        static accessor accessor = Foo;
    };
    const foo = new old;
    let obj;
    assertEq(() => Foo !== old, true);
    assertEq(() => Foo, Bar);
    assertEq(() => block, Bar);
    assertEq(() => Foo.field, Bar);
    assertEq(() => foo.field, Bar);
    assertEq(() => old.getter, Bar);
    assertEq(() => foo.getter, Bar);
    assertEq(() => (obj = { foo: null }, old.setter = obj, obj.foo), Bar);
    assertEq(() => (obj = { foo: null }, foo.setter = obj, obj.foo), Bar);
    // The specification for accessors is potentially wrong at the moment: https://github.com/tc39/proposal-decorators/issues/529
    // assertEq(() => old.accessor, Bar)
    // assertEq(() => foo.accessor, Bar)
})();
