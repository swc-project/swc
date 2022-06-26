import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _field = new WeakMap(), _method = new WeakSet(), _acc = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_method_init(this, _method), _class_private_field_init(this, _acc, {
        get: get_acc,
        set: set_acc
    }), _class_private_field_init(this, _field, {
        writable: !0,
        value: 123
    });
};
function get_acc() {
    return "";
}
function set_acc(x) {}
