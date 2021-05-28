var c = 1;
!(function () {
    do {
        c *= 10;
    } while (f());
    function f() {
        return (function () {
            return (c = 2 + c) < 100;
        })((c = c + 3));
    }
})();
console.log(c);
