var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _class_private_field_set = require("@swc/helpers/_/_class_private_field_set");
var _define_property = require("@swc/helpers/_/_define_property");
var _apply_decs_2203_r = require("@swc/helpers/_/_apply_decs_2203_r");
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
        _define_property(this, "value", 1);
        _initProto(this);
    }
}
var __ = {
    writable: true,
    value: { e: [_call_a, _initProto] } = _apply_decs_2203_r(Foo, [
        [
            dec,
            4,
            "a",
            function(v) {
                return this.value = v;
            }
        ]
    ], [])
};
function set_a(v) {
    return _call_a(this, v);
}
