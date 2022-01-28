var n = 2, c = 0;
(function f(a) {
    0 < n-- && g(a = 1);
    function g() {
        a && c++;
    }
    g();
    0 < n-- && f();
})();
console.log(c);
