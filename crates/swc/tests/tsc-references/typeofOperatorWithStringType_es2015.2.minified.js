function foo() {
    return "abc";
}
class A {
    static foo() {
        return "";
    }
}
!function(M1) {
    var n;
    M1.n = n;
}(M || (M = {}));
var STRING, M, objA = new A();
objA.a, M.n, foo(), A.foo(), STRING.charAt(0), foo(), objA.a, M.n;
z: ;
x: ;
r: ;
z: "";
z: objA.a;
z: A.foo;
z: M.n;
