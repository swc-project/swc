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
    let get$foo;
    let set$foo;
    class Foo {
        @dec
        accessor #foo = 123;
        static {
            get$foo = x => x.#foo;
            set$foo = (x, y) => { x.#foo = y; };
        }
    }
    var obj = new Foo;
    assertEq(() => get$foo(obj), (123 + 1) * 10);
    assertEq(() => set$foo(obj, 321), undefined);
    assertEq(() => get$foo(obj), (321 * 2) * 10);
})();
