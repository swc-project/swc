const dec = ()=>{};
class Foo {
    static #__a;
    static get #a() {
        return this.#__a;
    }
    static set #a(_v) {
        this.#__a = _v;
    }
    static #__b = 123;
    static get #b() {
        return this.#__b;
    }
    static set #b(_v) {
        this.#__b = _v;
    }
}
