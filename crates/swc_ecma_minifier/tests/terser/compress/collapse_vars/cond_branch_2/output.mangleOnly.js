function a(a, c) {
    var d = console.log;
    var b = ++c;
    if (a) a += b;
    d(b, a);
}
function b(a, c) {
    var d = console.log;
    var b = ++c;
    a && (a += b);
    d(b, a);
}
function c(a, c) {
    var d = console.log;
    var b = ++c;
    a ? (a += b) : a--;
    d(b, a);
}
a(1, 2);
b(3, 4);
c(5, 6);
