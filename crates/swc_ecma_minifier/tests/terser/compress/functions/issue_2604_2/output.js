var a = "FAIL";
(function() {
    try {
        throw 1;
    } catch (c) {
        var o;
        (void 0) && o();
        c && (a = "PASS");
    }
})();
console.log(a);
