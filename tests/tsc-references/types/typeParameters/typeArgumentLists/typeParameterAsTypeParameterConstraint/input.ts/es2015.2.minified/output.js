var a, b;
function foo(x, y) {
    return y;
}
function foo2(x, y) {
    return y;
}
foo(1, 2), foo({
}, 1), foo(a, b), foo({
    x: 1
}, {
    x: 2,
    y: 3
}), foo2(1, ""), foo2({
}, {
    length: 2
}), foo2(1, {
    width: 3,
    length: 2
}), foo2(1, []), foo2(1, [
    ""
]);
