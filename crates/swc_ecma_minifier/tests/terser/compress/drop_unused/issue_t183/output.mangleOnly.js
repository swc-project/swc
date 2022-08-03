function n(n) {
    function r(n) {
        if (n) return n;
        r(n - 1);
    }
    return r(n);
}
console.log(n("PASS"));
