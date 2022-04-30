class A {
    #a = 1n;
    static #b = 2n;
    get #c() {
        return this.#a;
    }
    set #c(v) {
        this.#a = v;
    }
    static get #d() {
        return this.#a;
    }
    static set #d(v) {
        this.#a = v;
    }

    foo() {
        let a = this.#a++;
        a = ++this.#a;
        let b = this.#c++;
        b = ++this.#c;
    }

    static bar() {
        let d = this.#d++;
        d = ++this.#d;
        let e = A.#d++;
        e = ++A.#d;
    }
}
