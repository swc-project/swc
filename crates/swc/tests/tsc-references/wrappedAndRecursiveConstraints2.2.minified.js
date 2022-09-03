//// [wrappedAndRecursiveConstraints2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
}, c = new C(1), c = new C(new C(""));
