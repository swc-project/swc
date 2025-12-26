//// [classStaticBlock5.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class B {
}
B.a = 1, B.b = 2;
class C extends B {
}
C.b = 3, C.c = _get(_get_prototype_of(C), "a", C), C.b, _get(_get_prototype_of(C), "b", C), _get(_get_prototype_of(C), "a", C);
