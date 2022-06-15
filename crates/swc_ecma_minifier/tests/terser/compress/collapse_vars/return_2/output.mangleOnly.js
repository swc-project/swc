var a = console.log;
function b(b, c) {
    var d = c();
    if (b) return b;
    a(d);
}
b(false, function() {
    return 1;
});
b(true, function() {
    return 2;
});
