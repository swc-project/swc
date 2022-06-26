var a = console.log;
function b(b, c) {
    var d = c;
    if (b) return b;
    a(d);
}
b(false, 1);
b(true, 2);
