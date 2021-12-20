function foo(x, y) {
    return y;
}
function foo2(x, y) {
    return y;
}
foo(1, ""), foo(1, {
}), foo(1, void 0), foo2(1, {
    length: ""
}), foo2(1, {
    length: {
    }
}), foo2([], [
    ""
]);
