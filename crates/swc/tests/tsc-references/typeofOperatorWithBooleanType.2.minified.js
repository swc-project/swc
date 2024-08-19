//// [typeofOperatorWithBooleanType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function foo() {
    return !0;
}
var BOOLEAN, M, A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return !1;
    }, A;
}();
M || (M = {});
var objA = new A();
void 0 === BOOLEAN || _type_of(BOOLEAN), _type_of(!0), _type_of({
    x: !0,
    y: !1
}), _type_of(objA.a), _type_of(M.n), _type_of(foo()), _type_of(A.foo()), _type_of(void 0 === BOOLEAN ? "undefined" : _type_of(BOOLEAN)), _type_of(!0), void 0 === BOOLEAN || _type_of(BOOLEAN), _type_of(foo()), _type_of(!0), _type_of(objA.a), _type_of(M.n), void 0 === BOOLEAN || _type_of(BOOLEAN), _type_of(foo), _type_of(!0), _type_of(objA.a), _type_of(A.foo), _type_of(M.n);
