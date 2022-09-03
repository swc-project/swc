//// [genericCallWithObjectTypeArgsAndInitializers.ts]
function foo() {
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
    return x;
}
function foo2() {
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
    return x;
}
function foo3() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}
function foo4(x) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
function foo5(x) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
function foo6(x, y) {
    arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
}
function foo7(x) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
