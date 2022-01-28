function f(b) {
    try {
        try {
            throw "foo";
        } catch (e) {
            return (b = true);
        }
    } finally {
        b && (a = "PASS");
    }
}
var a = "FAIL";
f();
console.log(a);
