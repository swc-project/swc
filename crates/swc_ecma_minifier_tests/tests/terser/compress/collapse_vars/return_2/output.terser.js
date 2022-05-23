var log = console.log;
function f(b, c) {
    var a = c();
    if (b) return b;
    log(a);
}
f(false, function () {
    return 1;
});
f(true, function () {
    return 2;
});
