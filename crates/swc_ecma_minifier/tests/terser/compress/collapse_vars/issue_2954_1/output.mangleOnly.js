var o = "PASS", c;
try {
    do {
        c = (function() {
            throw 0;
        })();
        o = "FAIL";
        c && c.c;
    }while (0)
} catch (t) {}
console.log(o);
