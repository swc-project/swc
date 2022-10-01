var b = 1;
(function f(f) {
    (f = b)[b] = 0;
})();
console.log("PASS");
