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
let _computedKey7 = _computedKey, _computedKey8 = _computedKey1, _computedKey9 = _computedKey2, _computedKey10 = _computedKey3, _computedKey11 = _computedKey4, _computedKey12 = _computedKey5, _computedKey13 = _computedKey6;
class Foo {
    static get a() {}
    static get [_computedKey7]() {}
    static get [_computedKey8]() {}
    static get [_computedKey9]() {}
    static get [_computedKey10]() {}
    static get [_computedKey11]() {}
    static get [_computedKey12]() {}
    static get [_computedKey13]() {}
}
var _a = {
    get: get_a,
    set: void 0
};
(()=>{
    ({ e: [_call_a, _initStatic] } = _apply_decs_2311(Foo, [], [
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
    _initStatic(Foo);
})();
function get_a() {
    return _call_a(this);
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
