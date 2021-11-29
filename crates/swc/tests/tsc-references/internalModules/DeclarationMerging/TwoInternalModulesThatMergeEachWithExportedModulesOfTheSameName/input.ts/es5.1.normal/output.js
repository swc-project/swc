function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A;
(function(A) {
    var B;
    (function(B) {
        var x;
        B.x = x;
    })(B || (B = {
    }));
})(A || (A = {
}));
// ensure the right var decl is exported
var x1;
var x1 = A.B.x;
var X;
(function(X) {
    var Y;
    (function(Y) {
        var Z;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _classCallCheck(this, Line);
            };
            Z.Line = Line;
        })(Z || (Z = {
        }));
    })(Y || (Y = {
    }));
    X.Y = Y;
})(X || (X = {
}));
// make sure merging works as expected
var l;
var l;
