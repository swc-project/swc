var _init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initStatic] = _apply_decs_2203_r(this, [
            [
                dec,
                6,
                "a",
                function() {
                    return this.#__a_1;
                },
                function(_v) {
                    this.#__a_1 = _v;
                }
            ],
            [
                dec,
                6,
                "b",
                function() {
                    return this.#__b_2;
                },
                function(_v) {
                    this.#__b_2 = _v;
                }
            ]
        ], []).e;
        _initStatic(this);
    }
    static #__a_1 = _init_a(this);
    static get #a() {
        return _get_a(this);
    }
    static set #a(_v) {
        _set_a(this, _v);
    }
    static #__b_2 = _init_b(this, 123);
    static get #b() {
        return _get_b(this);
    }
    static set #b(_v) {
        _set_b(this, _v);
    }
}
