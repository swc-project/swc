var _call_a, _initProto;
const dec = ()=>{};
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    getA() {
        return _class_private_field_get(this, _a);
    }
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: void 0
        });
        _define_property(this, "value", 1);
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: { e: [_call_a, _initProto] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            3,
            "a",
            function() {
                return this.value;
            }
        ]
    ], [])
};
function get_a() {
    return _call_a(this);
}
