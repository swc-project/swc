//// [logicalNotOperatorWithBooleanType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    return !0;
}
var BOOLEAN, M, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return !1;
    }, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsBoolean1 = !BOOLEAN, ResultIsBoolean2 = !1, ResultIsBoolean3 = !1, ResultIsBoolean4 = !objA.a, ResultIsBoolean5 = !M.n, ResultIsBoolean6 = !foo(), ResultIsBoolean7 = !A.foo(), ResultIsBoolean = !!BOOLEAN;
foo(), objA.a, M.n;
