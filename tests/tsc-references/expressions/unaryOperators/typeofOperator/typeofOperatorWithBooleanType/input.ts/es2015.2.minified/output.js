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
}(M1 || (M1 = {
}));
var M1, objA = new A();
objA.a, foo(), A.foo(), foo(), objA.a;
z: ;
r: "function";
z: ;
z: objA.a;
z: ;
z: ;
