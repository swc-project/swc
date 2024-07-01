(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return {};
        };
        class Foo {
            @dec
            static foo() { }
        }
    }, TypeError);
})();
