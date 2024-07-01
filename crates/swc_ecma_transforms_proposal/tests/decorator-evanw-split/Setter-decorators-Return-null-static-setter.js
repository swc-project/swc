(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return null;
        };
        class Foo {
            @dec
            static set foo(x) { }
        }
    }, TypeError);
})();
