var _call_a, _initProto;
const dec = ()=>{};
var _a = /*#__PURE__*/ new WeakMap();
class Foo {
    callA() {
        return _class_private_field_get(this, _a).call(this);
    }
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: void 0
        });
        _define_property(this, "value", (_initProto(this), 1));
    }
}
({ e: [_call_a, _initProto] } = _apply_decs_2203_r(Foo, [
    [
        dec,
        2,
        "a",
        function() {
            return this.value;
        }
    ]
], []));
function get_a() {
    return _call_a;
}
