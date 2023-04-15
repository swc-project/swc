//// [privateNamesAndStaticMethods.ts]
class A {
    static #foo(a) {}
    static async #bar(a) {}
    static async *#baz(a) {
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
        A.#foo(30);
        A.#bar(30);
        A.#bar(30);
        A.#quux = A.#quux + 1;
        A.#quux++;
    }
}
class B extends A {
    static #foo(a) {}
    constructor(){
        super();
        B.#foo("str");
    }
}
