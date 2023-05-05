//// [privateNameMethod.ts]
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
var _method = /*#__PURE__*/ new WeakSet();
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
