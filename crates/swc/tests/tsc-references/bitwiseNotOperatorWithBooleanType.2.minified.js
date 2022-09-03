//// [bitwiseNotOperatorWithBooleanType.ts]
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
var objA = new A(), ResultIsNumber1 = ~BOOLEAN, ResultIsNumber2 = -2, ResultIsNumber3 = ~{
    x: !0,
    y: !1
}, ResultIsNumber4 = ~objA.a, ResultIsNumber5 = ~M.n, ResultIsNumber6 = ~foo(), ResultIsNumber7 = ~A.foo(), ResultIsNumber8 = ~~BOOLEAN;
foo(), objA.a, M.n;
