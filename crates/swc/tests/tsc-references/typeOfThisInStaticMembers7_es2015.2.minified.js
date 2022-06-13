import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
class C {
}
C.a = 1, C.b = C.a + 1;
class D extends C {
}
D.c = 2, D.d = D.c + 1, D.e = 1 + _get(_get_prototype_of(D), "a", D) + (D.c + 1) + 1;
