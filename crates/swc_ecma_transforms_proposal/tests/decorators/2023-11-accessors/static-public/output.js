let _computedKey, _init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey;
const dec = ()=>{};
_computedKey = _to_property_key('c');
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_b, _init_extra__init_b, _init__computedKey, _init_extra__init__computedKey] } = _apply_decs_2311(this, [], [
            [
                dec,
                9,
                "a"
            ],
            [
                dec,
                9,
                "b"
            ],
            [
                dec,
                9,
                _computedKey
            ]
        ]));
    }
    static #___private_a_1 = (()=>{
        const _value = _init_a();
        _init_extra__init_a();
        return _value;
    })();
    static get a() {
        return Foo.#___private_a_1;
    }
    static set a(_v) {
        Foo.#___private_a_1 = _v;
    }
    static #___private_b_2 = (()=>{
        const _value = _init_b(123);
        _init_extra__init_b();
        return _value;
    })();
    static get b() {
        return Foo.#___private_b_2;
    }
    static set b(_v) {
        Foo.#___private_b_2 = _v;
    }
    static #___private__computedKey_3 = (()=>{
        const _value = _init__computedKey(456);
        _init_extra__init__computedKey();
        return _value;
    })();
    static get [_computedKey]() {
        return Foo.#___private__computedKey_3;
    }
    static set [_computedKey](_v) {
        Foo.#___private__computedKey_3 = _v;
    }
}
