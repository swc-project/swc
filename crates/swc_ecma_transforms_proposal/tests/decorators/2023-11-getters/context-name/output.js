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
                11,
                "a"
            ],
            [
                dec,
                11,
                "a",
                function() {}
            ],
            [
                dec,
                11,
                _computedKey
            ],
            [
                dec,
                11,
                _computedKey1
            ],
            [
                dec,
                11,
                _computedKey2
            ],
            [
                dec,
                11,
                _computedKey3
            ],
            [
                dec,
                11,
                _computedKey4
            ],
            [
                dec,
                11,
                _computedKey5
            ],
            [
                dec,
                11,
                _computedKey6
            ]
        ]));
        _initStatic(this);
    }
    static get a() {}
    static get #a() {
        return _call_a(this);
    }
    static get [_computedKey]() {}
    static get [_computedKey1]() {}
    static get [_computedKey2]() {}
    static get [_computedKey3]() {}
    static get [_computedKey4]() {}
    static get [_computedKey5]() {}
    static get [_computedKey6]() {}
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
