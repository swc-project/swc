var STRING, M;
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
var objA = new A();
objA.a, M.n, foo(), A.foo(), STRING + STRING, STRING.charAt(0), foo(), objA.a, M.n;
z: ;
x: "object";
r: "function";
z: "";
z: objA.a;
z: ;
z: M.n;
