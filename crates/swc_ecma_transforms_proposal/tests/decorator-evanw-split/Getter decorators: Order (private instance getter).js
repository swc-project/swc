(() => {
    const log = [];
    let bar;
    let baz;
    const dec1 = (fn, ctx) => {
        log.push(2);
        bar = function () {
            log.push(4);
            return fn.call(this);
        };
        return bar;
    };
    const dec2 = (fn, ctx) => {
        log.push(1);
        baz = function () {
            log.push(5);
            return fn.call(this);
        };
        return baz;
    };
    log.push(0);
    let get$foo;
    class Foo {
        @dec1
        @dec2
        get #foo() { return log.push(6); }
        static { get$foo = x => x.#foo; }
    }
    log.push(3);
    assertEq(() => get$foo(new Foo), 7);
    log.push(7);
    assertEq(() => log + '', '0,1,2,3,4,5,6,7');
})();
