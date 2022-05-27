var a = 1, b = "PASS";
do {
    (function() {
        (function(a) {
            a = 0 != (a && (b = "FAIL"));
        })();
    })();
}while (a--)
console.log(b);
