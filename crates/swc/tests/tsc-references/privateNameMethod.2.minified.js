//// [privateNameMethod.ts]
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _method = new WeakSet();
class A1 {
    constructor(name){
        _class_private_method_init(this, _method), _class_private_method_get(this, _method, method).call(this, ""), _class_private_method_get(this, _method, method).call(this, 1), _class_private_method_get(this, _method, method).call(this);
    }
}
function method(param) {
    return "";
}
