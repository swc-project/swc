class Foo {
    static bar = 42;
    static #_ = (() => {
        this.foo = Foo.bar;
    })();
}
