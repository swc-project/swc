//// [voidOperatorWithBooleanType.ts]
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
var objA = new A(), ResultIsAny1 = void 0, ResultIsAny2 = void 0, ResultIsAny3 = void 0, ResultIsAny4 = void objA.a, ResultIsAny5 = void M.n, ResultIsAny6 = void foo(), ResultIsAny7 = void A.foo(), ResultIsAny8 = void 0;
foo(), objA.a, M.n;
