(function(X) {
    (function(Z) {
        Z.foo = 0;
    })(Z || (Z = {}));
    X.Z = Z;
})(X || (X = {}));
(function(Y) {
    (function(Z) {
        Z.bar = 1;
    })(Z || (Z = {}));
    Y.Z = Z;
})(Y || (Y = {}));
