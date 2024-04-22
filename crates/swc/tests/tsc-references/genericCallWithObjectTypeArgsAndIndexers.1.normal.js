//// [genericCallWithObjectTypeArgsAndIndexers.ts]
// Type inference infers from indexers in target type, no errors expected
function foo(x) {
    return x;
}
var a;
var r = foo(a);
function other(arg) {
    var b;
    var r2 = foo(b);
    var d = r2[1];
    var e = r2['1'];
}
