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
        return this.#b;
    }
    static set #d(v) {
        this.#b = v;
    }

    foo() {
        let a = this.#a++;
        a = ++this.#a;
        let b = this.#c++;
        b = ++this.#c;
        console.log(a, b);
    }

    static bar() {
        let d = this.#d++;
        d = ++this.#d;
        let e = A.#d++;
        e = ++A.#d;
        console.log(d, e);
    }
}

const a = new A();
a.foo();
A.bar();
