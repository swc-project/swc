var o = "FAIL_1",
    r;
try {
    throw 0;
} catch (c) {
    do {
        r = (function () {
            throw new Error("PASS");
        })();
        o = "FAIL_2";
        r && r.c;
    } while (0);
}
console.log(o);
