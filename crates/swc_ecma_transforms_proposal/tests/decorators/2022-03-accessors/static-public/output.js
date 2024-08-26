var _init_a, _init_b, _init, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _init_b, _init, _initStatic] = _apply_decs_2203_r(this, [
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
    static #___private_a_1 = _init_a(this);
    static get a() {
        return this.#___private_a_1;
    }
    static set a(_v) {
        this.#___private_a_1 = _v;
    }
    static #___private_b_2 = _init_b(this, 123);
    static get b() {
        return this.#___private_b_2;
    }
    static set b(_v) {
        this.#___private_b_2 = _v;
    }
    static #___private_3 = _init(this, 456);
    static get ['c']() {
        return this.#___private_3;
    }
    static set ['c'](_v) {
        this.#___private_3 = _v;
    }
}
