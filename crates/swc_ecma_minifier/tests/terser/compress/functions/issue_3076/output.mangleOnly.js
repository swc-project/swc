var r = "PASS";
(function(t) {
    var n = 2;
    while(--t + (function() {
        n && (r = "FAIL");
        n = 5;
        return 1;
        try {
            var t = 5;
        } catch (n) {
            var n;
        }
    })().toString() && --n > 0);
})(2);
console.log(r);
