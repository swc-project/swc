//// [typeofOperatorWithAnyOtherType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var ANY, ANY1, obj, M, ANY2 = [
    "",
    ""
], obj1 = {
    x: "a",
    y: function() {}
};
function foo() {}
var A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {}, A;
}();
M || (M = {});
var objA = new A();
void 0 === ANY1 || _type_of(ANY1), _type_of(ANY2), void 0 === A || _type_of(A), void 0 === M || _type_of(M), void 0 === obj || _type_of(obj), _type_of(obj1), _type_of(null), _type_of({}), _type_of(ANY2[0]), _type_of(objA.a), _type_of(obj1.x), _type_of(M.n), _type_of(foo()), _type_of(A.foo()), _type_of(ANY + ANY1), _type_of(NaN), _type_of(0), _type_of(NaN), _type_of(void 0 === ANY ? "undefined" : _type_of(ANY)), _type_of(_type_of(_type_of(ANY + ANY1))), void 0 === ANY || _type_of(ANY), void 0 === ANY1 || _type_of(ANY1), _type_of(ANY2[0]), void 0 === ANY || _type_of(ANY), _type_of(obj1), _type_of(obj1.x), _type_of(objA.a), _type_of(M.n), void 0 === ANY || _type_of(ANY), _type_of(ANY2), _type_of(foo), _type_of(objA.a), _type_of(A.foo), _type_of(M.n), _type_of(obj1.x);
