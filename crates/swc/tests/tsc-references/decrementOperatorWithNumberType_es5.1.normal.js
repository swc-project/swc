import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// -- operator on number type
var NUMBER;
var NUMBER1 = [
    1,
    2
];
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var M;
(function(M1) {
    var n;
    M1.n = n;
})(M || (M = {}));
var objA = new A();
// number type var
var ResultIsNumber1 = --NUMBER;
var ResultIsNumber2 = NUMBER--;
// expressions
var ResultIsNumber3 = --objA.a;
var ResultIsNumber4 = --M.n;
var ResultIsNumber5 = objA.a--;
var ResultIsNumber6 = M.n--;
var ResultIsNumber7 = NUMBER1[0]--;
// miss assignment operators
--NUMBER;
--NUMBER1[0];
--objA.a;
--M.n;
--objA.a, M.n;
NUMBER--;
NUMBER1[0]--;
objA.a--;
M.n--;
objA.a--, M.n--;
