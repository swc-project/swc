var a = "FAIL_1",
    b;
try {
    throw 0;
} catch (e) {
    do {
        a = "FAIL_2";
        (b = (function () {
            throw new Error("PASS");
        })()) && b.c;
    } while (0);
}
console.log(a);
