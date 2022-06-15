var a = "FAIL_1", b;
try {} finally{
    do {
        b = (function() {
            throw new Error("PASS");
        })();
        a = "FAIL_2";
        b && b.c;
    }while (0)
}
console.log(a);
