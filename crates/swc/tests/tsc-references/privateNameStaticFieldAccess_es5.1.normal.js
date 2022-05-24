import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
// @target: es2015
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    console.log(_class_static_private_field_spec_get(A, A, _myField)); //Ok
    console.log(_class_static_private_field_spec_get(this, A, _myField)); //Error
};
var _myField = {
    writable: true,
    value: "hello world"
};
