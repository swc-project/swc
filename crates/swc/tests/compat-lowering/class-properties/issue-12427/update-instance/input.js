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

    update(other) {
        this.#m().n++;
        ++this.#m().n;
        this.#m().n--;
        --this.#m().n;
        other.#m().n++;
        this.#m().a.n++;
        this.#m().g().n++;
        this.#m()[0]++;
        (this.#m()).n++;
        this[this.#key()]++;
        this.#m()[this.#key()]++;
        this.#m(this.#m()).n++;
        (() => this.#m())().n++;
        this.#view.n++;
        this.#view.#n++;
        this.#m().#n++;
        ++this.#m().#n;
    }
}
