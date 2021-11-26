var X;
(function(X) {
    let Z;
    (function(Z) {
        Z.foo = 0;
    })(Z || (Z = {
    }));
    X.Z = Z;
})(X || (X = {
}));
var Y;
(function(Y) {
    let Z;
    (function(Z) {
        Z.bar = 1;
    })(Z || (Z = {
    }));
    Y.Z = Z;
})(Y || (Y = {
}));
