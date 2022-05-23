var a = "PASS";
(function () {
    var b = 42;
    for (var c = 5; c > 0; ) c--;
    a = "FAIL";
    var a;
})();
console.log(a);
