var STRING, M1;
function foo() {
    return "abc";
}
class A {
    static foo() {
        return "";
    }
}
!function(M) {
    var n;
    M.n = n;
}(M1 || (M1 = {
}));
var objA = new A();
objA.a, M1.n, foo(), A.foo(), STRING.charAt(0), foo(), objA.a, M1.n;
z: ;
x: "object";
r: "function";
z: "";
z: objA.a;
z: ;
z: M1.n;
