// @target: es2015
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _x, _class;
var C = (_x = /*#__PURE__*/ new WeakMap(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
        _class_private_field_init(this, _x, {
            get: void 0,
            set: set_x
        });
    }
    var _proto = _class.prototype;
    _proto.m = function m() {
        _class_private_field_set(this, _x, _class_private_field_get(this, _x) + 2); // Error
    };
    return _class;
}(), _class);
console.log(new C().m());
function set_x(x) {}
