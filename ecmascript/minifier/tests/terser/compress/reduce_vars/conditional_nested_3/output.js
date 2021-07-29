var n = 2, c = 0;
(function f(a) {
    function g() {
        a && c++;
    }
    0 < n-- && g(a = 1);
    g();
    0 < n-- && f();
})();
console.log(c);
