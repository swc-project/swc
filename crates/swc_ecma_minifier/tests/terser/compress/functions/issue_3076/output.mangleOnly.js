var r = "PASS";
(function(r) {
    var n = 2;
    while(--r + (function() {
        n && (r = "FAIL");
        n = 5;
        return 1;
        try {
            var r = 5;
        } catch (n) {
            var n;
        }
    })().toString() && --n > 0);
})(2);
console.log(r);
