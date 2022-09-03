//// [arrayOfFunctionTypes3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, b, c, a2, b2, c2, x = [
    function() {
        return 1;
    },
    function() {}
], r2 = x[0](), C = function C() {
    "use strict";
    _class_call_check(this, C);
}, y = [
    C,
    C
], r3 = new y[0](), z = [
    a,
    b,
    c
], r4 = z[0], r5 = r4(""), r5b = r4(1), z2 = [
    a2,
    b2,
    c2
], r6 = z2[0], r7 = r6("");
