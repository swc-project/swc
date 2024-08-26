var _init_a, _init_b, _init, _initProto;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _init_b, _init, _initProto] = _apply_decs_2203_r(this, [
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
    #___private_a_1 = (_initProto(this), _init_a(this));
    get a() {
        return this.#___private_a_1;
    }
    set a(_v) {
        this.#___private_a_1 = _v;
    }
    #___private_b_2 = _init_b(this, 123);
    get b() {
        return this.#___private_b_2;
    }
    set b(_v) {
        this.#___private_b_2 = _v;
    }
    #___private_3 = _init(this, 456);
    get ['c']() {
        return this.#___private_3;
    }
    set ['c'](_v) {
        this.#___private_3 = _v;
    }
}
