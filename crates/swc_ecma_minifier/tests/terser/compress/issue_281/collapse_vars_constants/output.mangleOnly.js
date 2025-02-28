function e(e) {
    var n = 4, f = e.prop, r = 5, t = sideeffect1(), c = sideeffect2();
    return (f + (function() {
        return t - n * c - r;
    })());
}
function f(e) {
    var n = 4, f = e.prop, r = 5, t = sideeffect1(), c = sideeffect2();
    return (f + (function() {
        return -n * c - r;
    })());
}
