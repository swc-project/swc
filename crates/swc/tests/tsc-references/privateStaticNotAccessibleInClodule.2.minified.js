//// [privateStaticNotAccessibleInClodule.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C);
};
(C || (C = {})).y = C.bar;
