//// [typeFromPrivatePropertyAssignment.ts]
class C {
    #a;
    #b;
    m() {
        const a = this.#a || {};
        this.#b = this.#b || {};
    }
}
