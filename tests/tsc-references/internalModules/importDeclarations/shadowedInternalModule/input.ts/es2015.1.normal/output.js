// all errors imported modules conflict with local variables
var A;
(function(A) {
    A.Point = {
        x: 0,
        y: 0
    };
})(A || (A = {
}));
var B;
(function(B) {
    var A1 = {
        x: 0,
        y: 0
    };
    var Point = A1;
})(B || (B = {
}));
var X;
(function(X) {
    class Y {
    }
    X.Y = Y;
})(X || (X = {
}));
var Z;
(function(Z) {
    var Y = X.Y;
    var Y = 12;
})(Z || (Z = {
}));
