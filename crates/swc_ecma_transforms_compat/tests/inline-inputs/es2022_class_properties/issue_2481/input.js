
class Foo {
    static #prop1 = 42;
    static #prop2 = (() => {
        console.log(this.#prop1);
    })();
}
