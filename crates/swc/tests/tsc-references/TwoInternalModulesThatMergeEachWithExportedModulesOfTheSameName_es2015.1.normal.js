var A;
(function(A) {
    let B;
    (function(B) {
        var x;
        B.x = x;
    })(B = A.B || (A.B = {}));
})(A || (A = {}));
(function(A) {
    let B;
    (function(B) {
        var x;
        B.x = x;
    })(B || (B = {}));
})(A || (A = {}));
// ensure the right var decl is exported
var x;
var x = A.B.x;
var X;
(function(X) {
    let Y;
    (function(Y) {
        let Z;
        (function(Z) {
            class Line {
            }
            Z.Line = Line;
        })(Z = Y.Z || (Y.Z = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
(function(X) {
    let Y;
    (function(Y) {
        let Z;
        (function(Z) {
            class Line {
            }
            Z.Line = Line;
        })(Z || (Z = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
// make sure merging works as expected
var l;
var l;
