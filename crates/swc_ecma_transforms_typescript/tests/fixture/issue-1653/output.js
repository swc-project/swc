(function(X) {
    (function(Z) {
        Z.foo = 0;
    })(X.Z || (X.Z = {}));
})(X || (X = {}));
(function(Y) {
    (function(Z) {
        Z.bar = 1;
    })(Y.Z || (Y.Z = {}));
})(Y || (Y = {}));
var X, Y;
