var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static #___private_a_1;
    static get a() {
        return this.#___private_a_1;
    }
    static set a(_v) {
        this.#___private_a_1 = _v;
    }
    static #___private_b_2 = 123;
    static get b() {
        return this.#___private_b_2;
    }
    static set b(_v) {
        this.#___private_b_2 = _v;
    }
    static #___private_computedKey_3 = 456;
    static get [_computedKey]() {
        return this.#___private_computedKey_3;
    }
    static set [_computedKey](_v) {
        this.#___private_computedKey_3 = _v;
    }
}
