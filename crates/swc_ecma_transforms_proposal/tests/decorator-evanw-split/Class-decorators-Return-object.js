(() => {
    assertThrows(() => {
        const dec = (cls, ctx) => {
            return {};
        };
        @dec
        class Foo {
        }
    }, TypeError);
})();
