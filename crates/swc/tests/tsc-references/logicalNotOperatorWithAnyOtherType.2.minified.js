//// [logicalNotOperatorWithAnyOtherType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ANY, ANY1, obj, M, ANY2 = [
    "",
    ""
], obj1 = {
    x: "",
    y: function() {}
};
function foo() {}
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {}, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsBoolean1 = !ANY1, ResultIsBoolean2 = !ANY2, ResultIsBoolean3 = !A, ResultIsBoolean4 = !M, ResultIsBoolean5 = !obj, ResultIsBoolean6 = !obj1, ResultIsBoolean7 = !0, ResultIsBoolean8 = !0, ResultIsBoolean9 = !ANY2[0], ResultIsBoolean10 = !obj1.x, ResultIsBoolean11 = !obj1.y, ResultIsBoolean12 = !objA.a, ResultIsBoolean13 = !M.n, ResultIsBoolean14 = !foo(), ResultIsBoolean15 = !A.foo(), ResultIsBoolean16 = !(ANY + ANY1), ResultIsBoolean17 = !0, ResultIsBoolean18 = !0, ResultIsBoolean19 = !0, ResultIsBoolean20 = !!ANY, ResultIsBoolean21 = !(ANY + ANY1);
ANY2[0], objA.a, M.n;
