var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static #___init_a;
    static get a() {
        return this.#___init_a;
    }
    static set a(_v) {
        this.#___init_a = _v;
    }
    static #___init_b = 123;
    static get b() {
        return this.#___init_b;
    }
    static set b(_v) {
        this.#___init_b = _v;
    }
    static #___init_computedKey = 456;
    static get [_computedKey]() {
        return this.#___init_computedKey;
    }
    static set [_computedKey](_v) {
        this.#___init_computedKey = _v;
    }
}
