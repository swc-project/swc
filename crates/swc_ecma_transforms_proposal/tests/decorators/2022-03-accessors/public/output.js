var _init_a, _init_b, _init_computedKey, _initProto;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _init_b, _init_computedKey, _initProto] = _apply_decs_2203_r(this, [
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
                'c'
            ]
        ], []).e;
    }
    #_private_a_1 = (_initProto(this), _init_a(this));
    get a() {
        return this.#_private_a_1;
    }
    set a(_v) {
        this.#_private_a_1 = _v;
    }
    #_private_b_2 = _init_b(this, 123);
    get b() {
        return this.#_private_b_2;
    }
    set b(_v) {
        this.#_private_b_2 = _v;
    }
    #_private_computedKey_3 = _init_computedKey(this, 456);
    get ['c']() {
        return this.#_private_computedKey_3;
    }
    set ['c'](_v) {
        this.#_private_computedKey_3 = _v;
    }
}
