class A {
    #n = 0;
    #m() {
        return this;
    }
    #key() {
        return "n";
    }
    get #view() {
        return this;
    }

    assign(other) {
        [this.#m().#n] = [1];
        ({ value: other.#m().#n } = { value: 2 });
        [this.#m().#n = this.#m().#n] = [];
        [this.#view.#n] = [3];
        [this.#n, ...other.#m().#n] = [4, 5, 6];
        ({ ...this.#m().#n } = { n: 7 });
        ({ [this.#key()]: this.#m().#n } = { n: 8 });
        ({ value: this.#m().#n = this.#m().#n } = {});
        for (this.#m().#n of [9, 10]) {}
    }

    static #s = 0;
    static #receiver() {
        return this;
    }
    static assign() {
        [this.#receiver().#s] = [1];
        ({ value: A.#receiver().#s } = { value: 2 });
        [this.#receiver().#s = this.#receiver().#s] = [];
    }
}
