class Foo {
    static #_ = 42;
    static #_1 = 42;
    static #_2 = (() => {
        this.foo = this.#_;
        this.bar = this.#_1;
    })();
}
