import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
class C {
}
C.s = _class_static_private_method_get(C, C, function() {
    return 42;
}).call(C), console.log(C.s);
