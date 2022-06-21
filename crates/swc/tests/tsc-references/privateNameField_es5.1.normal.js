import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _name = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
var A = function A(name) {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _name, {
        writable: true,
        value: void 0
    });
    _class_private_field_set(this, _name, name);
};
