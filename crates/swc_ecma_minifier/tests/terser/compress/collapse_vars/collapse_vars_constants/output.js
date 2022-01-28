function f1(x) {
    var b = x.prop,
        d = sideeffect1(),
        e = sideeffect2();
    return (
        b +
        (function () {
            return d - 4 * e - 5;
        })()
    );
}
function f2(x) {
    var b = x.prop,
        e = (sideeffect1(), sideeffect2());
    return (
        b +
        (function () {
            return -4 * e - 5;
        })()
    );
}
function f3(x) {
    var b = x.prop;
    sideeffect1();
    return (
        b +
        (function () {
            return -9;
        })()
    );
}
