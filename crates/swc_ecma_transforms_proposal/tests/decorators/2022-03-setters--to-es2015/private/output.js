var _call_a, _initProto;
const dec = ()=>{};
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    setA(v) {
        _class_private_field_set(this, _a, v);
    }
    constructor(){
        _class_private_field_init(this, _a, {
            get: void 0,
            set: set_a
        });
        _define_property(this, "value", (_initProto(this), 1));
    }
}
({ e: [_call_a, _initProto] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        4,
        "a",
        function(v) {
            return this.value = v;
        }
    ]
], []));
function set_a(v) {
    return _call_a(this, v);
}
