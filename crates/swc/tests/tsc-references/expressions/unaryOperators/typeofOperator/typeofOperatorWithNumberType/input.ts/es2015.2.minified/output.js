var M1;
class A {
    static foo() {
        return 1;
    }
}
!function(M) {
    var n;
    M.n = n;
}(M1 || (M1 = {
}));
var objA = new A();
objA.a, M1.n, A.foo(), objA.a, M1.n, objA.a, M1.n;
z: ;
x: "object";
r: "function";
z: ;
z: objA.a;
z: ;
z: M1.n;
