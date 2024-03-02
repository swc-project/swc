(function() {
    var a = "FAIL";
    if (a == a) console.log(function() {
        return function() {
            return "PASS";
        }();
    }());
})();
