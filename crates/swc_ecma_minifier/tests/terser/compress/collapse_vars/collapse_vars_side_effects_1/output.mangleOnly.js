function a() {
    var c = 7;
    var a = "abcdef";
    var r = 2;
    var o = console.log.bind(console);
    var v = a.charAt(r++);
    var n = a.charAt(r++);
    var t = a.charAt(r++);
    o(v, n, t, c);
}
function r() {
    var c = 7;
    var o = console.log.bind(console);
    var r = "abcdef";
    var a = 2;
    var v = r.charAt(a++);
    var n = r.charAt(a++);
    var t = r.charAt(a++);
    o(v, a, n, t, c);
}
function c() {
    var c = 7;
    var a = "abcdef";
    var r = 2;
    var o = console.log.bind(console);
    var v = a.charAt(r++);
    var n = a.charAt(r++);
    var t = a.charAt(r++);
    o(v, t, n, c);
}
function o() {
    var r = console.log.bind(console), a = 10, c = (a += 2), o = (a += 3), v = (a += 4);
    r(c, v, o, a);
}
a(), r(), c(), o();
