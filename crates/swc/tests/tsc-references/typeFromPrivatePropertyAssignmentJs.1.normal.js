//// [typeFromPrivatePropertyAssignmentJs.js]
//// [a.js]
class C {
    /** @type {{ foo?: string } | undefined } */ #a;
    /** @type {{ foo?: string } | undefined } */ #b;
    m() {
        const a = this.#a || {};
        this.#b = this.#b || {};
    }
}
