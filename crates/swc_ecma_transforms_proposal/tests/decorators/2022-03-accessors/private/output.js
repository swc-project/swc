var _init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initProto;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _get___a, _set___a, _init_b, _get___b, _set___b, _initProto]  } = _apply_decs_2203_r(this, [
            [
                dec,
                1,
                "a",
                function() {
                    return this.#__a;
                },
                function(_v) {
                    this.#__a = _v;
                }
            ],
            [
                dec,
                1,
                "b",
                function() {
                    return this.#__b;
                },
                function(_v) {
                    this.#__b = _v;
                }
            ]
        ], []));
    }
    #__a = (_initProto(this), _init_a(this));
    get #a() {
        return _get___a(this);
    }
    set #a(_v) {
        _set___a(this, _v);
    }
    #__b = _init_b(this, 123);
    get #b() {
        return _get___b(this);
    }
    set #b(_v) {
        _set___b(this, _v);
    }
}
