import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _method = /*#__PURE__*/ new WeakSet();
// @strict: true
// @target: es6
var A1 = function A1(name) {
    "use strict";
    _class_call_check(this, A1);
    _class_private_method_init(this, _method);
    _class_private_method_get(this, _method, method).call(this, "");
    _class_private_method_get(this, _method, method).call(this, 1) // Error
    ;
    _class_private_method_get(this, _method, method).call(this) // Error 
    ;
};
function method(param) {
    return "";
}
