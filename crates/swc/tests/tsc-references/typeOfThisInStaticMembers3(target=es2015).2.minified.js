//// [typeOfThisInStaticMembers3.ts]
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class C {
}
C.a = 1, C.b = C.a + 1;
class D extends C {
}
D.c = 2, D.d = D.c + 1, D.e = _get(_get_prototype_of(D), "a", D) + D.c + 1;
