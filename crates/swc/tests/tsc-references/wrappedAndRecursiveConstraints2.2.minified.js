//// [wrappedAndRecursiveConstraints2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C(x) {
    _class_call_check(this, C);
};
new C(1), new C(new C(''));
