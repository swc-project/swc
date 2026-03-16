var _computedKey, _computedKey1, _computedKey2, _computedKey3, _computedKey4, _computedKey5, _computedKey6, _init_a, _init_a1, _init__computedKey, _init__computedKey1, _init__computedKey2, _init__computedKey3, _init__computedKey4, _init__computedKey5, _init__computedKey6, _initStatic;
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
        ({ e: [_init_a, _init_a1, _init__computedKey, _init__computedKey1, _init__computedKey2, _init__computedKey3, _init__computedKey4, _init__computedKey5, _init__computedKey6, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                8,
                "a"
            ],
            [
                dec,
                8,
                "a",
                function() {
                    return this.#a;
                },
                function(value) {
                    this.#a = value;
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
        _initStatic(this);
    }
    static a = _init_a(this);
    static #a = _init_a1(this);
    static [_computedKey] = _init__computedKey(this);
    static [_computedKey1] = _init__computedKey1(this);
    static [_computedKey2] = _init__computedKey2(this);
    static [_computedKey3] = _init__computedKey3(this);
    static [_computedKey4] = _init__computedKey4(this);
    static [_computedKey5] = _init__computedKey5(this);
    static [_computedKey6] = _init__computedKey6(this);
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
