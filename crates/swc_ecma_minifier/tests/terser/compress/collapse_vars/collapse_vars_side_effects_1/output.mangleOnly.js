function a() {
    var a = 7;
    var r = "abcdef";
    var c = 2;
    var o = console.log.bind(console);
    var v = r.charAt(c++);
    var n = r.charAt(c++);
    var t = r.charAt(c++);
    o(v, n, t, a);
}
function r() {
    var a = 7;
    var r = console.log.bind(console);
    var c = "abcdef";
    var o = 2;
    var v = c.charAt(o++);
    var n = c.charAt(o++);
    var t = c.charAt(o++);
    r(v, o, n, t, a);
}
function c() {
    var a = 7;
    var r = "abcdef";
    var c = 2;
    var o = console.log.bind(console);
    var v = r.charAt(c++);
    var n = r.charAt(c++);
    var t = r.charAt(c++);
    o(v, t, n, a);
}
function o() {
    var a = console.log.bind(console),
        r = 10,
        c = (r += 2),
        o = (r += 3),
        v = (r += 4);
    a(c, v, o, r);
}
a(), r(), c(), o();
