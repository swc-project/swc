//// [voidOperatorWithAnyOtherType.ts]
// void  operator on any type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var n, M, obj1 = {
    x: "",
    y: 1
}, A = function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {}, A;
}();
Object.defineProperty(M || (M = {}), "n", {
    enumerable: !0,
    get: function() {
        return n;
    },
    set: function(v) {
        n = v;
    }
});
var objA = new A();
obj1.x, obj1.y, objA.a, M.n, A.foo(), objA.a, M.n;
