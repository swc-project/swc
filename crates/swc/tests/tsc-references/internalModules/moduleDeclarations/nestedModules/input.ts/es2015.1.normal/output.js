var A;
(function(A) {
    let B;
    (function(B) {
        var Point = {
            x: 0,
            y: 0
        }; // bug 832088: could not find module 'C'
    })(B || (B = {
    }));
    A.B = B;
})(A || (A = {
}));
var M2;
(function(M2) {
    let X;
    (function(X) {
        var Point;
        X.Point = Point;
    })(X || (X = {
    }));
    M2.X = X;
})(M2 || (M2 = {
}));
var m = M2.X;
var point;
var point = m.Point;
var p;
var p;
