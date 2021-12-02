var A;
(function(A) {
    var B1;
    (function(B) {
        var x1;
        B.x = x1;
    })(B1 || (B1 = {
    }));
})(A || (A = {
}));
// ensure the right var decl is exported
var x;
var x = A.B.x;
var X;
(function(X1) {
    var Y;
    (function(Y) {
        var Z1;
        (function(Z) {
            class Line {
            }
            Z.Line = Line;
        })(Z1 || (Z1 = {
        }));
    })(Y || (Y = {
    }));
    X1.Y = Y;
})(X || (X = {
}));
// make sure merging works as expected
var l;
var l;
