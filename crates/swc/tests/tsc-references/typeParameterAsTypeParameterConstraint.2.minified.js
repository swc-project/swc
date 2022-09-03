//// [typeParameterAsTypeParameterConstraint.ts]
function foo(x, y) {
    return y;
}
var a, b, r = foo(1, 2), r = foo({}, 1), r2 = foo(a, b), r3 = foo({
    x: 1
}, {
    x: 2,
    y: 3
});
function foo2(x, y) {
    return y;
}
foo2(1, ""), foo2({}, {
    length: 2
}), foo2(1, {
    width: 3,
    length: 2
}), foo2(1, []), foo2(1, [
    ""
]);
