function o(o, n) {
    var a = console.log;
    var c = ++n;
    if (o) o += c;
    a(c, o);
}
function n(o, n) {
    var a = console.log;
    var c = ++n;
    o && (o += c);
    a(c, o);
}
function a(o, n) {
    var a = console.log;
    var c = ++n;
    o ? (o += c) : o--;
    a(c, o);
}
o(1, 2);
n(3, 4);
a(5, 6);
