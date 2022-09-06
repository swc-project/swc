"eeeeee";
try {
    console.log(e("PASS"));
} catch (e) {}
function e(e) {
    try {
        throw "FAIL";
    } catch (t) {
        return e;
    }
}
