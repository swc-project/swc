var b, a = "FAIL_1";
try {
    throw 0;
} catch (e) {
    do {
        b = function() {
            throw Error("PASS");
        }();
        a = "FAIL_2";
        b && b.c;
    }while (0)
}
console.log(a);
