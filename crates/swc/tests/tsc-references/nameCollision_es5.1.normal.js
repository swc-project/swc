import * as swcHelpers from "@swc/helpers";
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
    var _$B = function _$B() {
        "use strict";
        swcHelpers.classCallCheck(this, _$B);
    };
})(B || (B = {}));
var X;
(function(X2) {
    var X1 = 13;
    var _$Y;
    (function(Y2) {
        var Y1 = 13;
        var Z;
        (function(Z) {
            var X = 12;
            var Y = 12;
            var Z1 = 12;
        })(Z = Y2.Z || (Y2.Z = {}));
    })(_$Y = X2.Y || (X2.Y = {}));
})(X || (X = {}));
var Y;
(function(Y3) {
    var _$Y;
    (function(Y4) {
        var _$Y;
        (function(_$Y) {
            _$Y[_$Y["Red"] = 0] = "Red";
            _$Y[_$Y["Blue"] = 1] = "Blue";
        })(_$Y = Y4.Y || (Y4.Y = {}));
    })(_$Y = Y3.Y || (Y3.Y = {}));
})(Y || (Y = {}));
// no collision, since interface doesn't
// generate code.
var D;
(function(D1) {
    var E = D1.E = "hello";
})(D || (D = {}));
