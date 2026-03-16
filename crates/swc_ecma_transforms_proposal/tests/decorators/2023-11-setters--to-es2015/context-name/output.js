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
    static set a(v) {}
    static set [_computedKey7](v) {}
    static set [_computedKey8](v) {}
    static set [_computedKey9](v) {}
    static set [_computedKey10](v) {}
    static set [_computedKey11](v) {}
    static set [_computedKey12](v) {}
    static set [_computedKey13](v) {}
}
var _a = {
    get: void 0,
    set: set_a
};
(()=>{
    ({ e: [_call_a, _initStatic] } = _apply_decs_2311(Foo, [], [
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
    _initStatic(Foo);
})();
function set_a(v) {
    return _call_a(this, v);
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
