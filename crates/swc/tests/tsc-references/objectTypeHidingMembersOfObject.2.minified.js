//// [objectTypeHidingMembersOfObject.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var c, i, b, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.valueOf = function() {}, C;
}(), r1 = c.valueOf(), r2 = i.valueOf(), a = {
    valueOf: function() {}
}, r3 = a.valueOf(), r4 = b.valueOf();
