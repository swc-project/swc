//// [genericCallWithArrayLiteralArgs.ts]
function foo(t) {
    return t;
}
var r = foo([
    1,
    2
]), r = foo([
    1,
    2
]), ra = foo([
    1,
    2
]), r2 = foo([]), r3 = foo([]), r4 = foo([
    1,
    ""
]), r5 = foo([
    1,
    ""
]), r6 = foo([
    1,
    ""
]);
