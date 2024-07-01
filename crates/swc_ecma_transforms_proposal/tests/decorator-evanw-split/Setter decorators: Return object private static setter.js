(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return {};
        };
        class Foo {
            @dec
            static set #foo(x) { }
        }
    }, TypeError);
})();
