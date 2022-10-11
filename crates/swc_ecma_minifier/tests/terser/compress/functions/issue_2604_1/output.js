var a = "FAIL";
(function() {
    try {
        throw 1;
    } catch (b1) {
        var b;
        b && b();
        b1 && (a = "PASS");
    }
})();
console.log(a);
