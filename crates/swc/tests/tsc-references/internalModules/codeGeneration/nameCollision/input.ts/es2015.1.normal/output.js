var A;
(function(A) {
    // these 2 statements force an underscore before the 'A' 
    // in the generated function call.
    var A1 = 12;
    var _A = '';
})(A || (A = {
}));
var B;
(function(B) {
    var A = 12;
})(B || (B = {
}));
(function(B) {
    // re-opened module with colliding name
    // this should add an underscore.
    class B1 {
    }
})(B || (B = {
}));
var X;
(function(X2) {
    var X1 = 13;
    let Y2;
    (function(Y) {
        var Y1 = 13;
        let Z;
        (function(Z) {
            var X = 12;
            var Y = 12;
            var Z1 = 12;
        })(Z || (Z = {
        }));
        Y.Z = Z;
    })(Y2 || (Y2 = {
    }));
    X2.Y = Y2;
})(X || (X = {
}));
// no collision, since interface doesn't
// generate code.
var D;
(function(D1) {
    D1.E = 'hello';
})(D || (D = {
}));
