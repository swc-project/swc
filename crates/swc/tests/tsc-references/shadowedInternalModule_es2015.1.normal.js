// all errors imported modules conflict with local variables
var A;
(function(A) {
    var Point = A.Point = {
        x: 0,
        y: 0
    };
})(A || (A = {}));
var B;
(function(B) {
    var A = {
        x: 0,
        y: 0
    };
})(B || (B = {}));
var X;
(function(X) {
    class Y {
    }
    X.Y = Y;
})(X || (X = {}));
var Z;
(function(Z) {
    var Y = 12;
})(Z || (Z = {}));
