//// [typeofOperatorWithStringType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var M, STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
}
var A = /*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.foo = function() {
        return "";
    }, A;
}();
M || (M = {});
var objA = new A();
_type_of(STRING1), _type_of(""), _type_of({
    x: "",
    y: ""
}), _type_of({
    x: "",
    y: function(s) {
        return s;
    }
}), _type_of(objA.a), _type_of(M.n), _type_of(STRING1[0]), _type_of(foo()), _type_of(A.foo()), _type_of(0 / 0), _type_of((void 0).charAt(0)), _type_of("undefined"), _type_of(_type_of(_type_of(0 / 0))), _type_of(""), _type_of(STRING1), _type_of(foo()), _type_of(objA.a), M.n, _type_of(STRING1), _type_of(foo), _type_of(""), _type_of(objA.a), _type_of(A.foo), _type_of(M.n);
