const dec = ()=>{};
class Foo {
    #___private_a_1;
    get a() {
        return this.#___private_a_1;
    }
    set a(_v) {
        this.#___private_a_1 = _v;
    }
    #___private_b_2 = 123;
    get b() {
        return this.#___private_b_2;
    }
    set b(_v) {
        this.#___private_b_2 = _v;
    }
    #___private_computedKey_3 = 456;
    get ['c']() {
        return this.#___private_computedKey_3;
    }
    set ['c'](_v) {
        this.#___private_computedKey_3 = _v;
    }
}
