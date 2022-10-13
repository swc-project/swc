//// [nameCollision.ts]
var A, B, X, Y, D;
A || (A = {}), B || (B = {}), B || (B = {}), function(X) {
    var Y;
    (Y = X.Y || (X.Y = {})).Z || (Y.Z = {});
}(X || (X = {})), function(Y) {
    var Y1, _$Y;
    (_$Y = (Y1 = Y.Y || (Y.Y = {})).Y || (Y1.Y = {}))[_$Y.Red = 0] = "Red", _$Y[_$Y.Blue = 1] = "Blue";
}(Y || (Y = {})), (D || (D = {})).E = "hello";
