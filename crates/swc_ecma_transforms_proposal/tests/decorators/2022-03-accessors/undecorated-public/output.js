const dec = ()=>{};
class Foo {
    #_private_a_1;
    get a() {
        return this.#_private_a_1;
    }
    set a(_v) {
        this.#_private_a_1 = _v;
    }
    #_private_b_2 = 123;
    get b() {
        return this.#_private_b_2;
    }
    set b(_v) {
        this.#_private_b_2 = _v;
    }
    #_private_computedKey_3 = 456;
    get ['c']() {
        return this.#_private_computedKey_3;
    }
    set ['c'](_v) {
        this.#_private_computedKey_3 = _v;
    }
}
