var o = 2, n = 1;
(function() {
    function c(n) {
        f();
        --o >= 0 && c({});
    }
    c(n++);
    function f() {
        n++;
    }
})();
console.log(n);
