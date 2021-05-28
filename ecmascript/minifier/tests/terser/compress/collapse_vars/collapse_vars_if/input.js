function f1() {
    var not_used = sideeffect(),
        x = g1 + g2;
    var y = x / 4,
        z = "Bar" + y;
    if ("x" != z) {
        return g9;
    } else return g5;
}
function f2() {
    var x = g1 + g2,
        not_used = sideeffect();
    var y = x / 4;
    var z = "Bar" + y;
    if ("x" != z) {
        return g9;
    } else return g5;
}
function f3(x) {
    if (x) {
        var a = 1;
        return a;
    } else {
        var b = 2;
        return b;
    }
}
