var a = "PASS";
(function(b) {
    var c = 2;
    while(--b + (function() {
        c && (a = "FAIL");
        c = 5;
        return 1;
        try {
            var b = 5;
        } catch (c) {
            var c;
        }
    })().toString() && --c > 0);
})(2);
console.log(a);
