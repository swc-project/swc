(() => {
    assertThrows(() => {
        const dec = (fn, ctx) => {
            return null;
        };
        class Foo {
            @dec
            #foo() { }
        }
    }, TypeError);
})();
