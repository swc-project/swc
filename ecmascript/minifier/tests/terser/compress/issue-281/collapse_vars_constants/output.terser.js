function f1(x) {
    var b = x.prop,
        d = sideeffect1(),
        e = sideeffect2();
    return b + (d - 4 * e - 5);
}
function f2(x) {
    var b = x.prop;
    sideeffect1();
    return b + (-4 * sideeffect2() - 5);
}
