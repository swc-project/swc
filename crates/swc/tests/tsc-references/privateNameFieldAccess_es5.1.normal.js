// @target: es2015
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _myField = /*#__PURE__*/ new WeakMap();
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _class_private_field_init(this, _myField, {
        writable: true,
        value: "hello world"
    });
    console.log(_class_private_field_get(this, _myField));
};
