import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
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
