var n = 1, o = "PASS";
do {
    (function() {
        (function(n) {
            n = 0 != (n && (o = "FAIL"));
        })();
    })();
}while (n--)
console.log(o);
