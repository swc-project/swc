//// [negateOperatorWithNumberType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M, A = function() {
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
var objA = new A();
objA.a, M.n, A.foo(), objA.a, M.n, objA.a, M.n;
