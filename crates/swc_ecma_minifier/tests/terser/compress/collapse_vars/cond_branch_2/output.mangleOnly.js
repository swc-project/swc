function a(a, n) {
    var o = console.log;
    var r = ++n;
    if (a) a += r;
    o(r, a);
}
function n(a, n) {
    var o = console.log;
    var r = ++n;
    a && (a += r);
    o(r, a);
}
function o(a, n) {
    var o = console.log;
    var r = ++n;
    a ? (a += r) : a--;
    o(r, a);
}
a(1, 2);
n(3, 4);
o(5, 6);
