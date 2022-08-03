var r = console.log;
function a(a, e) {
    var f = (a <<= e);
    if (a) return a;
    r(f);
}
a(false, 1);
a(true, 2);
