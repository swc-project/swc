var a = "PASS";
(function () {
    for (var b = 42, c = 5, a; c > 0; ) c--;
    a = "FAIL";
})();
console.log(a);
