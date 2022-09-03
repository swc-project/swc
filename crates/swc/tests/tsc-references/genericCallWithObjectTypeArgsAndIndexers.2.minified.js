//// [genericCallWithObjectTypeArgsAndIndexers.ts]
function foo(x) {
    return x;
}
var a, r = foo(a);
function other(arg) {
    var r2 = foo(void 0);
    r2[1], r2["1"];
}
