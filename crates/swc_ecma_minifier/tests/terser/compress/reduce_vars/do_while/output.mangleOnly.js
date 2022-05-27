function a(a) {
    do {
        (function() {
            a && (b = "PASS");
        })();
    }while ((a = 0))
}
var b = "FAIL";
a(1);
console.log(b);
