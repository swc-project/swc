var _computedKey, _computedKey1, _computedKey2, _computedKey3, _computedKey4, _computedKey5, _computedKey6, _init_a, _init_extra__init_a, _init_a1, _init_extra_a, _init__computedKey, _init_extra__init__computedKey, _init__computedKey1, _init_extra__init__computedKey1, _init__computedKey2, _init_extra__init__computedKey2, _init__computedKey3, _init_extra__init__computedKey3, _init__computedKey4, _init_extra__init__computedKey4, _init__computedKey5, _init_extra__init__computedKey5, _init__computedKey6, _init_extra__init__computedKey6;
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
_computedKey = "b", _computedKey1 = "c", _computedKey2 = 0, _computedKey3 = 1, _computedKey4 = 2n, _computedKey5 = 3n, _computedKey6 = f();
class Foo {
    static{
        ({ e: [_init_a, _init_extra__init_a, _init_a1, _init_extra_a, _init__computedKey, _init_extra__init__computedKey, _init__computedKey1, _init_extra__init__computedKey1, _init__computedKey2, _init_extra__init__computedKey2, _init__computedKey3, _init_extra__init__computedKey3, _init__computedKey4, _init_extra__init__computedKey4, _init__computedKey5, _init_extra__init__computedKey5, _init__computedKey6, _init_extra__init__computedKey6] } = _apply_decs_2311(this, [], [
            [
                dec,
                8,
                "a"
            ],
            [
                dec,
                8,
                "a",
                function(_this) {
                    return _this.#a;
                },
                function(_this, value) {
                    _this.#a = value;
                }
            ],
            [
                dec,
                8,
                _computedKey
            ],
            [
                dec,
                8,
                _computedKey1
            ],
            [
                dec,
                8,
                _computedKey2
            ],
            [
                dec,
                8,
                _computedKey3
            ],
            [
                dec,
                8,
                _computedKey4
            ],
            [
                dec,
                8,
                _computedKey5
            ],
            [
                dec,
                8,
                _computedKey6
            ]
        ]));
    }
    static a = (()=>{
        const _value = _init_a();
        _init_extra__init_a();
        return _value;
    })();
    static #a = (()=>{
        const _value = _init_a1();
        _init_extra_a();
        return _value;
    })();
    static [_computedKey] = (()=>{
        const _value = _init__computedKey();
        _init_extra__init__computedKey();
        return _value;
    })();
    static [_computedKey1] = (()=>{
        const _value = _init__computedKey1();
        _init_extra__init__computedKey1();
        return _value;
    })();
    static [_computedKey2] = (()=>{
        const _value = _init__computedKey2();
        _init_extra__init__computedKey2();
        return _value;
    })();
    static [_computedKey3] = (()=>{
        const _value = _init__computedKey3();
        _init_extra__init__computedKey3();
        return _value;
    })();
    static [_computedKey4] = (()=>{
        const _value = _init__computedKey4();
        _init_extra__init__computedKey4();
        return _value;
    })();
    static [_computedKey5] = (()=>{
        const _value = _init__computedKey5();
        _init_extra__init__computedKey5();
        return _value;
    })();
    static [_computedKey6] = (()=>{
        const _value = _init__computedKey6();
        _init_extra__init__computedKey6();
        return _value;
    })();
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
