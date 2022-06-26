function a(a) {
    var b = 4, c = a.prop, d = 5, e = sideeffect1(), f = sideeffect2();
    return (c + (function() {
        return e - b * f - d;
    })());
}
function b(a) {
    var b = 4, c = a.prop, d = 5, e = sideeffect1(), f = sideeffect2();
    return (c + (function() {
        return -b * f - d;
    })());
}
function c(a) {
    var b = 4, c = a.prop, d = 5, e = sideeffect1();
    return (c + (function() {
        return -b - d;
    })());
}
