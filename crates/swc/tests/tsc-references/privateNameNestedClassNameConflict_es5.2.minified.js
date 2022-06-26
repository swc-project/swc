import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap(), A = function() {
    "use strict";
    _class_call_check(this, A), _class_private_field_init(this, _foo, {
        writable: !0,
        value: void 0
    });
    var _foo1 = new WeakMap(), A1 = function() {
        _class_call_check(this, A1), _class_private_field_init(this, _foo1, {
            writable: !0,
            value: void 0
        });
    };
};
