var n = "FAIL";
(function(r) {
    n = "PASS";
    return;
    r(n);
})();
console.log(n);
