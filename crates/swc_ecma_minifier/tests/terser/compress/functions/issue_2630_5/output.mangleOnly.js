var a = 1;
!(function() {
    do {
        a *= 10;
    }while (b())
    function b() {
        return (function() {
            return (a = 2 + a) < 100;
        })((a = a + 3));
    }
})();
console.log(a);
