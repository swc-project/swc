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
var X2;
(function(X) {
    var X1 = 13;
    var Y2;
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
    })(Y2 || (Y2 = {
    }));
    X.Y = Y2;
})(X2 || (X2 = {
}));
// no collision, since interface doesn't
// generate code.
var D1;
(function(D) {
    D.E = 'hello';
})(D1 || (D1 = {
}));
