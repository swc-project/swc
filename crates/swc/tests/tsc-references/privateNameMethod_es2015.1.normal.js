import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _method = /*#__PURE__*/ new WeakSet();
// @strict: true
// @target: es6
class A1 {
    constructor(name){
        _class_private_method_init(this, _method);
        _class_private_method_get(this, _method, method).call(this, "");
        _class_private_method_get(this, _method, method).call(this, 1) // Error
        ;
        _class_private_method_get(this, _method, method).call(this) // Error 
        ;
    }
}
function method(param) {
    return "";
}
