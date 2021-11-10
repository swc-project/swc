var b = 1;
(function f(f) {
    f = b;
    f[b] = 0;
})();
console.log("PASS");
