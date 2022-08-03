var o = "FAIL_1", t;
try {
    throw 0;
} catch (c) {
    do {
        t = (function() {
            throw new Error("PASS");
        })();
        o = "FAIL_2";
        t && t.c;
    }while (0)
}
console.log(o);
