class A {
    static foo() {
        return 1;
    }
}
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var M, objA = new A();
objA.a, M.n, A.foo(), objA.a, M.n, objA.a, M.n;
z: objA.a;
z: A.foo;
z: M.n;
