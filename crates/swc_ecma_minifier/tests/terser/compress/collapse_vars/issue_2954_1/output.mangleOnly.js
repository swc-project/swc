var b = "PASS", a;
try {
    do {
        a = (function() {
            throw 0;
        })();
        b = "FAIL";
        a && a.c;
    }while (0)
} catch (c) {}
console.log(b);
