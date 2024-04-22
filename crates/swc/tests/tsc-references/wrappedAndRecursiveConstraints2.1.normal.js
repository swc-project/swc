//// [wrappedAndRecursiveConstraints2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
var c = new C(1);
var c = new C(new C('')); // error
