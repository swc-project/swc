const dec = ()=>{};
class Foo {
    static #_private_a_1;
    static get a() {
        return this.#_private_a_1;
    }
    static set a(_v) {
        this.#_private_a_1 = _v;
    }
    static #_private_b_2 = 123;
    static get b() {
        return this.#_private_b_2;
    }
    static set b(_v) {
        this.#_private_b_2 = _v;
    }
    static #_private_computedKey_3 = 456;
    static get ['c']() {
        return this.#_private_computedKey_3;
    }
    static set ['c'](_v) {
        this.#_private_computedKey_3 = _v;
    }
}
