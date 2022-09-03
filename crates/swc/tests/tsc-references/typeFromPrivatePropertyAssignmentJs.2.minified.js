//// [typeFromPrivatePropertyAssignmentJs.js]
//// [a.js]
class C {
    #a;
    #b;
    m() {
        this.#a, this.#b = this.#b || {};
    }
}
