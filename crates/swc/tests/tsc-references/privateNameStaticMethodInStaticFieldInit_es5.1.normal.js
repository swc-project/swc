import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
// @target: es2015
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.s = _class_static_private_method_get(C, C, method).call(C);
function method() {
    return 42;
}
console.log(C.s);
