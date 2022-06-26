var a = 3, b = 1, c = 2;
(function() {
    (function b() {
        while(--a >= 0 && d());
    })();
    function d() {
        b++ + (c += b);
    }
})();
console.log(b);
