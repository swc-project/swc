//// [nameCollision.ts]
var Y, D;
A = {}, function(X1) {
    var Y;
    (Y = X1.Y || (X1.Y = {})).Z || (Y.Z = {});
}(X = {}), function(Y) {
    var Y1, _$Y;
    (_$Y = (Y1 = Y.Y || (Y.Y = {})).Y || (Y1.Y = {}))[_$Y.Red = 0] = "Red", _$Y[_$Y.Blue = 1] = "Blue";
}(Y || (Y = {})), (D || (D = {})).E = "hello";
