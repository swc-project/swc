import * as swcHelpers from "@swc/helpers";
class B {
}
B.a = 1, B.b = 2;
class C extends B {
}
C.b = 3, C.c = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C), C.b, super.b, super.a;
