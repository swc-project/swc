function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// -- operator on number type
var NUMBER;
var NUMBER1 = [
    1,
    2
];
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var M1;
(function(M) {
    var n;
    M.n = n;
})(M1 || (M1 = {
}));
var objA = new A();
// number type var
var ResultIsNumber1 = --NUMBER;
var ResultIsNumber2 = NUMBER--;
// expressions
var ResultIsNumber3 = --objA.a;
var ResultIsNumber4 = --M1.n;
var ResultIsNumber5 = objA.a--;
var ResultIsNumber6 = M1.n--;
var ResultIsNumber7 = NUMBER1[0]--;
// miss assignment operators
--NUMBER;
--NUMBER1[0];
--objA.a;
--M1.n;
--objA.a, M1.n;
NUMBER--;
NUMBER1[0]--;
objA.a--;
M1.n--;
objA.a--, M1.n--;
