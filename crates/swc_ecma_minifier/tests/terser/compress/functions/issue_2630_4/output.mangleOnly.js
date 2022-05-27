var b = 3, a = 1, c = 2;
(function() {
    (function a() {
        while(--b >= 0 && d());
    })();
    function d() {
        a++ + (c += a);
    }
})();
console.log(a);
