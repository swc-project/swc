var l = "FAIL_1", n;
try {} finally{
    do {
        n = (function() {
            throw new Error("PASS");
        })();
        l = "FAIL_2";
        n && n.c;
    }while (0)
}
console.log(l);
