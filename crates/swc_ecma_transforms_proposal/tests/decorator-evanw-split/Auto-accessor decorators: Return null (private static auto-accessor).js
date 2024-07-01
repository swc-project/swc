(() => {
    assertThrows(() => {
        const dec = (target, ctx) => {
            return null;
        };
        class Foo {
            @dec
            static accessor #foo;
        }
    }, TypeError);
})();
