var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static #___private_a;
    static get a() {
        return this.#___private_a;
    }
    static set a(_v) {
        this.#___private_a = _v;
    }
    static #___private_b = 123;
    static get b() {
        return this.#___private_b;
    }
    static set b(_v) {
        this.#___private_b = _v;
    }
    static #___private_computedKey = 456;
    static get [_computedKey]() {
        return this.#___private_computedKey;
    }
    static set [_computedKey](_v) {
        this.#___private_computedKey = _v;
    }
}
