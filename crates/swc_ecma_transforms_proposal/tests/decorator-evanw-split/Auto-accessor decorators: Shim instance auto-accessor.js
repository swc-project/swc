(() => {
    let get;
    let set;
    const dec = (target, ctx) => {
        function init(x) {
            assertEq(() => this instanceof Foo, true);
            return x + 1;
        }
        get = function () { return target.get.call(this) * 10; };
        set = function (x) { target.set.call(this, x * 2); };
        return { get, set, init };
    };
    class Foo {
        @dec
        accessor foo = 123;
    }
    assertEq(() => Object.getOwnPropertyDescriptor(Foo.prototype, 'foo').get, get);
    assertEq(() => Object.getOwnPropertyDescriptor(Foo.prototype, 'foo').set, set);
    var obj = new Foo;
    assertEq(() => obj.foo, (123 + 1) * 10);
    obj.foo = 321;
    assertEq(() => obj.foo, (321 * 2) * 10);
})();
