function f(a) {
    do {
        (function () {
            a && (c = "PASS");
        })();
    } while ((a = 0));
}
var c = "FAIL";
f(1);
console.log(c);
