(() => {
    assertThrows(() => {
        const dec = (value, ctx) => {
            return {};
        };
        class Foo {
            @dec
            #foo;
        }
    }, TypeError);
})();
