var X1;
(function(X) {
    var Z1;
    (function(Z) {
        Z.foo = 0;
    })(Z1 || (Z1 = {
    }));
    X.Z = Z1;
})(X1 || (X1 = {
}));
var Y;
(function(Y) {
    (function(Z) {
        Z.bar = 1;
    })(Z1 || (Z1 = {
    }));
})(Y || (Y = {
}));
