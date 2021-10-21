// all errors imported modules conflict with local variables
var A1;
(function(A) {
    A.Point = {
        x: 0,
        y: 0
    };
})(A1 || (A1 = {
}));
var B;
(function(B) {
    var A = {
        x: 0,
        y: 0
    };
    var Point = A;
})(B || (B = {
}));
var X1;
(function(X) {
    class Y {
    }
    X.Y = Y;
})(X1 || (X1 = {
}));
var Z;
(function(Z) {
    var Y = X1.Y;
    var Y = 12;
})(Z || (Z = {
}));
