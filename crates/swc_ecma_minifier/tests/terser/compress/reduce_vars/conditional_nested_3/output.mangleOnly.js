var o = 2, n = 0;
(function c(i) {
    0 < o-- && f((i = 1));
    function f() {
        i && n++;
    }
    f();
    0 < o-- && c();
})();
console.log(n);
