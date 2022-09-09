function a() {
    class a {}
    a.bar;
    class s {}
    s.foo;
}
function s() {
    var a = class a {};
    a.bar;
    var s = class a {};
    s.bar;
}
