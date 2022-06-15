function a() {
    var a = 7;
    var b = "abcdef";
    var c = 2;
    var d = console.log.bind(console);
    var e = b.charAt(c++);
    var f = b.charAt(c++);
    var g = b.charAt(c++);
    d(e, f, g, a);
}
function b() {
    var a = 7;
    var b = console.log.bind(console);
    var c = "abcdef";
    var d = 2;
    var e = c.charAt(d++);
    var f = c.charAt(d++);
    var g = c.charAt(d++);
    b(e, d, f, g, a);
}
function c() {
    var a = 7;
    var b = "abcdef";
    var c = 2;
    var d = console.log.bind(console);
    var e = b.charAt(c++);
    var f = b.charAt(c++);
    var g = b.charAt(c++);
    d(e, g, f, a);
}
function d() {
    var a = console.log.bind(console), b = 10, c = (b += 2), d = (b += 3), e = (b += 4);
    a(c, e, d, b);
}
a(), b(), c(), d();
