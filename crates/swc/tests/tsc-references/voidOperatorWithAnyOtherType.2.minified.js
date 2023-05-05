//// [voidOperatorWithAnyOtherType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M, obj1 = {
    x: "",
    y: 1
}, A = function() {
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
var objA = new A();
obj1.x, obj1.y, objA.a, M.n, A.foo(), objA.a, M.n;
