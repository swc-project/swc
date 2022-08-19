import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return _class_static_private_field_spec_get(C, C, _x);
    }, C;
}(), _x = {
    writable: !0,
    value: 123
};
console.log(_class_static_private_field_spec_get(C, C, _x));
