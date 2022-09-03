//// [privateNamesAndMethods.ts]
class A {
    #foo(a) {}
    async #bar(a1) {}
    async *#baz(a2) {
        return 3;
    }
    #_quux;
    get #quux() {
        return this.#_quux;
    }
    set #quux(val) {
        this.#_quux = val;
    }
    constructor(){
        this.#foo(30), this.#bar(30), this.#baz(30), this.#quux = this.#quux + 1, this.#quux++;
    }
}
class B extends A {
    #foo(a3) {}
    constructor(){
        super(), this.#foo("str");
    }
}
