import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
// @target: es2015
class C {
}
C.s = _class_static_private_method_get(C, C, method).call(C);
function method() {
    return 42;
}
console.log(C.s);
