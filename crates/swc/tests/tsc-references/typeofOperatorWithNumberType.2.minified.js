//// [typeofOperatorWithNumberType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var NUMBER, M, NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
var A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return 1;
    }, A;
}();
M || (M = {});
var objA = new A();
void 0 === NUMBER || _type_of(NUMBER), _type_of(NUMBER1), _type_of(1), _type_of({
    x: 1,
    y: 2
}), _type_of({
    x: 1,
    y: function(n) {
        return n;
    }
}), _type_of(objA.a), _type_of(M.n), _type_of(NUMBER1[0]), _type_of(foo()), _type_of(A.foo()), _type_of(NUMBER + NUMBER), _type_of(void 0 === NUMBER ? "undefined" : _type_of(NUMBER)), _type_of(_type_of(_type_of(NUMBER + NUMBER))), _type_of(1), void 0 === NUMBER || _type_of(NUMBER), _type_of(NUMBER1), _type_of(foo()), _type_of(objA.a), _type_of(M.n), _type_of(objA.a), M.n, void 0 === NUMBER || _type_of(NUMBER), _type_of(NUMBER1), _type_of(foo), _type_of(1), _type_of(objA.a), _type_of(A.foo), _type_of(M.n);
