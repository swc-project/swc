import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _x, _class, C = (_x = new WeakMap(), _class = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class), _class_private_field_init(this, _x, {
            get: void 0,
            set: set_x
        });
    }
    return _class.prototype.m = function() {
        _class_private_field_set(this, _x, _class_private_field_get(this, _x) + 2);
    }, _class;
}());
function set_x(x) {}
console.log(new C().m());
