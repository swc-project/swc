function foo() {
    return !0;
}
class A {
    static foo() {
        return !0;
    }
}
!function(M) {
    var n;
    M.n = n;
}(M || (M = {
}));
var BOOLEAN, M, objA = new A();
++BOOLEAN, BOOLEAN++, ++!0, ++{
    x: !0,
    y: !1
}, ++{
    x: !0,
    y: (n)=>n
}, !0++, {
    x: !0,
    y: !1
}++, {
    x: !0,
    y: (n)=>n
}++, ++objA.a, ++M.n, ++foo(), ++A.foo(), foo()++, A.foo()++, objA.a++, M.n++, ++!0, ++BOOLEAN, ++foo(), ++objA.a, ++M.n, ++objA.a, !0++, BOOLEAN++, foo()++, objA.a++, M.n++, objA.a++, M.n++;
