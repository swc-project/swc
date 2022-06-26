var A;
(function(A) {
    // these 2 statements force an underscore before the 'A' 
    // in the generated function call.
    var A1 = 12;
    var _A = '';
})(A || (A = {}));
var B;
(function(B) {
    var A = 12;
})(B || (B = {}));
(function(B) {
    // re-opened module with colliding name
    // this should add an underscore.
    class B1 {
    }
})(B || (B = {}));
var X;
(function(X) {
    var X1 = 13;
    let Y;
    (function(Y) {
        var Y1 = 13;
        let Z;
        (function(Z) {
            var X = 12;
            var Y = 12;
            var Z1 = 12;
        })(Z = Y.Z || (Y.Z = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
var Y;
(function(Y) {
    let Y1;
    (function(Y) {
        let Y1;
        (function(Y1) {
            Y1[Y1["Red"] = 0] = "Red";
            Y1[Y1["Blue"] = 1] = "Blue";
        })(Y1 = Y.Y || (Y.Y = {}));
    })(Y1 = Y.Y || (Y.Y = {}));
})(Y || (Y = {}));
// no collision, since interface doesn't
// generate code.
var D;
(function(D) {
    var E = D.E = 'hello';
})(D || (D = {}));
