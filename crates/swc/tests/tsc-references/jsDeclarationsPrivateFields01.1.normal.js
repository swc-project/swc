//// [jsDeclarationsPrivateFields01.ts]
//// [file.js]
export class C {
    #hello;
    #world;
    #calcHello() {
        return this.#hello;
    }
    get #screamingHello() {
        return this.#hello.toUpperCase();
    }
    /** @param value {string} */ set #screamingHello(value) {
        throw "NO";
    }
    getWorld() {
        return this.#world;
    }
    constructor(){
        this.#hello = "hello";
        this.#world = 100;
    }
}
