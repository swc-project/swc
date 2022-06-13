import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
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
