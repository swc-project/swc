var _computedKey, _computedKey1, _computedKey2, _computedKey3, _computedKey4, _computedKey5, _computedKey6, _call_a, _initStatic;
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
let _computedKey7 = _computedKey, _computedKey8 = _computedKey1, _computedKey9 = _computedKey2, _computedKey10 = _computedKey3, _computedKey11 = _computedKey4, _computedKey12 = _computedKey5, _computedKey13 = _computedKey6;
class Foo {
    static a() {}
    static [_computedKey7]() {}
    static [_computedKey8]() {}
    static [_computedKey9]() {}
    static [_computedKey10]() {}
    static [_computedKey11]() {}
    static [_computedKey12]() {}
    static [_computedKey13]() {}
}
var _a = {
    get: get_a,
    set: void 0
};
(()=>{
    ({ e: [_call_a, _initStatic] } = _apply_decs_2311(Foo, [], [
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
    _initStatic(Foo);
})();
function get_a() {
    return _call_a;
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
