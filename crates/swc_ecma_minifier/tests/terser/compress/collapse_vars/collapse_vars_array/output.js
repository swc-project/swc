function f1(x, y) {
    return [x + y];
}
function f2(x, y) {
    return [x, side_effect(), x + y];
}
function f3(x, y) {
    return [[3], [f(x + y), x, y], [g()]];
}
