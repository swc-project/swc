var A;
(function(A1) {
    let B1;
    (function(B) {
        var x1;
        B.x = x1;
    })(B1 || (B1 = {
    }));
    A1.B = B1;
})(A || (A = {
}));
(function(A) {
    let B2;
    (function(B) {
        var x2;
        B.x = x2;
    })(B2 || (B2 = {
    }));
})(A || (A = {
}));
// ensure the right var decl is exported
var x;
var x = A.B.x;
var X;
(function(X1) {
    let Y1;
    (function(Y) {
        let Z1;
        (function(Z) {
            class Line {
            }
            Z.Line = Line;
        })(Z1 || (Z1 = {
        }));
        Y.Z = Z1;
    })(Y1 || (Y1 = {
    }));
    X1.Y = Y1;
})(X || (X = {
}));
(function(X2) {
    let Y;
    (function(Y) {
        let Z2;
        (function(Z) {
            class Line {
            }
            Z.Line = Line;
        })(Z2 || (Z2 = {
        }));
    })(Y || (Y = {
    }));
    X2.Y = Y;
})(X || (X = {
}));
// make sure merging works as expected
var l;
var l;
