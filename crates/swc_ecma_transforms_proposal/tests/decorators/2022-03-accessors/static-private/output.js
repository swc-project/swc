var _init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initStatic] } = _apply_decs_2203_r(this, [
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
        ], []));
        _initStatic(this);
    }
    static #__a_1 = _init_a(this);
    static get #a() {
        return _get___a(this);
    }
    static set #a(_v) {
        _set___a(this, _v);
    }
    static #__b_2 = _init_b(this, 123);
    static get #b() {
        return _get___b(this);
    }
    static set #b(_v) {
        _set___b(this, _v);
    }
}
