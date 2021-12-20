var M;
class A {
    static foo() {
        return 1;
    }
}
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {
}));
var objA = new A();
objA.a, M.n, A.foo(), objA.a, M.n, objA.a, M.n;
