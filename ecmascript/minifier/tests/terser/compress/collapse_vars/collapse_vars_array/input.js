function f1(x, y) {
    var z = x + y;
    return [z];
}
function f2(x, y) {
    var z = x + y;
    return [x, side_effect(), z];
}
function f3(x, y) {
    var z = f(x + y);
    return [[3], [z, x, y], [g()]];
}
