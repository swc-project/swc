//// [privateNameStaticsAndStaticMethods.ts]
class A {
    static #foo(a) {}
    static async #bar(a1) {}
    static async *#baz(a2) {
        return 3;
    }
    static #_quux;
    static get #quux() {
        return this.#_quux;
    }
    static set #quux(val) {
        this.#_quux = val;
    }
    constructor(){
        A.#foo(30), A.#bar(30), A.#bar(30), A.#quux = A.#quux + 1, A.#quux++;
    }
}
