function n(n) {
    o(n);
}
function o(n) {
    if (n === 1) {
        throw new Error();
    }
}
n(3);
n(2);
n(1);
