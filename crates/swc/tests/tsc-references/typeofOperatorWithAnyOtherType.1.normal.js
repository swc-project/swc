//// [typeofOperatorWithAnyOtherType.ts]
// typeof  operator on any type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var ANY;
var ANY1;
var ANY2 = [
    "",
    ""
];
var obj;
var obj1 = {
    x: "a",
    y: function() {}
};
function foo() {
    var a;
    return a;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        var a;
        return a;
    };
    return A;
}();
(function(M) {})(M || (M = {}));
var objA = new A();
// any type var
var ResultIsString1 = typeof ANY1 === "undefined" ? "undefined" : _type_of(ANY1);
var ResultIsString2 = typeof ANY2 === "undefined" ? "undefined" : _type_of(ANY2);
var ResultIsString3 = typeof A === "undefined" ? "undefined" : _type_of(A);
var ResultIsString4 = typeof M === "undefined" ? "undefined" : _type_of(M);
var ResultIsString5 = typeof obj === "undefined" ? "undefined" : _type_of(obj);
var ResultIsString6 = typeof obj1 === "undefined" ? "undefined" : _type_of(obj1);
// any type literal
var ResultIsString7 = typeof undefined === "undefined" ? "undefined" : _type_of(undefined);
var ResultIsString8 = _type_of(null);
var ResultIsString9 = _type_of({});
// any type expressions
var ResultIsString10 = _type_of(ANY2[0]);
var ResultIsString11 = _type_of(objA.a);
var ResultIsString12 = _type_of(obj1.x);
var ResultIsString13 = _type_of(M.n);
var ResultIsString14 = _type_of(foo());
var ResultIsString15 = _type_of(A.foo());
var ResultIsString16 = _type_of(ANY + ANY1);
var ResultIsString17 = _type_of(null + undefined);
var ResultIsString18 = _type_of(null + null);
var ResultIsString19 = _type_of(undefined + undefined);
// multiple typeof  operators
var ResultIsString20 = _type_of(typeof ANY === "undefined" ? "undefined" : _type_of(ANY));
var ResultIsString21 = _type_of(_type_of(_type_of(ANY + ANY1)));
// miss assignment operators
typeof ANY === "undefined" ? "undefined" : _type_of(ANY);
typeof ANY1 === "undefined" ? "undefined" : _type_of(ANY1);
_type_of(ANY2[0]);
typeof ANY === "undefined" ? "undefined" : _type_of(ANY), ANY1;
typeof obj1 === "undefined" ? "undefined" : _type_of(obj1);
_type_of(obj1.x);
_type_of(objA.a);
_type_of(M.n);
// use typeof in type query
var z;
var x;
var r;
z: typeof ANY === "undefined" ? "undefined" : _type_of(ANY);
x: typeof ANY2 === "undefined" ? "undefined" : _type_of(ANY2);
r: typeof foo === "undefined" ? "undefined" : _type_of(foo);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
z: _type_of(obj1.x);
var M;
