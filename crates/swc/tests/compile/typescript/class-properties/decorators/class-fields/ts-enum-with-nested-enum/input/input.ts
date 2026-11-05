enum Foo {
    a = (() => {
        enum Bar {
            a = 'a',
            b = 'b',
        }
        return 0;
    })(),
}
