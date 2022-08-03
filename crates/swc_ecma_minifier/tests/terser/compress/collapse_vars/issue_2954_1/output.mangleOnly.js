var c = "PASS", o;
try {
    do {
        o = (function() {
            throw 0;
        })();
        c = "FAIL";
        o && o.c;
    }while (0)
} catch (t) {}
console.log(c);
