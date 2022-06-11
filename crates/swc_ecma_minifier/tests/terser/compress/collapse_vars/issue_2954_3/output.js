var b, a = "FAIL_1";
try {} finally{
    do {
        a = "FAIL_2";
        (b = function() {
            throw Error("PASS");
        }()) && b.c;
    }while (0)
}
console.log(a);
