var a = "FAIL";
(function() {
    try {
        throw 1;
    } catch (b) {
        b && (a = "PASS");
    }
})();
console.log(a);
