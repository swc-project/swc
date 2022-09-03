//// [genericCallWithFunctionTypedArguments2.ts]
function foo(x) {
    return new x(null);
}
var i, i2, a, r = foo(i), r2 = foo(i), r3 = foo(i2), r3b = foo(a);
function foo2(x, cb) {
    return new cb(x);
}
var r4 = foo2(1, i2), r4b = foo2(1, a), r5 = foo2(1, i), r6 = foo2("", i2);
function foo3(x, cb, y) {
    return new cb(x);
}
var r7 = foo3(null, i, ""), r7b = foo3(null, a, ""), r8 = foo3(1, i2, 1), r9 = foo3("", i2, "");
