"eeeeee";
try {
    console.log(f("PASS"));
} catch (e) {}
function f(s) {
    try {
        throw "FAIL";
    } catch (e) {
        return s;
    }
}
