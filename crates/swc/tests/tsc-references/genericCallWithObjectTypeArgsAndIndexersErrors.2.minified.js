//// [genericCallWithObjectTypeArgsAndIndexersErrors.ts]
function foo(x) {
    return x;
}
function other(arg) {
    foo(void 0);
}
function other3(arg) {
    var r2 = foo(void 0);
    r2[1], r2["1"], r2[1];
}
