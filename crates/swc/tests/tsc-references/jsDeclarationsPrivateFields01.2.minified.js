//// [jsDeclarationsPrivateFields01.ts]
//// [file.js]
export class C {
    #hello = "hello";
    #world = 100;
    #calcHello() {
        return this.#hello;
    }
    get #screamingHello() {
        return this.#hello.toUpperCase();
    }
    set #screamingHello(value) {
        throw "NO";
    }
    getWorld() {
        return this.#world;
    }
}
