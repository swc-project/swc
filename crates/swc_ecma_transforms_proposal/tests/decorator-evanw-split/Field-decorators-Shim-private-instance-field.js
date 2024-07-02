(() => {
    let log = [];
    const dec = (value, ctx) => {
        return function (x) {
            assertEq(() => this instanceof Foo, true);
            return log.push(has$foo(this), has$bar(this), x);
        };
    };
    let has$foo;
    let has$bar;
    let get$foo;
    let get$bar;
    class Foo {
        @dec
        #foo = 123;
        @dec
        #bar;
        static {
            has$foo = x => #foo in x;
            has$bar = x => #bar in x;
            get$foo = x => x.#foo;
            get$bar = x => x.#bar;
        }
    }
    assertEq(() => log + '', '');
    var obj = new Foo;
    assertEq(() => get$foo(obj), 3);
    assertEq(() => get$bar(obj), 6);
    assertEq(() => log + '', 'false,false,123,true,false,');
})();
