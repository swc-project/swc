class Foo {
    static #_ = 42;
    static {
        this.foo = this.#_;
    }
}
