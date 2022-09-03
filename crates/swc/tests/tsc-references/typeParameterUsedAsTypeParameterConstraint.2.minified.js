//// [typeParameterUsedAsTypeParameterConstraint.ts]
function foo(x, y) {
    return y;
}
function foo2(x, y) {
    return y;
}
var f = function(x, y) {
    return y;
}, f2 = function(x, y) {
    return y;
}, f3 = function(x, y) {
    return y;
}, f4 = function(x, y) {
    return y;
};
