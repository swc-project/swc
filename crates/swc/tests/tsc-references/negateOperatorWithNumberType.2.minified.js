//// [negateOperatorWithNumberType.ts]
// - operator on number type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M, n, A = function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return 1;
    }, A;
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
objA.a, M.n, A.foo(), objA.a, M.n, objA.a, M.n;
