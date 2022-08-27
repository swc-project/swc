//// [typeOfThisInStaticMembers4.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C {
}
_define_property(C, "a", 1);
_define_property(C, "b", C.a + 1);
class D extends C {
}
_define_property(D, "c", 2);
_define_property(D, "d", D.c + 1);
_define_property(D, "e", _get(_get_prototype_of(D), "a", D) + D.c + 1);
