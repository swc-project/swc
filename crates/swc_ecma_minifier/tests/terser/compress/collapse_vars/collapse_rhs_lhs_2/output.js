var b = 1;
(function f(f1) {
    (f1 = b)[b] = 0;
})();
console.log("PASS");
