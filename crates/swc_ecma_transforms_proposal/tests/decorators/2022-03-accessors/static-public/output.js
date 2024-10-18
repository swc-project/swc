var _init_a, _init_b, _init_computedKey, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _init_b, _init_computedKey, _initStatic] = _apply_decs_2203_r(this, [
            [
                dec,
                6,
                "a"
            ],
            [
                dec,
                6,
                "b"
            ],
            [
                dec,
                6,
                'c'
            ]
        ], []).e;
        _initStatic(this);
    }
    static #_private_a_1 = _init_a(this);
    static get a() {
        return this.#_private_a_1;
    }
    static set a(_v) {
        this.#_private_a_1 = _v;
    }
    static #_private_b_2 = _init_b(this, 123);
    static get b() {
        return this.#_private_b_2;
    }
    static set b(_v) {
        this.#_private_b_2 = _v;
    }
    static #_private_computedKey_3 = _init_computedKey(this, 456);
    static get ['c']() {
        return this.#_private_computedKey_3;
    }
    static set ['c'](_v) {
        this.#_private_computedKey_3 = _v;
    }
}
