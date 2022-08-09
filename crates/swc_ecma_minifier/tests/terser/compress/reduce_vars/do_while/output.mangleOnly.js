function n(n) {
    do {
        (function() {
            n && (o = "PASS");
        })();
    }while ((n = 0))
}
var o = "FAIL";
n(1);
console.log(o);
