var X;
(function(X) {
    let Z;
    (function(Z) {
        const foo = Z.foo = 0;
    })(Z = X.Z || (X.Z = {}));
})(X || (X = {}));
var Y;
(function(Y) {
    let Z;
    (function(Z) {
        const bar = Z.bar = 1;
    })(Z = Y.Z || (Y.Z = {}));
})(Y || (Y = {}));
