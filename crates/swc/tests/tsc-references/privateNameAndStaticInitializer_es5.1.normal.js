import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _foo = /*#__PURE__*/ new WeakMap(), _prop = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022, es2015
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _foo, {
        writable: true,
        value: 1
    });
    _class_private_field_init(this, _prop, {
        writable: true,
        value: 2
    });
};
A.inst = new A();
