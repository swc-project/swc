(function () {
    var n;
    function o(n) {
        return (function () {
            console.log(n);
        })();
    }
    for (n in { a: 1, b: 2, c: 3 }) o(n);
})();
