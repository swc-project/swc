(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return {};
        };
        class Foo {
            @dec
            get foo() { return; }
        }
    }, TypeError);
})();
