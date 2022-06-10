function a() {
    var c = 7;
    var a = "abcdef";
    var b = 2;
    var d = console.log.bind(console);
    var e = a.charAt(b++);
    var f = a.charAt(b++);
    var g = a.charAt(b++);
    d(e, f, g, c);
}
function b() {
    var c = 7;
    var d = console.log.bind(console);
    var b = "abcdef";
    var a = 2;
    var e = b.charAt(a++);
    var f = b.charAt(a++);
    var g = b.charAt(a++);
    d(e, a, f, g, c);
}
function c() {
    var c = 7;
    var a = "abcdef";
    var b = 2;
    var d = console.log.bind(console);
    var e = a.charAt(b++);
    var f = a.charAt(b++);
    var g = a.charAt(b++);
    d(e, g, f, c);
}
function d() {
    var b = console.log.bind(console), a = 10, c = (a += 2), d = (a += 3), e = (a += 4);
    b(c, e, d, a);
}
a(), b(), c(), d();
