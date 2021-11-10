function f1(b, c) {
    var log = console.log;
    var a = ++c;
    if (b) b += a;
    log(a, b);
}
function f2(b, c) {
    var log = console.log;
    var a = ++c;
    b && (b += a);
    log(a, b);
}
function f3(b, c) {
    var log = console.log;
    var a = ++c;
    b ? (b += a) : b--;
    log(a, b);
}
f1(1, 2);
f2(3, 4);
f3(5, 6);
