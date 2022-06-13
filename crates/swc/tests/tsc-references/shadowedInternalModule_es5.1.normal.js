import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// all errors imported modules conflict with local variables
var A;
(function(A1) {
    var Point = A1.Point = {
        x: 0,
        y: 0
    };
})(A || (A = {}));
var B;
(function(B) {
    var A = {
        x: 0,
        y: 0
    };
})(B || (B = {}));
var X;
(function(X1) {
    var Y = function Y() {
        "use strict";
        _class_call_check(this, Y);
    };
    X1.Y = Y;
})(X || (X = {}));
var Z;
(function(Z) {
    var Y = 12;
})(Z || (Z = {}));
