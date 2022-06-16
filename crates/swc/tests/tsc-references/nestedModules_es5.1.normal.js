var A;
(function(A) {
    var B;
    (function(B) {
        var Point = {
            x: 0,
            y: 0
        }; // bug 832088: could not find module 'C'
    })(B = A.B || (A.B = {}));
})(A || (A = {}));
var M2;
(function(M2) {
    var X;
    (function(X) {
        var Point;
        X.Point = Point;
    })(X = M2.X || (M2.X = {}));
})(M2 || (M2 = {}));
var m = M2.X;
var point;
var point = m.Point;
var p;
var p;
