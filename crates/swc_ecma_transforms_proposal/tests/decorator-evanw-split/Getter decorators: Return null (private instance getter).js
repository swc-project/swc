(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return null;
        };
        class Foo {
            @dec
            get #foo() { return; }
        }
    }, TypeError);
})();
