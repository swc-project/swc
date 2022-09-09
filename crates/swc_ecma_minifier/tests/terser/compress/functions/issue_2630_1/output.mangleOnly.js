var n = 0;
(function () {
    while (o());
    function o() {
        var o = (function () {
            var o = n++,
                c = (n = 1 + n);
        })();
    }
})();
console.log(n);
