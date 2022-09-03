//// [genericCallWithObjectTypeArgsAndNumericIndexer.ts]
function foo(x) {
    return x;
}
var a, r = foo(a);
function other(arg) {
    foo(void 0);
}
function other2(arg) {
    foo(void 0)[1];
}
function other3(arg) {
    foo(void 0)[1];
}
