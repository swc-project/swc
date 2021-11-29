var A;
(function(A) {
    class Point {
    }
    A.Point = Point;
})(A || (A = {
}));
(function(A) {
    class Point {
        fromCarthesian(p) {
            return {
                x: p.x,
                y: p.y
            };
        }
    }
})(A || (A = {
}));
// ensure merges as expected
var p1;
var p1;
var X;
(function(X) {
    let Y;
    (function(Y) {
        let Z;
        (function(Z) {
            class Line {
            }
        })(Z || (Z = {
        }));
        Y.Z = Z;
    })(Y || (Y = {
    }));
    X.Y = Y;
})(X || (X = {
}));
// ensure merges as expected
var l;
var l;
