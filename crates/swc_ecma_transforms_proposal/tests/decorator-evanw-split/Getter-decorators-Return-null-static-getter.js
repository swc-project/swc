(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return null;
        };
        class Foo {
            @dec
            static get foo() { return; }
        }
    }, TypeError);
})();
