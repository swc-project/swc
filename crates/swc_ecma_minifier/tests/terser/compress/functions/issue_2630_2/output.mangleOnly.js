var n = 0;
!(function() {
    while(i()){}
    function i() {
        var i = (function() {
            n = 1 + n;
        })((n = n + 1));
    }
})();
console.log(n);
