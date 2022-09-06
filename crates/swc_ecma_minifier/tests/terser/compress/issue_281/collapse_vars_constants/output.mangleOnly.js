function e(e) {
    var f = 4,
        n = e.prop,
        r = 5,
        t = sideeffect1(),
        c = sideeffect2();
    return (
        n +
        (function () {
            return t - f * c - r;
        })()
    );
}
function f(e) {
    var f = 4,
        n = e.prop,
        r = 5,
        t = sideeffect1(),
        c = sideeffect2();
    return (
        n +
        (function () {
            return -f * c - r;
        })()
    );
}
