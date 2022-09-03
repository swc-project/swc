//// [typeOfThisInStaticMembers.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    return C.bar = function() {
        return this;
    }, C;
}(), t = C.bar(), r2 = t.foo + 1, r3 = t.bar(), r4 = new t(1), C2 = function() {
    "use strict";
    function C2(x) {
        _class_call_check(this, C2);
    }
    return C2.bar = function() {
        return this;
    }, C2;
}(), t2 = C2.bar(), r5 = t2.foo + 1, r6 = t2.bar(), r7 = new t2("");
