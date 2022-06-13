import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
// @strict: true
// @target: es6
var A1 = function A1() {
    "use strict";
    _class_call_check(this, A1);
    _class_static_private_method_get(A1, A1, method).call(A1, "");
    _class_static_private_method_get(A1, A1, method).call(A1, 1) // Error
    ;
    _class_static_private_method_get(A1, A1, method).call(A1) // Error 
    ;
};
function method(param) {
    return "";
}
