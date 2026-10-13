class A {
    static #n = 0;
    static #m() {
        return this;
    }
    static get #view() {
        return this;
    }

    static update(other) {
        this.#m().n++;
        ++this.#m().n;
        this.#m().n--;
        --this.#m().n;
        A.#m().n++;
        other.#m().n++;
        this.#view.n++;
        this.#view.#n++;
        this.#m().#n++;
        ++A.#m().#n;
    }
}
