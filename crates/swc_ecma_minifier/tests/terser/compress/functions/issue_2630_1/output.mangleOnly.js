var a = 0;
(function() {
    while(b());
    function b() {
        var b = (function() {
            var b = a++, c = (a = 1 + a);
        })();
    }
})();
console.log(a);
