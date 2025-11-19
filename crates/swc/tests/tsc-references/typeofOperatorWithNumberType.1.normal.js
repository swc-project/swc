//// [typeofOperatorWithNumberType.ts]
// typeof  operator on number type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var NUMBER;
var NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        return 1;
    };
    return A;
}();
(function(M) {})(M || (M = {}));
var objA = new A();
// number type var
var ResultIsString1 = typeof NUMBER === "undefined" ? "undefined" : _type_of(NUMBER);
var ResultIsString2 = typeof NUMBER1 === "undefined" ? "undefined" : _type_of(NUMBER1);
// number type literal
var ResultIsString3 = _type_of(1);
var ResultIsString4 = _type_of({
    x: 1,
    y: 2
});
var ResultIsString5 = _type_of({
    x: 1,
    y: function(n) {
        return n;
    }
});
// number type expressions
var ResultIsString6 = _type_of(objA.a);
var ResultIsString7 = _type_of(M.n);
var ResultIsString8 = _type_of(NUMBER1[0]);
var ResultIsString9 = _type_of(foo());
var ResultIsString10 = _type_of(A.foo());
var ResultIsString11 = _type_of(NUMBER + NUMBER);
// multiple typeof  operators
var ResultIsString12 = _type_of(typeof NUMBER === "undefined" ? "undefined" : _type_of(NUMBER));
var ResultIsString13 = _type_of(_type_of(_type_of(NUMBER + NUMBER)));
// miss assignment operators
_type_of(1);
typeof NUMBER === "undefined" ? "undefined" : _type_of(NUMBER);
typeof NUMBER1 === "undefined" ? "undefined" : _type_of(NUMBER1);
_type_of(foo());
_type_of(objA.a);
_type_of(M.n);
_type_of(objA.a), M.n;
// use typeof in type query
var z;
var x;
z: typeof NUMBER === "undefined" ? "undefined" : _type_of(NUMBER);
x: typeof NUMBER1 === "undefined" ? "undefined" : _type_of(NUMBER1);
r: typeof foo === "undefined" ? "undefined" : _type_of(foo);
var y = {
    a: 1,
    b: 2
};
z: _type_of(y.a);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
var M;
