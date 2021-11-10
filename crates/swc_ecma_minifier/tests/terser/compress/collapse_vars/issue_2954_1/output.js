var b, a = "PASS";
try {
    do {
        b = (function() {
            throw 0;
        })();
        a = "FAIL";
        b && b.c;
    }while (0)
} catch (e) {
}
console.log(a);
