var n = 0;
(function() {
    while(i());
    function i() {
        var i = (function() {
            var i = n++, o = (n = 1 + n);
        })();
    }
})();
console.log(n);
