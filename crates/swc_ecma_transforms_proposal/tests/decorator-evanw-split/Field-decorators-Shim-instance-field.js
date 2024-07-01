(() => {
    let log = [];
    const dec = (value, ctx) => {
        return function (x) {
            assertEq(() => this instanceof Foo, true);
            return log.push('foo' in this, 'bar' in this, x);
        };
    };
    class Foo {
        @dec
        foo = 123;
        @dec
        bar;
    }
    assertEq(() => log + '', '');
    var obj = new Foo;
    assertEq(() => obj.foo, 3);
    assertEq(() => obj.bar, 6);
    assertEq(() => log + '', 'false,false,123,true,false,');
})();
