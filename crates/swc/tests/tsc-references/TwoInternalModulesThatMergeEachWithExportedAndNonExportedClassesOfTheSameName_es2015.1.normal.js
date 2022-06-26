var A;
(function(A) {
    class Point {
    }
    A.Point = Point;
})(A || (A = {}));
(function(A) {
    class Point {
        fromCarthesian(p) {
            return {
                x: p.x,
                y: p.y
            };
        }
    }
})(A || (A = {}));
// ensure merges as expected
var p;
var p;
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
        })(Z = Y.Z || (Y.Z = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
// ensure merges as expected
var l;
var l;
