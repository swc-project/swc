var b = "FAIL_1", a;
try {} finally{
    do {
        a = (function() {
            throw new Error("PASS");
        })();
        b = "FAIL_2";
        a && a.c;
    }while (0)
}
console.log(b);
