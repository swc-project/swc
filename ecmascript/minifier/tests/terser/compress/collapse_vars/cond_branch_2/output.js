function f1(b, c) {
    var a = ++c;
    if (b) b += a;
    (0, console.log)(a, b);
}
function f2(b, c) {
    var a = ++c;
    b && (b += a), (0, console.log)(a, b);
}
function f3(b, c) {
    var a = ++c;
    b ? (b += a) : b--, (0, console.log)(a, b);
}
f1(1, 2), f2(3, 4), f3(5, 6);
