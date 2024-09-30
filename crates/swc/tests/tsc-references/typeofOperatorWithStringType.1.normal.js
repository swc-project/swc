//// [typeofOperatorWithStringType.ts]
// typeof  operator on string type
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var STRING;
var STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        return "";
    };
    return A;
}();
(function(M) {})(M || (M = {}));
var objA = new A();
// string type var
var ResultIsString1 = typeof STRING === "undefined" ? "undefined" : _type_of(STRING);
var ResultIsString2 = typeof STRING1 === "undefined" ? "undefined" : _type_of(STRING1);
// string type literal
var ResultIsString3 = _type_of("");
var ResultIsString4 = _type_of({
    x: "",
    y: ""
});
var ResultIsString5 = _type_of({
    x: "",
    y: function(s) {
        return s;
    }
});
// string type expressions
var ResultIsString6 = _type_of(objA.a);
var ResultIsString7 = _type_of(M.n);
var ResultIsString8 = _type_of(STRING1[0]);
var ResultIsString9 = _type_of(foo());
var ResultIsString10 = _type_of(A.foo());
var ResultIsString11 = _type_of(STRING + STRING);
var ResultIsString12 = _type_of(STRING.charAt(0));
// multiple typeof  operators
var ResultIsString13 = _type_of(typeof STRING === "undefined" ? "undefined" : _type_of(STRING));
var ResultIsString14 = _type_of(_type_of(_type_of(STRING + STRING)));
// miss assignment operators
_type_of("");
typeof STRING === "undefined" ? "undefined" : _type_of(STRING);
typeof STRING1 === "undefined" ? "undefined" : _type_of(STRING1);
_type_of(foo());
_type_of(objA.a), M.n;
// use typeof in type query
var z;
var x;
var r;
z: typeof STRING === "undefined" ? "undefined" : _type_of(STRING);
x: typeof STRING1 === "undefined" ? "undefined" : _type_of(STRING1);
r: typeof foo === "undefined" ? "undefined" : _type_of(foo);
var y = {
    a: "",
    b: ""
};
z: _type_of(y.a);
z: _type_of(objA.a);
z: _type_of(A.foo);
z: _type_of(M.n);
var M;
