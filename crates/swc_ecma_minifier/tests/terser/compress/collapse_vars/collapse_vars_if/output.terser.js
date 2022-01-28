function f1() {
    sideeffect();
    return "x" != "Bar" + (g1 + g2) / 4 ? g9 : g5;
}
function f2() {
    var x = g1 + g2;
    sideeffect();
    return "x" != "Bar" + x / 4 ? g9 : g5;
}
function f3(x) {
    if (x) {
        return 1;
    }
    return 2;
}
