function foo() {
    return !0;
}
class A {
    static foo() {
        return !1;
    }
}
!function(M) {
    var n;
    M.n = n;
}(M || (M = {
}));
var M, objA = new A();
objA.a, M.n, foo(), A.foo(), foo(), objA.a, M.n;
z: ;
r: "function";
z: ;
z: objA.a;
z: ;
z: M.n;
