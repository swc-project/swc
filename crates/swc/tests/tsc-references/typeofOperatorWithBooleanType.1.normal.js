//// [typeofOperatorWithBooleanType.ts]
// typeof  operator on boolean type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var BOOLEAN;
function foo() {
    return true;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        return false;
    };
    return A;
}();
(function(M) {})(M || (M = {}));
var objA = new A();
// boolean type var
var ResultIsString1 = typeof BOOLEAN === "undefined" ? "undefined" : _type_of(BOOLEAN);
// boolean type literal
var ResultIsString2 = _type_of(true);
var ResultIsString3 = _type_of({
    x: true,
    y: false
});
// boolean type expressions
var ResultIsString4 = _type_of(objA.a);
var ResultIsString5 = _type_of(M.n);
var ResultIsString6 = _type_of(foo());
var ResultIsString7 = _type_of(A.foo());
// multiple typeof  operator
var ResultIsString8 = _type_of(typeof BOOLEAN === "undefined" ? "undefined" : _type_of(BOOLEAN));
// miss assignment operators
_type_of(true);
typeof BOOLEAN === "undefined" ? "undefined" : _type_of(BOOLEAN);
_type_of(foo());
_type_of(true), false;
_type_of(objA.a);
_type_of(M.n);
// use typeof in type query
var z;
var x;
var r;
z: typeof BOOLEAN === "undefined" ? "undefined" : _type_of(BOOLEAN);
r: typeof foo === "undefined" ? "undefined" : _type_of(foo);
var y = {
    a: true,
    b: false
};
z: _type_of(y.a);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
var M;
