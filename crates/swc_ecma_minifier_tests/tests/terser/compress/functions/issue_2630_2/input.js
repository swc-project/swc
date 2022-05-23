var c = 0;
!(function () {
    while (f()) {}
    function f() {
        var not_used = (function () {
            c = 1 + c;
        })((c = c + 1));
    }
})();
console.log(c);
