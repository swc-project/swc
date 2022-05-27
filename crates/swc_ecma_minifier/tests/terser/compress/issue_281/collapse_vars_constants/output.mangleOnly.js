function a(a) {
    var c = 4, b = a.prop, d = 5, e = sideeffect1(), f = sideeffect2();
    return (b + (function() {
        return e - c * f - d;
    })());
}
function b(a) {
    var c = 4, b = a.prop, d = 5, e = sideeffect1(), f = sideeffect2();
    return (b + (function() {
        return -c * f - d;
    })());
}
