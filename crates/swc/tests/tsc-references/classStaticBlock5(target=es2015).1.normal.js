//// [classStaticBlock5.ts]
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class B {
}
B.a = 1;
B.b = 2;
class C extends B {
}
C.b = 3;
C.c = _get(_get_prototype_of(C), "a", C);
(()=>{
    C.b;
    _get(_get_prototype_of(C), "b", C);
    _get(_get_prototype_of(C), "a", C);
})();
