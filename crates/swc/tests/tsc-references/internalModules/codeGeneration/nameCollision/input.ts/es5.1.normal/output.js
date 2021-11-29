function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A;
(function(A) {
    // these 2 statements force an underscore before the 'A' 
    // in the generated function call.
    var A1 = 12;
    var _A = '';
})(A || (A = {
}));
var B;
(function(B) {
    var A = 12;
})(B || (B = {
}));
(function(B) {
    var B1 = function B1() {
        "use strict";
        _classCallCheck(this, B1);
    };
})(B || (B = {
}));
var X;
(function(X) {
    var X1 = 13;
    var Y;
    (function(Y) {
        var Y1 = 13;
        var Z;
        (function(Z) {
            var X = 12;
            var Y = 12;
            var Z1 = 12;
        })(Z || (Z = {
        }));
        Y.Z = Z;
    })(Y || (Y = {
    }));
    X.Y = Y;
})(X || (X = {
}));
// no collision, since interface doesn't
// generate code.
var D;
(function(D) {
    D.E = 'hello';
})(D || (D = {
}));
