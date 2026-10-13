class A {
    #n = 0;
    static #s = 0;

    #m() {
        return this;
    }
    static #sm() {
        return this;
    }
    get #view() {
        return this;
    }
    static get #staticView() {
        return this;
    }

    update(receiver) {
        this.#view[this.#n++]++;
        (++this.#n, this.#m()).n++;
        this.#m(this.#n++).n++;
        this.#view[(this.#n = 1, "n")]++;
        receiver().#n++;
    }
    assign(receiver) {
        [this.#m().#n = ++this.#n] = [];
        ({ value: this.#m().#n = (this.#n = 1) } = {});
        ({ [this.#n++]: this.#m().#n } = { 0: 1 });
        [receiver().#n] = [1];
        for (this.#view[this.#n++] of [1, 2]) {}
    }
    static update(receiver) {
        this.#staticView[this.#s++]++;
        (++this.#s, this.#sm()).n++;
        this.#sm(this.#s++).n++;
        this.#staticView[(this.#s = 1, "n")]++;
        receiver().#s++;
    }
    static assign(receiver) {
        [this.#sm().#s = ++this.#s] = [];
        ({ value: this.#sm().#s = (this.#s = 1) } = {});
        ({ [this.#s++]: this.#sm().#s } = { 0: 1 });
        [receiver().#s] = [1];
        for (this.#staticView[this.#s++] of [1, 2]) {}
    }
}
