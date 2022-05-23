var b, a = "FAIL_1";
try {} finally{
    do {
        a = "FAIL_2";
        (b = function() {
            throw new Error("PASS");
        }()) && b.c;
    }while (0)
}
console.log(a);
