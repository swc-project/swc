function a(a, b) {
    var c = console.log;
    var d = ++b;
    if (a) a += d;
    c(d, a);
}
function b(a, b) {
    var c = console.log;
    var d = ++b;
    a && (a += d);
    c(d, a);
}
function c(a, b) {
    var c = console.log;
    var d = ++b;
    a ? (a += d) : a--;
    c(d, a);
}
a(1, 2);
b(3, 4);
c(5, 6);
