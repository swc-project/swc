import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        return _class_static_private_field_spec_get(C, C, _x);
    }, C;
}(), _x = {
    writable: !0,
    value: 123
};
console.log(_class_static_private_field_spec_get(C, C, _x));
