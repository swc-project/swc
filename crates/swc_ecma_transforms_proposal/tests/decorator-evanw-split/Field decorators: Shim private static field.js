(() => {
    let foo;
    let log = [];
    const dec = (value, ctx) => {
        return function (x) {
            assertEq(() => this, foo);
            return log.push(has$foo(this), has$bar(this), x);
        };
    };
    assertEq(() => log + '', '');
    let has$foo;
    let has$bar;
    let get$foo;
    let get$bar;
    class Foo {
        static {
            foo = Foo;
            has$foo = x => #foo in x;
            has$bar = x => #bar in x;
            get$foo = x => x.#foo;
            get$bar = x => x.#bar;
        }
        @dec
        static #foo = 123;
        @dec
        static #bar;
    }
    assertEq(() => get$foo(Foo), 3);
    assertEq(() => get$bar(Foo), 6);
    assertEq(() => log + '', 'false,false,123,true,false,');
})();
