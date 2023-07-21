//// [typeOfThisInStaticMembers2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C);
};
C.foo = C;
var C2 = function C2() {
    _class_call_check(this, C2);
};
C2.foo = C2;
