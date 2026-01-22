class C {
    static #FOO = "#FOO";
    static {
        this.bar = this.#FOO;
    }
    static baz = 42;
    static {
        Object.freeze(this);
    }
}
