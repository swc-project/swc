import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _x, _class;
// @target: es2015
var C = (_x = /*#__PURE__*/ new WeakMap(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class1() {
        _class_call_check(this, _class1);
        _class_private_field_init(this, _x, {
            get: void 0,
            set: set_x
        });
    }
    var _proto = _class1.prototype;
    _proto.m = function m() {
        _class_private_field_set(this, _x, _class_private_field_get(this, _x) + 2); // Error
    };
    return _class1;
}(), _class);
console.log(new C().m());
function set_x(x) {}
