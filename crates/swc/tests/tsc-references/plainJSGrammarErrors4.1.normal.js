//// [plainJSGrammarErrors4.js]
class A {
    #a;
    m() {
        this.#a; // ok
        this.#b; // error
    }
}
