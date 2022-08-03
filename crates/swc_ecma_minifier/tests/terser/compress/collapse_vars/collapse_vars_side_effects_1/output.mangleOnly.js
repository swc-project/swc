function a() {
    var a = 7;
    var r = "abcdef";
    var v = 2;
    var c = console.log.bind(console);
    var t = r.charAt(v++);
    var n = r.charAt(v++);
    var h = r.charAt(v++);
    c(t, n, h, a);
}
function r() {
    var a = 7;
    var r = console.log.bind(console);
    var v = "abcdef";
    var c = 2;
    var t = v.charAt(c++);
    var n = v.charAt(c++);
    var h = v.charAt(c++);
    r(t, c, n, h, a);
}
function v() {
    var a = 7;
    var r = "abcdef";
    var v = 2;
    var c = console.log.bind(console);
    var t = r.charAt(v++);
    var n = r.charAt(v++);
    var h = r.charAt(v++);
    c(t, h, n, a);
}
function c() {
    var a = console.log.bind(console), r = 10, v = (r += 2), c = (r += 3), t = (r += 4);
    a(v, t, c, r);
}
a(), r(), v(), c();
