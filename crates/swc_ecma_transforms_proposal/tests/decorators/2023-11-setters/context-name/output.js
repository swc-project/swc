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
                12,
                "a"
            ],
            [
                dec,
                12,
                "a",
                function(v) {}
            ],
            [
                dec,
                12,
                _computedKey
            ],
            [
                dec,
                12,
                _computedKey1
            ],
            [
                dec,
                12,
                _computedKey2
            ],
            [
                dec,
                12,
                _computedKey3
            ],
            [
                dec,
                12,
                _computedKey4
            ],
            [
                dec,
                12,
                _computedKey5
            ],
            [
                dec,
                12,
                _computedKey6
            ]
        ]));
        _initStatic(this);
    }
    static set a(v) {}
    static set #a(v) {
        return _call_a(this, v);
    }
    static set [_computedKey](v) {}
    static set [_computedKey1](v) {}
    static set [_computedKey2](v) {}
    static set [_computedKey3](v) {}
    static set [_computedKey4](v) {}
    static set [_computedKey5](v) {}
    static set [_computedKey6](v) {}
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
