//// [privateStaticNotAccessibleInClodule.ts]
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C, C1 = function C() {
    _class_call_check(this, C);
};
(C = C1 || (C1 = {})).y = C.bar;
