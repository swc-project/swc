var a = "FAIL";
(function() {
    try {
        throw 1;
    } catch (b1) {
        var b;
        (void 0) && b();
        b1 && (a = "PASS");
    }
})();
console.log(a);
