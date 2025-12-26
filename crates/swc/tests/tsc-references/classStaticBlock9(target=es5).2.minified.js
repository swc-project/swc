//// [classStaticBlock9.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    _class_call_check(this, A);
};
A.bar = A.foo + 1, A.foo, A.foo = 1;
