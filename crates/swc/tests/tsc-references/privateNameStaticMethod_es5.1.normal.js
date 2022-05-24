import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
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
