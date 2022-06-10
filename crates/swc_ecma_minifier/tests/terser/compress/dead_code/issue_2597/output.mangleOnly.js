function a(a) {
    try {
        try {
            throw "foo";
        } catch (c) {
            return (a = true);
        }
    } finally{
        a && (b = "PASS");
    }
}
var b = "FAIL";
a();
console.log(b);
