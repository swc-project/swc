var b = console.log;
function a(a, c) {
    var d = c();
    if (a) return a;
    b(d);
}
a(false, function() {
    return 1;
});
a(true, function() {
    return 2;
});
