var _init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initProto;
const dec = ()=>{};
class Foo {
    static{
        [_init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initProto] = _apply_decs_2203_r(this, [
            [
                dec,
                1,
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
                1,
                "b",
                function() {
                    return this.#__b_2;
                },
                function(_v) {
                    this.#__b_2 = _v;
                }
            ]
        ], []).e;
    }
    #__a_1 = (_initProto(this), _init_a(this));
    get #a() {
        return _get_a(this);
    }
    set #a(_v) {
        _set_a(this, _v);
    }
    #__b_2 = _init_b(this, 123);
    get #b() {
        return _get_b(this);
    }
    set #b(_v) {
        _set_b(this, _v);
    }
}
