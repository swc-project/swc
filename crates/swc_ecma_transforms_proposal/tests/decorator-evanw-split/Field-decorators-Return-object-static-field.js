(() => {
    assertThrows(() => {
        const dec = (value, ctx) => {
            return {};
        };
        class Foo {
            @dec
            static foo;
        }
    }, TypeError);
})();
