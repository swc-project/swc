import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _x, C = (_x = new WeakMap(), function() {
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
