var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
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
    get [_computedKey]() {
        return this.#___private_computedKey_3;
    }
    set [_computedKey](_v) {
        this.#___private_computedKey_3 = _v;
    }
}
