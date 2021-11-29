var STRING, M;
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
}(M || (M = {
}));
var objA = new A();
objA.a, M.n, foo(), A.foo(), STRING.charAt(0), foo(), objA.a, M.n;
