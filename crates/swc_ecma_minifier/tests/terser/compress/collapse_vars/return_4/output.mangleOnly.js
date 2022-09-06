var n = "FAIL";
(function (o) {
    n = "PASS";
    return;
    o(n);
})();
console.log(n);
