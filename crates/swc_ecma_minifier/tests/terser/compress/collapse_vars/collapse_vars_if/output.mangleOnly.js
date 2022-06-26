function a() {
    var a = sideeffect(), b = g1 + g2;
    var c = b / 4, d = "Bar" + c;
    if ("x" != d) {
        return g9;
    } else return g5;
}
function b() {
    var a = g1 + g2, b = sideeffect();
    var c = a / 4;
    var d = "Bar" + c;
    if ("x" != d) {
        return g9;
    } else return g5;
}
function c(a) {
    if (a) {
        var b = 1;
        return b;
    } else {
        var c = 2;
        return c;
    }
}
