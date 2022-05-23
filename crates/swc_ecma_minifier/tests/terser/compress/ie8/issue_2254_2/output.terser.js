"eeeeee";
try {
    console.log(f("PASS"));
} catch (e) {}
function f(t) {
    try {
        throw "FAIL";
    } catch (e) {
        return t;
    }
}
