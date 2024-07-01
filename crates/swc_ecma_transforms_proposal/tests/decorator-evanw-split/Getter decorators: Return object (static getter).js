(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return {};
        };
        class Foo {
            @dec
            static get foo() { return; }
        }
    }, TypeError);
})();
