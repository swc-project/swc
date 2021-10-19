class Foo {
    static foo;
    static #_ = (() => {
        this.foo = "foo";
    })();
}
