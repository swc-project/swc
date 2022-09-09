function e(e) {
    var n = 4,
        r = e.prop,
        t = 5,
        f = sideeffect1(),
        u = sideeffect2();
    return (
        r +
        (function () {
            return f - n * u - t;
        })()
    );
}
function n(e) {
    var n = 4,
        r = e.prop,
        t = 5,
        f = sideeffect1(),
        u = sideeffect2();
    return (
        r +
        (function () {
            return -n * u - t;
        })()
    );
}
function r(e) {
    var n = 4,
        r = e.prop,
        t = 5,
        f = sideeffect1();
    return (
        r +
        (function () {
            return -n - t;
        })()
    );
}
