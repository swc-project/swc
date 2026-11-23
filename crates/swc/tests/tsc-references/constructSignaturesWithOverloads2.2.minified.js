//// [constructSignaturesWithOverloads2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C(x) {
    _class_call_check(this, C);
};
(C || (C = {})).x = 1, new C(1, '');
var C2 = function C2(x) {
    _class_call_check(this, C2);
};
(C2 || (C2 = {})).x = 1, new C2(1, ''), new (void 0)(1, ''), new (void 0)(1, 1);
