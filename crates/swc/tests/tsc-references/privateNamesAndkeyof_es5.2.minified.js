import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _fooField = new WeakMap(), _fooMethod = new WeakSet(), _fooProp = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_method_init(this, _fooMethod), _class_private_field_init(this, _fooProp, {
        get: get_fooProp,
        set: set_fooProp
    }), _class_private_field_init(this, _fooField, {
        writable: !0,
        value: 3
    }), this.bar = 3, this.baz = 3;
};
function get_fooProp() {
    return 1;
}
function set_fooProp(value) {}
