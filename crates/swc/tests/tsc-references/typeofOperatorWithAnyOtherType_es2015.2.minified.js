var M, ANY2 = [
    "",
    ""
], obj1 = {
    x: "a",
    y () {}
};
class A {
    static foo() {}
}
!function(M) {
    var n;
    M.n = n;
}(M || (M = {}));
var objA = new A();
ANY2[0], objA.a, obj1.x, M.n, A.foo(), ANY2[0], obj1.x, objA.a, M.n;
z: objA.a;
z: A.foo;
z: M.n;
z: obj1.x;
