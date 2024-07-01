(() => {
    let foo;
    let get;
    let set;
    const dec = (target, ctx) => {
        function init(x) {
            assertEq(() => this, foo);
            return x + 1;
        }
        get = function () { return target.get.call(this) * 10; };
        set = function (x) { target.set.call(this, x * 2); };
        return { get, set, init };
    };
    class Foo {
        static {
            foo = Foo;
        }
        @dec
        static accessor foo = 123;
    }
    assertEq(() => Object.getOwnPropertyDescriptor(Foo, 'foo').get, get);
    assertEq(() => Object.getOwnPropertyDescriptor(Foo, 'foo').set, set);
    assertEq(() => Foo.foo, (123 + 1) * 10);
    Foo.foo = 321;
    assertEq(() => Foo.foo, (321 * 2) * 10);
})();
