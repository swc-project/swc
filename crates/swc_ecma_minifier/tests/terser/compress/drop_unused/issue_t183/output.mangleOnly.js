function n(n) {
    function o(n) {
        if (n) return n;
        o(n - 1);
    }
    return o(n);
}
console.log(n("PASS"));
