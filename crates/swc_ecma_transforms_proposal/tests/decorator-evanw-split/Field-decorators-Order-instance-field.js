(() => {
    const log = [];
    const dec1 = (value, ctx) => {
        log.push(2);
        return () => log.push(4);
    };
    const dec2 = (value, ctx) => {
        log.push(1);
        return () => log.push(5);
    };
    log.push(0);
    class Foo {
        @dec1
        @dec2
        foo = 123;
    }
    log.push(3);
    var obj = new Foo();
    log.push(6);
    assertEq(() => obj.foo, 6);
    assertEq(() => log + '', '0,1,2,3,4,5,6');
})();
