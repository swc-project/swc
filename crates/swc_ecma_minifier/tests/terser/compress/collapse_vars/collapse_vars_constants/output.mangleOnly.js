function e(e) {
    var r = 4, n = e.prop, t = 5, f = sideeffect1(), u = sideeffect2();
    return (n + (function() {
        return f - r * u - t;
    })());
}
function n(e) {
    var r = 4, n = e.prop, t = 5, f = sideeffect1(), u = sideeffect2();
    return (n + (function() {
        return -r * u - t;
    })());
}
function r(e) {
    var r = 4, n = e.prop, t = 5, f = sideeffect1();
    return (n + (function() {
        return -r - t;
    })());
}
