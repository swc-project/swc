var a = "FAIL";
(function(b) {
    a = "PASS";
    return;
    b(a);
})();
console.log(a);
