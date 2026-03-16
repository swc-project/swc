var _call_a, _call_g, _call_ag, _initProto;
var _a = /*#__PURE__*/ new WeakMap(), _g = /*#__PURE__*/ new WeakMap(), _ag = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: void 0
        });
        _class_private_field_init(this, _g, {
            get: get_g,
            set: void 0
        });
        _class_private_field_init(this, _ag, {
            get: get_ag,
            set: void 0
        });
        _initProto(this);
    }
}
({ e: [_call_a, _call_g, _call_ag, _initProto] } = _apply_decs_2311(Foo, [], [
    [
        dec,
        2,
        "a",
        async function() {}
    ],
    [
        dec,
        2,
        "g",
        function*() {}
    ],
    [
        dec,
        2,
        "ag",
        async function*() {}
    ]
], 0, (o)=>_a.has(o)));
async function get_a() {
    return _call_a;
}
function* get_g() {
    return _call_g;
}
async function* get_ag() {
    return _call_ag;
}
