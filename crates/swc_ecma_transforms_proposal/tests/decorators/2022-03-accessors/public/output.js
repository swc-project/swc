var _init_a, _init_b, _computedKey, _init_computedKey, _initProto;
const dec = ()=>{};
_computedKey = 'c';
class Foo {
    static{
        ({ e: [_init_a, _init_b, _init_computedKey, _initProto]  } = _apply_decs_2203_r(this, [
            [
                dec,
                1,
                "a"
            ],
            [
                dec,
                1,
                "b"
            ],
            [
                dec,
                1,
                _computedKey
            ]
        ], []));
    }
    #___private_a = (_initProto(this), _init_a(this));
    get a() {
        return this.#___private_a;
    }
    set a(_v) {
        this.#___private_a = _v;
    }
    #___private_b = _init_b(this, 123);
    get b() {
        return this.#___private_b;
    }
    set b(_v) {
        this.#___private_b = _v;
    }
    #___private_computedKey = _init_computedKey(this, 456);
    get [_computedKey]() {
        return this.#___private_computedKey;
    }
    set [_computedKey](_v) {
        this.#___private_computedKey = _v;
    }
}
