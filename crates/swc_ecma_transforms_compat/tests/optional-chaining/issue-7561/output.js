class Foo {
    #x;
    test() {
        this === null || this === void 0 ? void 0 : this.y.#x;
    }
}
