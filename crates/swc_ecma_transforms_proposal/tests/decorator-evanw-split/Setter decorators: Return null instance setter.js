(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return null;
        };
        class Foo {
            @dec
            set foo(x) { }
        }
    }, TypeError);
})();
