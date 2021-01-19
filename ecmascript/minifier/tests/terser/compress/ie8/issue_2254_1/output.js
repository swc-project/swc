"eeeeee";
try {
    console.log(f("PASS"));
} catch (e) {}
function f(e) {
    try {
        throw "FAIL";
    } catch (t) {
        return e;
    }
}
