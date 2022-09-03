//// [anyAsGenericFunctionCall.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x, a = x(), b = x("hello"), C = function C() {
    "use strict";
    _class_call_check(this, C);
}, c = x(x), d = x(x);
