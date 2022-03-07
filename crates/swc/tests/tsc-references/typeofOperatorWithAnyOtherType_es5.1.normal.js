import * as swcHelpers from "@swc/helpers";
// typeof  operator on any type
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
        swcHelpers.classCallCheck(this, A);
    }
    A.foo = function foo() {
        var a;
        return a;
    };
    return A;
}();
var M;
(function(M1) {
    var n;
    M1.n = n;
})(M || (M = {}));
var objA = new A();
// any type var
var ResultIsString1 = typeof ANY1 === "undefined" ? "undefined" : swcHelpers.typeOf(ANY1);
var ResultIsString2 = typeof ANY2 === "undefined" ? "undefined" : swcHelpers.typeOf(ANY2);
var ResultIsString3 = typeof A === "undefined" ? "undefined" : swcHelpers.typeOf(A);
var ResultIsString4 = typeof M === "undefined" ? "undefined" : swcHelpers.typeOf(M);
var ResultIsString5 = typeof obj === "undefined" ? "undefined" : swcHelpers.typeOf(obj);
var ResultIsString6 = typeof obj1 === "undefined" ? "undefined" : swcHelpers.typeOf(obj1);
// any type literal
var ResultIsString7 = typeof undefined === "undefined" ? "undefined" : swcHelpers.typeOf(undefined);
var ResultIsString8 = swcHelpers.typeOf(null);
var ResultIsString9 = swcHelpers.typeOf({});
// any type expressions
var ResultIsString10 = swcHelpers.typeOf(ANY2[0]);
var ResultIsString11 = swcHelpers.typeOf(objA.a);
var ResultIsString12 = swcHelpers.typeOf(obj1.x);
var ResultIsString13 = swcHelpers.typeOf(M.n);
var ResultIsString14 = swcHelpers.typeOf(foo());
var ResultIsString15 = swcHelpers.typeOf(A.foo());
var ResultIsString16 = swcHelpers.typeOf(ANY + ANY1);
var ResultIsString17 = swcHelpers.typeOf(null + undefined);
var ResultIsString18 = swcHelpers.typeOf(null + null);
var ResultIsString19 = swcHelpers.typeOf(undefined + undefined);
// multiple typeof  operators
var ResultIsString20 = swcHelpers.typeOf(typeof ANY === "undefined" ? "undefined" : swcHelpers.typeOf(ANY));
var ResultIsString21 = swcHelpers.typeOf(swcHelpers.typeOf(swcHelpers.typeOf(ANY + ANY1)));
// miss assignment operators
typeof ANY === "undefined" ? "undefined" : swcHelpers.typeOf(ANY);
typeof ANY1 === "undefined" ? "undefined" : swcHelpers.typeOf(ANY1);
swcHelpers.typeOf(ANY2[0]);
typeof ANY === "undefined" ? "undefined" : swcHelpers.typeOf(ANY), ANY1;
typeof obj1 === "undefined" ? "undefined" : swcHelpers.typeOf(obj1);
swcHelpers.typeOf(obj1.x);
swcHelpers.typeOf(objA.a);
swcHelpers.typeOf(M.n);
// use typeof in type query
var z;
var x;
var r;
z: typeof ANY === "undefined" ? "undefined" : swcHelpers.typeOf(ANY);
x: typeof ANY2 === "undefined" ? "undefined" : swcHelpers.typeOf(ANY2);
r: typeof foo === "undefined" ? "undefined" : swcHelpers.typeOf(foo);
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
z: swcHelpers.typeOf(obj1.x);
