function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A;
(function(A1) {
    // these 2 statements force an underscore before the 'A' 
    // in the generated function call.
    var A = 12;
    var _A = '';
})(A || (A = {}));
var B;
(function(B) {
    var A = 12;
})(B || (B = {}));
(function(B) {
    var B1 = function B1() {
        "use strict";
        _classCallCheck(this, B1);
    };
})(B || (B = {}));
var X;
(function(X1) {
    var X = 13;
    var Y2;
    (function(Y1) {
        var Y = 13;
        var Z;
        (function(Z1) {
            var X = 12;
            var Y = 12;
            var Z = 12;
        })(Z = Y1.Z || (Y1.Z = {}));
    })(Y2 = X1.Y || (X1.Y = {}));
})(X || (X = {}));
var Y;
(function(Y4) {
    var Y3;
    (function(Y5) {
        var Y3;
        (function(Y3) {
            Y3[Y3["Red"] = 0] = "Red";
            Y3[Y3["Blue"] = 1] = "Blue";
        })(Y3 = Y5.Y || (Y5.Y = {}));
    })(Y3 = Y4.Y || (Y4.Y = {}));
})(Y || (Y = {}));
// no collision, since interface doesn't
// generate code.
var D;
(function(D1) {
    var E = D1.E = 'hello';
})(D || (D = {}));
