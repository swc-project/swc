function f1(b, c) {
    if (b) b++;
    (0, console.log)(++c, b);
}
function f2(b, c) {
    b && b++, (0, console.log)(++c, b);
}
function f3(b, c) {
    b ? b++ : b--, (0, console.log)(++c, b);
}
f1(1, 2), f2(3, 4), f3(5, 6);
