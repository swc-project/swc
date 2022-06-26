var a = 2, b = 1;
(function() {
    function c(b) {
        d();
        --a >= 0 && c({});
    }
    c(b++);
    function d() {
        b++;
    }
})();
console.log(b);
