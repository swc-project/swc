import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _field = /*#__PURE__*/ new WeakMap(), _uninitialized = /*#__PURE__*/ new WeakMap();
// @target: es2015
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _field, {
        writable: true,
        value: 10
    });
    _class_private_field_init(this, _uninitialized, {
        writable: true,
        value: void 0
    });
};
