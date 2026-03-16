let _computedKey, _computedKey1, _computedKey2, _computedKey3, _computedKey4, _computedKey5, _computedKey6, _call_a, _initStatic;
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
        ({ e: [_call_a, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                10,
                "a"
            ],
            [
                dec,
                10,
                "a",
                function() {}
            ],
            [
                dec,
                10,
                _computedKey
            ],
            [
                dec,
                10,
                _computedKey1
            ],
            [
                dec,
                10,
                _computedKey2
            ],
            [
                dec,
                10,
                _computedKey3
            ],
            [
                dec,
                10,
                _computedKey4
            ],
            [
                dec,
                10,
                _computedKey5
            ],
            [
                dec,
                10,
                _computedKey6
            ]
        ]));
        _initStatic(this);
    }
    static a() {}
    static get #a() {
        return _call_a;
    }
    static [_computedKey]() {}
    static [_computedKey1]() {}
    static [_computedKey2]() {}
    static [_computedKey3]() {}
    static [_computedKey4]() {}
    static [_computedKey5]() {}
    static [_computedKey6]() {}
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
