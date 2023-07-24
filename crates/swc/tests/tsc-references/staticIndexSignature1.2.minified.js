//// [staticIndexSignature1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C);
};
C.foo = 1, C.bar = 2, C.foo, C[42] = 42, C[2] = 2, C[42];
