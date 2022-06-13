import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// - operator on any type
var ANY;
var ANY1;
var ANY2 = [
    "",
    ""
];
var obj;
var obj1 = {
    x: "",
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
var M;
(function(M1) {
    var n;
    M1.n = n;
})(M || (M = {}));
var objA = new A();
// any type var
var ResultIsNumber1 = -ANY1;
var ResultIsNumber2 = -ANY2;
var ResultIsNumber3 = -A;
var ResultIsNumber4 = -M;
var ResultIsNumber5 = -obj;
var ResultIsNumber6 = -obj1;
// any type literal
var ResultIsNumber7 = -undefined;
var ResultIsNumber = -null;
// any type expressions
var ResultIsNumber8 = -ANY2[0];
var ResultIsNumber9 = -obj1.x;
var ResultIsNumber10 = -obj1.y;
var ResultIsNumber11 = -objA.a;
var ResultIsNumber12 = -M.n;
var ResultIsNumber13 = -foo();
var ResultIsNumber14 = -A.foo();
var ResultIsNumber15 = -(ANY - ANY1);
// miss assignment operators
-ANY;
-ANY1;
-ANY2[0];
-ANY, ANY1;
-objA.a;
-M.n;
