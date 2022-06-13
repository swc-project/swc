import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
class C {
}
function method() {
    return 42;
}
C.s = _class_static_private_method_get(C, C, method).call(C), console.log(C.s);
