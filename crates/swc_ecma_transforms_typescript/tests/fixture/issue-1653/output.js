var X;
(function(X) {
    let Z;
    (function(Z) {
        var foo = Z.foo = 0;
    })(Z = X.Z || (X.Z = {}));
})(X || (X = {}));
var Y;
(function(Y) {
    let Z;
    (function(Z) {
        var bar = Z.bar = 1;
    })(Z = Y.Z || (Y.Z = {}));
})(Y || (Y = {}));
