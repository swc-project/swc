import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _field = new WeakMap(), _uninitialized = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _field, {
        writable: !0,
        value: 10
    }), _class_private_field_init(this, _uninitialized, {
        writable: !0,
        value: void 0
    });
};
