(() => {
    assertThrows(() => {
        const dec = (value, ctx) => {
            return null;
        };
        class Foo {
            @dec
            #foo;
        }
    }, TypeError);
})();
