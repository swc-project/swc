class A {
    #m() {
        return (this.o ??= {
            n: 0
        });
    }
    go(other) {
        this.#m().n++;
        ++this.#m().n;
        other.#m().n++;
        this.#m().a.n++;
        this.#m()[0]++;
        return this.o.n;
    }
    static #s() {
        return (this.o ??= {
            n: 0
        });
    }
    static go() {
        this.#s().n++;
        return this.o.n;
    }
}
