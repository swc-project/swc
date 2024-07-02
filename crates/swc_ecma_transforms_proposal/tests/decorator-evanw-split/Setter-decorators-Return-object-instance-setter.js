(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return {};
        };
        class Foo {
            @dec
            set foo(x) { }
        }
    }, TypeError);
})();
