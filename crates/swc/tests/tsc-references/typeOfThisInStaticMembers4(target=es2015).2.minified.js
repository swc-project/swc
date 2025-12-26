//// [typeOfThisInStaticMembers4.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
class C {
}
class D extends C {
}
_define_property(D, "c", 2), _define_property(D, "d", D.c + 1), _define_property(D, "e", super.a + D.c + 1);
