//// [typeParameterAsTypeParameterConstraint2.ts]
function foo(x, y) {
    return y;
}
foo(1, ""), foo(1, {});
var n, r3 = foo(1, n);
function foo2(x, y) {
    return y;
}
foo2(1, {
    length: ""
}), foo2(1, {
    length: {}
}), foo2([], [
    ""
]);
