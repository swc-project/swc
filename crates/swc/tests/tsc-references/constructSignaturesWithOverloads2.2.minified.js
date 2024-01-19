//// [constructSignaturesWithOverloads2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C, C2, i2, C1 = function C(x) {
    _class_call_check(this, C);
};
C = C1 || (C1 = {}), C.x = 1, new C1(1, "");
var C21 = function C2(x) {
    _class_call_check(this, C2);
};
C2 = C21 || (C21 = {}), C2.x = 1, new C21(1, ""), new i2(1, ""), new i2(1, 1);
