var A;
(function(A) {
    let B;
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
    let Y;
    (function(Y) {
        let Z;
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
