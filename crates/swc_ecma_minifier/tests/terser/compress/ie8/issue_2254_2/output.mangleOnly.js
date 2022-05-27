"eeeeee";
try {
    console.log(b("PASS"));
} catch (a) {}
function b(a) {
    try {
        throw "FAIL";
    } catch (b) {
        return a;
    }
}
