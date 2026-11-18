let _init_a, _init_extra__init_a, _get___a, _set___a, _init_b, _init_extra__init_b, _get___b, _set___b;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_init_a, _get___a, _set___a, _init_extra__init_a, _init_b, _get___b, _set___b, _init_extra__init_b] } = _apply_decs_2311(this, [], [
            [
                dec,
                9,
                "a",
                function(_this) {
                    return _this.#__a_1;
                },
                function(_this, _v) {
                    _this.#__a_1 = _v;
                }
            ],
            [
                dec,
                9,
                "b",
                function(_this) {
                    return _this.#__b_2;
                },
                function(_this, _v) {
                    _this.#__b_2 = _v;
                }
            ]
        ]));
    }
    static #__a_1 = (()=>{
        const _value = _init_a();
        _init_extra__init_a();
        return _value;
    })();
    static get #a() {
        return _get___a();
    }
    static set #a(_v) {
        _set___a(_v);
    }
    static #__b_2 = (()=>{
        const _value = _init_b(123);
        _init_extra__init_b();
        return _value;
    })();
    static get #b() {
        return _get___b();
    }
    static set #b(_v) {
        _set___b(_v);
    }
}
