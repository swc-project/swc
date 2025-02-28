var r = "PASS";
(function(n) {
    var t = 2;
    while(--n + (function() {
        n && (r = "FAIL");
        n = 5;
        return 1;
        try {
            var t = 5;
        } catch (n) {
            var n;
        }
    })().toString() && --t > 0);
})(2);
console.log(r);
