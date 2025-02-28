function o(o, a) {
    var c = console.log;
    var n = ++a;
    if (o) o += n;
    c(n, o);
}
function n(o, a) {
    var c = console.log;
    var n = ++a;
    o && (o += n);
    c(n, o);
}
function a(o, a) {
    var c = console.log;
    var n = ++a;
    o ? (o += n) : o--;
    c(n, o);
}
o(1, 2);
n(3, 4);
a(5, 6);
