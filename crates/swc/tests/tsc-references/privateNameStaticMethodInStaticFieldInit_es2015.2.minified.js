import _class_static_private_method_get from "@swc/helpers/lib/_class_static_private_method_get.js";
class C {
}
function method() {
    return 42;
}
C.s = _class_static_private_method_get(C, C, method).call(C), console.log(C.s);
