var STRING, M1, STRING1 = [
    "",
    ""
];
function foo() {
    return "";
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
++STRING, ++STRING1, STRING++, STRING1++, ++"", ++{
    x: "",
    y: ""
}, ++{
    x: "",
    y: (s)=>s
}, ""++, {
    x: "",
    y: ""
}++, {
    x: "",
    y: (s)=>s
}++, ++objA.a, ++M1.n, ++STRING1[0], ++foo(), ++A.foo(), ++STRING + STRING, objA.a++, M1.n++, STRING1[0]++, foo()++, A.foo()++, STRING + STRING++, ++"", ++STRING, ++STRING1, ++STRING1[0], ++foo(), ++objA.a, ++M1.n, ++objA.a, M1.n, ""++, STRING++, STRING1++, STRING1[0]++, foo()++, objA.a++, M1.n++, objA.a++, M1.n++;
