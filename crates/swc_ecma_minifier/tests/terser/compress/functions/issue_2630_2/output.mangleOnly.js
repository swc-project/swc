var n = 0;
!(function () {
    while (o()) {}
    function o() {
        var o = (function () {
            n = 1 + n;
        })((n = n + 1));
    }
})();
console.log(n);
