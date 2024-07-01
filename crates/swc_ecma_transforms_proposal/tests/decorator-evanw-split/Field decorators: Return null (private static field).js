(() => {
    assertThrows(() => {
        const dec = (value, ctx) => {
            return null;
        };
        class Foo {
            @dec
            static #foo;
        }
    }, TypeError);
})();
