var _init_a, _init_b, _computedKey, _init_computedKey, _initStatic;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_b, _init_computedKey, _initStatic]  } = _apply_decs_2203_r(this, [
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
    static #___private_a = _init_a(this);
    static get a() {
        return this.#___private_a;
    }
    static set a(_v) {
        this.#___private_a = _v;
    }
    static #___private_b = _init_b(this, 123);
    static get b() {
        return this.#___private_b;
    }
    static set b(_v) {
        this.#___private_b = _v;
    }
    static #___private_computedKey = _init_computedKey(this, 456);
    static get [_computedKey]() {
        return this.#___private_computedKey;
    }
    static set [_computedKey](_v) {
        this.#___private_computedKey = _v;
    }
}
