var _computedKey, _init_a, _init_b, _init__computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_b, _init__computedKey, _initStatic] } = _apply_decs_2203_r(this, [
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
                _computedKey
            ]
        ], []));
        _initStatic(this);
    }
    static #___private_a_1 = _init_a(this);
    static get a() {
        return Foo.#___private_a_1;
    }
    static set a(_v) {
        Foo.#___private_a_1 = _v;
    }
    static #___private_b_2 = _init_b(this, 123);
    static get b() {
        return Foo.#___private_b_2;
    }
    static set b(_v) {
        Foo.#___private_b_2 = _v;
    }
    static #___private__computedKey_3 = _init__computedKey(this, 456);
    static get [_computedKey]() {
        return Foo.#___private__computedKey_3;
    }
    static set [_computedKey](_v) {
        Foo.#___private__computedKey_3 = _v;
    }
}
