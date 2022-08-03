function n() {
    for (const n of c(t)){
        console.log(n);
    }
    function c(n) {
        return o(n);
    }
}
function o(n) {
    return [
        n,
        2 * n,
        3 * n
    ];
}
const t = 10;
n();
