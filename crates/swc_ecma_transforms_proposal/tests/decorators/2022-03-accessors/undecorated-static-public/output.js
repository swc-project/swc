var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static #___private_a_1;
    static get a() {
        return Foo.#___private_a_1;
    }
    static set a(_v) {
        Foo.#___private_a_1 = _v;
    }
    static #___private_b_2 = 123;
    static get b() {
        return Foo.#___private_b_2;
    }
    static set b(_v) {
        Foo.#___private_b_2 = _v;
    }
    static #___private__computedKey_3 = 456;
    static get [_computedKey]() {
        return Foo.#___private__computedKey_3;
    }
    static set [_computedKey](_v) {
        Foo.#___private__computedKey_3 = _v;
    }
}
