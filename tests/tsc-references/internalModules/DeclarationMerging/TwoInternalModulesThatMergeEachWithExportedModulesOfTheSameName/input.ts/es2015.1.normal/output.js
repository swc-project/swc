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
var x;
var x = A.B.x;
var X;
(function(X) {
    var Y;
    (function(Y) {
        var Z;
        (function(Z) {
            class Line {
            }
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
