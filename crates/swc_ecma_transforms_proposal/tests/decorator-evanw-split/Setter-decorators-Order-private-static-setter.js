(() => {
    const log = [];
    let bar;
    let baz;
    const dec1 = (fn, ctx) => {
        log.push(2);
        bar = function (x) {
            log.push(4);
            fn.call(this, x);
        };
        return bar;
    };
    const dec2 = (fn, ctx) => {
        log.push(1);
        baz = function (x) {
            log.push(5);
            fn.call(this, x);
        };
        return baz;
    };
    log.push(0);
    let set$foo;
    class Foo {
        @dec1
        @dec2
        static set #foo(x) { log.push(6); }
        static { set$foo = (x, y) => { x.#foo = y; }; }
    }
    log.push(3);
    assertEq(() => set$foo(Foo, 123), undefined);
    log.push(7);
    assertEq(() => log + '', '0,1,2,3,4,5,6,7');
})();
