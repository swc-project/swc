(() => {
    assertThrows(() => {
        const dec = (cls, ctx) => {
            return null;
        };
        @dec
        class Foo {
        }
    }, TypeError);
})();
