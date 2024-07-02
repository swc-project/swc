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
    let get$foo;
    let set$foo;
    class Foo {
        static {
            foo = Foo;
            get$foo = x => x.#foo;
            set$foo = (x, y) => { x.#foo = y; };
        }
        @dec
        static accessor #foo = 123;
    }
    assertEq(() => get$foo(Foo), (123 + 1) * 10);
    assertEq(() => set$foo(Foo, 321), undefined);
    assertEq(() => get$foo(Foo), (321 * 2) * 10);
})();
