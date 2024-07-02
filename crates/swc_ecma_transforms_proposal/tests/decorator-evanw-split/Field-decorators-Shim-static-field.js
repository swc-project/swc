(() => {
    let foo;
    let log = [];
    const dec = (value, ctx) => {
        return function (x) {
            assertEq(() => this, foo);
            return log.push('foo' in this, 'bar' in this, x);
        };
    };
    assertEq(() => log + '', '');
    class Foo {
        static {
            foo = Foo;
        }
        @dec
        static foo = 123;
        @dec
        static bar;
    }
    assertEq(() => Foo.foo, 3);
    assertEq(() => Foo.bar, 6);
    assertEq(() => log + '', 'false,false,123,true,false,');
})();
