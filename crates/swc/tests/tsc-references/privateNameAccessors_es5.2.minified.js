import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _prop = new WeakMap(), _roProp = new WeakMap(), A1 = function(name) {
    "use strict";
    _class_call_check(this, A1), _class_private_field_init(this, _prop, {
        get: get_prop,
        set: set_prop
    }), _class_private_field_init(this, _roProp, {
        get: get_roProp,
        set: void 0
    }), _class_private_field_set(this, _prop, ""), _class_private_field_set(this, _roProp, ""), console.log(_class_private_field_get(this, _prop)), console.log(_class_private_field_get(this, _roProp));
};
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
