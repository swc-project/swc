//// [voidOperatorWithNumberType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var NUMBER, M, NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return 1;
    }, A;
}();
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A(), ResultIsAny1 = void 0, ResultIsAny2 = void 0, ResultIsAny3 = void 0, ResultIsAny4 = void 0, ResultIsAny5 = void 0, ResultIsAny6 = void objA.a, ResultIsAny7 = void M.n, ResultIsAny8 = void NUMBER1[0], ResultIsAny9 = void foo(), ResultIsAny10 = void A.foo(), ResultIsAny11 = void 0, ResultIsAny12 = void 0, ResultIsAny13 = void 0;
foo(), objA.a, M.n, objA.a, M.n;
