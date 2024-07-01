(() => {
    const log = [];
    const dec1 = (value, ctx) => {
        log.push(2);
        return () => log.push(3);
    };
    const dec2 = (value, ctx) => {
        log.push(1);
        return () => log.push(4);
    };
    log.push(0);
    let get$foo;
    class Foo {
        @dec1
        @dec2
        static #foo = 123;
        static { get$foo = x => x.#foo; }
    }
    log.push(5);
    assertEq(() => get$foo(Foo), 5);
    assertEq(() => log + '', '0,1,2,3,4,5');
})();
