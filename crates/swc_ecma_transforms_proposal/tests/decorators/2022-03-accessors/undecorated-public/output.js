var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    #___private_a;
    get a() {
        return this.#___private_a;
    }
    set a(_v) {
        this.#___private_a = _v;
    }
    #___private_b = 123;
    get b() {
        return this.#___private_b;
    }
    set b(_v) {
        this.#___private_b = _v;
    }
    #___private_computedKey = 456;
    get [_computedKey]() {
        return this.#___private_computedKey;
    }
    set [_computedKey](_v) {
        this.#___private_computedKey = _v;
    }
}
