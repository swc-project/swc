//// [classDoesNotDependOnPrivateMember.ts]
var M;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(M || (M = {})).C = function C() {
    _class_call_check(this, C);
};
