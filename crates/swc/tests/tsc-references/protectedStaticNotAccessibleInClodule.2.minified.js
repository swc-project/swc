//// [protectedStaticNotAccessibleInClodule.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C, C1 = function C() {
    _class_call_check(this, C);
};
C.f = (C = C1 || (C1 = {})).foo, C.b = C.bar;
