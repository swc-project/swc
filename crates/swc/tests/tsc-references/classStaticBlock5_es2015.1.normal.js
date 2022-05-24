import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
// @target: esnext, es2022, es2015, es5
class B {
}
B.a = 1;
B.b = 2;
class C extends B {
}
C.b = 3;
C.c = _get(_get_prototype_of(C), "a", C);
var __ = {
    writable: true,
    value: (()=>{
        C.b;
        super.b;
        super.a;
    })()
};
