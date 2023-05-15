const dec = ()=>{};
class Foo {
    #__a;
    get #a() {
        return this.#__a;
    }
    set #a(_v) {
        this.#__a = _v;
    }
    #__b = 123;
    get #b() {
        return this.#__b;
    }
    set #b(_v) {
        this.#__b = _v;
    }
}
