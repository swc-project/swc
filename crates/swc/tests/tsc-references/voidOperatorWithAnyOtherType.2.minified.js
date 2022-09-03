//// [voidOperatorWithAnyOtherType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var ANY, ANY1, obj, M, ANY2 = [
    "",
    ""
], obj1 = {
    x: "",
    y: 1
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
var objA = new A(), ResultIsAny1 = void 0, ResultIsAny2 = void 0, ResultIsAny3 = void 0, ResultIsAny4 = void 0, ResultIsAny5 = void 0, ResultIsAny6 = void 0, ResultIsAny7 = void 0, ResultIsAny8 = void 0, ResultIsAny9 = void ANY2[0], ResultIsAny10 = void obj1.x, ResultIsAny11 = void obj1.y, ResultIsAny12 = void objA.a, ResultIsAny13 = void M.n, ResultIsAny14 = void foo(), ResultIsAny15 = void A.foo(), ResultIsAny16 = void 0, ResultIsAny17 = void 0, ResultIsAny18 = void 0, ResultIsAny19 = void 0, ResultIsAny20 = void 0, ResultIsAny21 = void 0;
ANY2[0], objA.a, M.n;
