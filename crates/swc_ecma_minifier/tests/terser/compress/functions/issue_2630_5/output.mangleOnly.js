var n = 1;
!(function () {
    do {
        n *= 10;
    } while (o());
    function o() {
        return (function () {
            return (n = 2 + n) < 100;
        })((n = n + 3));
    }
})();
console.log(n);
