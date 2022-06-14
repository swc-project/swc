import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
var C = function() {
    "use strict";
    _class_call_check(this, C);
};
function method() {
    return 42;
}
C.s = _class_static_private_method_get(C, C, method).call(C), console.log(C.s);
