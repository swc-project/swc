var x = 3, a = 1, b = 2;
(function() {
    while(--x >= 0 && f2());
    function f2() {
        a++, b += a;
    }
})();
console.log(a);
