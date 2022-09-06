function o(o) {
    try {
        try {
            throw "foo";
        } catch (r) {
            return (o = true);
        }
    } finally {
        o && (r = "PASS");
    }
}
var r = "FAIL";
o();
console.log(r);
