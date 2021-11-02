M = null; // Error
class C {
}
C = null; // Error
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
E1 = null; // Error
E1.A = null; // OK per spec, Error per implementation (509581)
function fn() {
}
fn = null; // Should be error
var v;
v = null; // OK
function fn2(p) {
    p = null; // OK
}
I = null; // Error
