class Foo {
    static #_ = 42;
    static #_1 = 42;
    static {
        this.foo = this.#_;
        this.bar = this.#_1;
    }
}
