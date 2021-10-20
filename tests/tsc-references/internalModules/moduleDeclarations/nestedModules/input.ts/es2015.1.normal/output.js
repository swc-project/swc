var A1;
(function(A) {
    var B;
    (function(B) {
        var Point = {
            x: 0,
            y: 0
        }; // bug 832088: could not find module 'C'
    })(B || (B = {
    }));
    A.B = B;
})(A1 || (A1 = {
}));
var M21;
(function(M2) {
    var X1;
    (function(X) {
        var Point;
        X.Point = Point;
    })(X1 || (X1 = {
    }));
    M2.X = X1;
})(M21 || (M21 = {
}));
var m = M21.X;
var point;
var point = m.Point;
var p;
var p;
