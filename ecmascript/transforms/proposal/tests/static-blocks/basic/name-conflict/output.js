class Foo {
    static #_ = 42;
    static #_1 = (() => {
        this.foo = this.#_;
    })();
}
