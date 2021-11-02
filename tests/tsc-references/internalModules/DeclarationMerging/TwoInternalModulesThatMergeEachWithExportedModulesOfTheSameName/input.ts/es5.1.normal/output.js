function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A;
(function(A) {
    var B1;
    (function(B) {
        var x;
        B.x = x;
    })(B1 || (B1 = {
    }));
})(A || (A = {
}));
// ensure the right var decl is exported
var x1;
var x1 = A.B.x;
var X1;
(function(X) {
    var Y;
    (function(Y) {
        var Z1;
        (function(Z) {
            var Line = function Line() {
                "use strict";
                _classCallCheck(this, Line);
            };
            Z.Line = Line;
        })(Z1 || (Z1 = {
        }));
    })(Y || (Y = {
    }));
    X.Y = Y;
})(X1 || (X1 = {
}));
// make sure merging works as expected
var l;
var l;
