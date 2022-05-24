import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
// @strict: true
// @target: es6
class A1 {
    constructor(){
        _class_static_private_method_get(A1, A1, method).call(A1, "");
        _class_static_private_method_get(A1, A1, method).call(A1, 1) // Error
        ;
        _class_static_private_method_get(A1, A1, method).call(A1) // Error 
        ;
    }
}
function method(param) {
    return "";
}
