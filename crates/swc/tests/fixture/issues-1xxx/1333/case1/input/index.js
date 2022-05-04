class Foo {
    #ws;
    #ws2;
    get connected() {
        return this.#ws2 && this.#ws.readyState === _ws1.default.OPEN;
    }
}
