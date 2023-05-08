var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    #___init_a;
    get a() {
        return this.#___init_a;
    }
    set a(_v) {
        this.#___init_a = _v;
    }
    #___init_b = 123;
    get b() {
        return this.#___init_b;
    }
    set b(_v) {
        this.#___init_b = _v;
    }
    #___init_computedKey = 456;
    get [_computedKey]() {
        return this.#___init_computedKey;
    }
    set [_computedKey](_v) {
        this.#___init_computedKey = _v;
    }
}
