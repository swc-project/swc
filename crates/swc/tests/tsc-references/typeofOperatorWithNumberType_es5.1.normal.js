import * as swcHelpers from "@swc/helpers";
// @allowUnusedLabels: true
// typeof  operator on number type
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
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, null, [
        {
            key: "foo",
            value: function foo() {
                return 1;
            }
        }
    ]);
    return A;
}();
var M;
(function(M1) {
    var n;
    M1.n = n;
})(M || (M = {}));
var objA = new A();
// number type var
var ResultIsString1 = typeof NUMBER === "undefined" ? "undefined" : swcHelpers.typeOf(NUMBER);
var ResultIsString2 = typeof NUMBER1 === "undefined" ? "undefined" : swcHelpers.typeOf(NUMBER1);
// number type literal
var ResultIsString3 = swcHelpers.typeOf(1);
var ResultIsString4 = swcHelpers.typeOf({
    x: 1,
    y: 2
});
var ResultIsString5 = swcHelpers.typeOf({
    x: 1,
    y: function(n) {
        return n;
    }
});
// number type expressions
var ResultIsString6 = swcHelpers.typeOf(objA.a);
var ResultIsString7 = swcHelpers.typeOf(M.n);
var ResultIsString8 = swcHelpers.typeOf(NUMBER1[0]);
var ResultIsString9 = swcHelpers.typeOf(foo());
var ResultIsString10 = swcHelpers.typeOf(A.foo());
var ResultIsString11 = swcHelpers.typeOf(NUMBER + NUMBER);
// multiple typeof  operators
var ResultIsString12 = swcHelpers.typeOf(typeof NUMBER === "undefined" ? "undefined" : swcHelpers.typeOf(NUMBER));
var ResultIsString13 = swcHelpers.typeOf(swcHelpers.typeOf(swcHelpers.typeOf(NUMBER + NUMBER)));
// miss assignment operators
swcHelpers.typeOf(1);
typeof NUMBER === "undefined" ? "undefined" : swcHelpers.typeOf(NUMBER);
typeof NUMBER1 === "undefined" ? "undefined" : swcHelpers.typeOf(NUMBER1);
swcHelpers.typeOf(foo());
swcHelpers.typeOf(objA.a);
swcHelpers.typeOf(M.n);
swcHelpers.typeOf(objA.a), M.n;
// use typeof in type query
var z;
var x;
z: typeof NUMBER === "undefined" ? "undefined" : swcHelpers.typeOf(NUMBER);
x: typeof NUMBER1 === "undefined" ? "undefined" : swcHelpers.typeOf(NUMBER1);
r: typeof foo === "undefined" ? "undefined" : swcHelpers.typeOf(foo);
var y = {
    a: 1,
    b: 2
};
z: swcHelpers.typeOf(y.a);
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
