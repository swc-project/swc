var a = "PASS";
(function(b) {
    var c = 2;
    while(--b + (function() {
        b && (a = "FAIL");
        b = 5;
        return 1;
        try {
            var c = 5;
        } catch (b) {
            var b;
        }
    })().toString() && --c > 0);
})(2);
console.log(a);
