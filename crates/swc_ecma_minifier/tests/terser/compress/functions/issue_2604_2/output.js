var a = "FAIL";
(function() {
    try {
        throw 1;
    } catch (o) {
        o && (a = "PASS");
    }
})();
console.log(a);
