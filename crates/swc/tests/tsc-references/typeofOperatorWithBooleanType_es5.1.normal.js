import * as swcHelpers from "@swc/helpers";
// @allowUnusedLabels: true
// typeof  operator on boolean type
var BOOLEAN;
function foo() {
    return true;
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
                return false;
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
// boolean type var
var ResultIsString1 = typeof BOOLEAN === "undefined" ? "undefined" : swcHelpers.typeOf(BOOLEAN);
// boolean type literal
var ResultIsString2 = swcHelpers.typeOf(true);
var ResultIsString3 = swcHelpers.typeOf({
    x: true,
    y: false
});
// boolean type expressions
var ResultIsString4 = swcHelpers.typeOf(objA.a);
var ResultIsString5 = swcHelpers.typeOf(M.n);
var ResultIsString6 = swcHelpers.typeOf(foo());
var ResultIsString7 = swcHelpers.typeOf(A.foo());
// multiple typeof  operator
var ResultIsString8 = swcHelpers.typeOf(typeof BOOLEAN === "undefined" ? "undefined" : swcHelpers.typeOf(BOOLEAN));
// miss assignment operators
swcHelpers.typeOf(true);
typeof BOOLEAN === "undefined" ? "undefined" : swcHelpers.typeOf(BOOLEAN);
swcHelpers.typeOf(foo());
swcHelpers.typeOf(true), false;
swcHelpers.typeOf(objA.a);
swcHelpers.typeOf(M.n);
// use typeof in type query
var z;
var x;
var r;
z: typeof BOOLEAN === "undefined" ? "undefined" : swcHelpers.typeOf(BOOLEAN);
r: typeof foo === "undefined" ? "undefined" : swcHelpers.typeOf(foo);
var y = {
    a: true,
    b: false
};
z: swcHelpers.typeOf(y.a);
z: swcHelpers.typeOf(objA.a);
z: swcHelpers.typeOf(A.foo);
z: swcHelpers.typeOf(M.n);
