function f1(x) {
    var a = 4,
        b = x.prop,
        c = 5,
        d = sideeffect1(),
        e = sideeffect2();
    return (
        b +
        (function () {
            return d - a * e - c;
        })()
    );
}
function f2(x) {
    var a = 4,
        b = x.prop,
        c = 5,
        not_used = sideeffect1(),
        e = sideeffect2();
    return (
        b +
        (function () {
            return -a * e - c;
        })()
    );
}
