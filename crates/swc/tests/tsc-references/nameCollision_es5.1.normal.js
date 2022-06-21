import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A;
(function(A) {
    // these 2 statements force an underscore before the 'A' 
    // in the generated function call.
    var A1 = 12;
    var _A = "";
})(A || (A = {}));
var B;
(function(B) {
    var A = 12;
})(B || (B = {}));
(function(B) {
    // re-opened module with colliding name
    // this should add an underscore.
    var B1 = function B1() {
        "use strict";
        _class_call_check(this, B1);
    };
})(B || (B = {}));
var X;
(function(X) {
    var _$X = 13;
    var Y;
    (function(Y) {
        var _$Y = 13;
        var Z;
        (function(Z) {
            var _$X = 12;
            var _$Y = 12;
            var Z1 = 12;
        })(Z = Y.Z || (Y.Z = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
var Y;
(function(Y) {
    var _$Y;
    (function(Y) {
        var _$Y;
        (function(_$Y) {
            _$Y[_$Y["Red"] = 0] = "Red";
            _$Y[_$Y["Blue"] = 1] = "Blue";
        })(_$Y = Y.Y || (Y.Y = {}));
    })(_$Y = Y.Y || (Y.Y = {}));
})(Y || (Y = {}));
// no collision, since interface doesn't
// generate code.
var D;
(function(D) {
    var E = D.E = "hello";
})(D || (D = {}));
