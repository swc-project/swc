(() => {
    const log = [];
    let Bar;
    let Baz;
    const dec1 = (cls, ctx) => {
        log.push(2);
        Bar = function () {
            log.push(4);
            return new cls;
        };
        return Bar;
    };
    const dec2 = (cls, ctx) => {
        log.push(1);
        Baz = function () {
            log.push(5);
            return new cls;
        };
        return Baz;
    };
    log.push(0);
    @dec1
    @dec2
    class Foo {
        constructor() { log.push(6); }
    }
    log.push(3);
    new Foo;
    log.push(7);
    assertEq(() => Foo, Bar);
    assertEq(() => log + '', '0,1,2,3,4,5,6,7');
})();
