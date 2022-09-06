(function () {
    var n,
        o = {};
    function c(n) {
        return function () {
            console.log(n);
        };
    }
    for (n in { a: 1, b: 2, c: 3 }) o[n] = c(n);
    for (n in o) o[n]();
})();
