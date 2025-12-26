//// [typeOfThisInStaticMembers4.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C {
}
_define_property(C, "a", 1), _define_property(C, "b", C.a + 1);
class D extends C {
}
_define_property(D, "c", 2), _define_property(D, "d", D.c + 1), _define_property(D, "e", _get(_get_prototype_of(D), "a", D) + D.c + 1);
