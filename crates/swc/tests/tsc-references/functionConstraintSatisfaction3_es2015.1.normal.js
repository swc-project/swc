// satisfaction of a constraint to Function, no errors expected
function foo(x) {
    return x;
}
var i;
class C {
}
var a;
var b;
var c;
var r1 = foo((x)=>x);
var r2 = foo((x)=>x);
var r3 = foo(function(x) {
    return x;
});
var r4 = foo(function(x) {
    return x;
});
var r5 = foo(i);
var r8 = foo(c);
var i2;
class C2 {
}
var a2;
var b2;
var c2;
var r9 = foo(function(x) {
    return x;
});
var r10 = foo((x)=>x);
var r12 = foo(i2);
var r15 = foo(c2);
