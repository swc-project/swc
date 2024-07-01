(() => {
    assertThrows(() => {
        const dec = (target, ctx) => {
            return null;
        };
        class Foo {
            @dec
            accessor foo;
        }
    }, TypeError);
})();
