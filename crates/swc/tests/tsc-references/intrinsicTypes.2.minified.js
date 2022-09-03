//// [intrinsicTypes.ts]
function foo1(s, x, y) {
    s = x, x = s = y, x = y, y = s, y = x;
}
function foo2(x) {}
function foo4(x) {
    return foo3(x);
}
