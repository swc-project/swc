import * as swcHelpers from "@swc/helpers";
// typeof  operator on string type
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
        swcHelpers.classCallCheck(this, A);
    }
    A.foo = function foo() {
        return "";
    };
    return A;
}();
var M;
(function(M1) {
    var n;
    M1.n = n;
})(M || (M = {}));
var objA = new A();
// string type var
var ResultIsString1 = typeof STRING === "undefined" ? "undefined" : swcHelpers.typeOf(STRING);
var ResultIsString2 = typeof STRING1 === "undefined" ? "undefined" : swcHelpers.typeOf(STRING1);
// string type literal
var ResultIsString3 = swcHelpers.typeOf("");
var ResultIsString4 = swcHelpers.typeOf({
    x: "",
    y: ""
});
var ResultIsString5 = swcHelpers.typeOf({
    x: "",
    y: function(s) {
        return s;
    }
});
// string type expressions
var ResultIsString6 = swcHelpers.typeOf(objA.a);
var ResultIsString7 = swcHelpers.typeOf(M.n);
var ResultIsString8 = swcHelpers.typeOf(STRING1[0]);
var ResultIsString9 = swcHelpers.typeOf(foo());
var ResultIsString10 = swcHelpers.typeOf(A.foo());
var ResultIsString11 = swcHelpers.typeOf(STRING + STRING);
var ResultIsString12 = swcHelpers.typeOf(STRING.charAt(0));
// multiple typeof  operators
var ResultIsString13 = swcHelpers.typeOf(typeof STRING === "undefined" ? "undefined" : swcHelpers.typeOf(STRING));
var ResultIsString14 = swcHelpers.typeOf(swcHelpers.typeOf(swcHelpers.typeOf(STRING + STRING)));
// miss assignment operators
swcHelpers.typeOf("");
typeof STRING === "undefined" ? "undefined" : swcHelpers.typeOf(STRING);
typeof STRING1 === "undefined" ? "undefined" : swcHelpers.typeOf(STRING1);
swcHelpers.typeOf(foo());
swcHelpers.typeOf(objA.a), M.n;
// use typeof in type query
var z;
var x;
var r;
z: typeof STRING === "undefined" ? "undefined" : swcHelpers.typeOf(STRING);
x: typeof STRING1 === "undefined" ? "undefined" : swcHelpers.typeOf(STRING1);
r: typeof foo === "undefined" ? "undefined" : swcHelpers.typeOf(foo);
var y = {
    a: "",
    b: ""
};
z: swcHelpers.typeOf(y.a);
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
