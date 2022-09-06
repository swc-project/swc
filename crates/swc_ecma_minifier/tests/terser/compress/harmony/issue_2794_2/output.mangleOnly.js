function n() {
    for (const o of n(t)) {
        console.log(o);
    }
    function n(n) {
        return o(n);
    }
}
function o(n) {
    return [n, 2 * n, 3 * n];
}
const t = 10;
n();
