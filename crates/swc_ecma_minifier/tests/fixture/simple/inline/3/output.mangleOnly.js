function n(n) {
    f(n);
}
function f(n) {
    if (n === 1) {
        throw new Error();
    }
}
n(3);
n(2);
n(1);
