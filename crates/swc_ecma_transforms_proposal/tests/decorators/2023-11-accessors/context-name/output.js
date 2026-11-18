let _computedKey, _computedKey1, _computedKey2, _computedKey3, _computedKey4, _computedKey5, _computedKey6, _init_a, _init_extra__init_a, _init_a1, _init_extra__init_a1, _get___a, _set___a, _init__computedKey, _init_extra__init__computedKey, _init__computedKey1, _init_extra__init__computedKey1, _init__computedKey2, _init_extra__init__computedKey2, _init__computedKey3, _init_extra__init__computedKey3, _init__computedKey4, _init_extra__init__computedKey4, _init__computedKey5, _init_extra__init__computedKey5, _init__computedKey6, _init_extra__init__computedKey6;
const logs = [];
const dec = (value, context)=>{
    logs.push(context.name);
};
const f = ()=>{
    logs.push("computing f");
    return {
        [Symbol.toPrimitive]: ()=>(logs.push("calling toPrimitive"), "f()")
    };
};
_computedKey = _to_property_key("b"), _computedKey1 = _to_property_key("c"), _computedKey2 = _to_property_key(0), _computedKey3 = _to_property_key(1), _computedKey4 = _to_property_key(2n), _computedKey5 = _to_property_key(3n), _computedKey6 = _to_property_key(f());
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_a1, _get___a, _set___a, _init_extra__init_a1, _init__computedKey, _init_extra__init__computedKey, _init__computedKey1, _init_extra__init__computedKey1, _init__computedKey2, _init_extra__init__computedKey2, _init__computedKey3, _init_extra__init__computedKey3, _init__computedKey4, _init_extra__init__computedKey4, _init__computedKey5, _init_extra__init__computedKey5, _init__computedKey6, _init_extra__init__computedKey6] } = _apply_decs_2311(this, [], [
            [
                dec,
                9,
                "a"
            ],
            [
                dec,
                9,
                "a",
                function(_this) {
                    return _this.#__a_2;
                },
                function(_this, _v) {
                    _this.#__a_2 = _v;
                }
            ],
            [
                dec,
                9,
                _computedKey
            ],
            [
                dec,
                9,
                _computedKey1
            ],
            [
                dec,
                9,
                _computedKey2
            ],
            [
                dec,
                9,
                _computedKey3
            ],
            [
                dec,
                9,
                _computedKey4
            ],
            [
                dec,
                9,
                _computedKey5
            ],
            [
                dec,
                9,
                _computedKey6
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
    static #__a_2 = (()=>{
        const _value = _init_a1();
        _init_extra__init_a1();
        return _value;
    })();
    static get #a() {
        return _get___a();
    }
    static set #a(_v) {
        _set___a(_v);
    }
    static #___private__computedKey_3 = (()=>{
        const _value = _init__computedKey();
        _init_extra__init__computedKey();
        return _value;
    })();
    static get [_computedKey]() {
        return Foo.#___private__computedKey_3;
    }
    static set [_computedKey](_v) {
        Foo.#___private__computedKey_3 = _v;
    }
    static #___private__computedKey_4 = (()=>{
        const _value = _init__computedKey1();
        _init_extra__init__computedKey1();
        return _value;
    })();
    static get [_computedKey1]() {
        return Foo.#___private__computedKey_4;
    }
    static set [_computedKey1](_v) {
        Foo.#___private__computedKey_4 = _v;
    }
    static #___private__computedKey_5 = (()=>{
        const _value = _init__computedKey2();
        _init_extra__init__computedKey2();
        return _value;
    })();
    static get [_computedKey2]() {
        return Foo.#___private__computedKey_5;
    }
    static set [_computedKey2](_v) {
        Foo.#___private__computedKey_5 = _v;
    }
    static #___private__computedKey_6 = (()=>{
        const _value = _init__computedKey3();
        _init_extra__init__computedKey3();
        return _value;
    })();
    static get [_computedKey3]() {
        return Foo.#___private__computedKey_6;
    }
    static set [_computedKey3](_v) {
        Foo.#___private__computedKey_6 = _v;
    }
    static #___private__computedKey_7 = (()=>{
        const _value = _init__computedKey4();
        _init_extra__init__computedKey4();
        return _value;
    })();
    static get [_computedKey4]() {
        return Foo.#___private__computedKey_7;
    }
    static set [_computedKey4](_v) {
        Foo.#___private__computedKey_7 = _v;
    }
    static #___private__computedKey_8 = (()=>{
        const _value = _init__computedKey5();
        _init_extra__init__computedKey5();
        return _value;
    })();
    static get [_computedKey5]() {
        return Foo.#___private__computedKey_8;
    }
    static set [_computedKey5](_v) {
        Foo.#___private__computedKey_8 = _v;
    }
    static #___private__computedKey_9 = (()=>{
        const _value = _init__computedKey6();
        _init_extra__init__computedKey6();
        return _value;
    })();
    static get [_computedKey6]() {
        return Foo.#___private__computedKey_9;
    }
    static set [_computedKey6](_v) {
        Foo.#___private__computedKey_9 = _v;
    }
}
expect(logs).toStrictEqual([
    "computing f",
    "calling toPrimitive",
    "a",
    "#a",
    "b",
    "c",
    "0",
    "1",
    "2",
    "3",
    "f()"
]);
