var X;
(function(X) {
    var Z;
    (function(Z) {
        Z.foo = 0;
    })(Z || (Z = {
    }));
    X.Z = Z;
})(X || (X = {
}));
var Y;
(function(Y) {
    (function(Z) {
        Z.bar = 1;
    })(Z || (Z = {
    }));
})(Y || (Y = {
}));
