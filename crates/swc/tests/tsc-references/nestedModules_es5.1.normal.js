var A;
(function(A1) {
    var B;
    (function(B) {
        var Point = {
            x: 0,
            y: 0
        }; // bug 832088: could not find module 'C'
    })(B = A1.B || (A1.B = {}));
})(A || (A = {}));
var M2;
(function(M21) {
    var X1;
    (function(X) {
        var Point;
        X.Point = Point;
    })(X1 = M21.X || (M21.X = {}));
})(M2 || (M2 = {}));
var m = M2.X;
var point;
var point = m.Point;
var p;
var p;
