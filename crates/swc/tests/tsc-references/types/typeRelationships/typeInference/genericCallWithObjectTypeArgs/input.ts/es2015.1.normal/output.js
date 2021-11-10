class C {
}
class D {
}
class X {
}
function foo(t, t2) {
    var x;
    return x;
}
var c1 = new X();
var d1 = new X();
var r = foo(c1, d1); // error
var r2 = foo(c1, c1); // ok
