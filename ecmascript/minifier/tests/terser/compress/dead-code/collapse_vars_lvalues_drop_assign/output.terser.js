function f0(x) {
    var i = ++x;
    return x + i;
}
function f1(x) {
    var a = (x -= 3);
    return x + a;
}
function f2(x) {
    var z = x,
        a = ++z;
    return z + a;
}
