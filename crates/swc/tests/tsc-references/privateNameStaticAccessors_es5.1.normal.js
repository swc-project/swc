import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
// @strict: true
// @target: es6
var A1 = function A1(name) {
    "use strict";
    _class_call_check(this, A1);
    _class_static_private_field_spec_set(A1, A1, _prop, "");
    _class_static_private_field_spec_set(A1, A1, _roProp, ""); // Error
    console.log(_class_static_private_field_spec_get(A1, A1, _prop));
    console.log(_class_static_private_field_spec_get(A1, A1, _roProp));
};
var _prop = {
    get: get_prop,
    set: set_prop
};
var _roProp = {
    get: get_roProp,
    set: void 0
};
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
