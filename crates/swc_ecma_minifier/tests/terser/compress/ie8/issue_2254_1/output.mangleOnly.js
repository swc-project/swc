"eeeeee";
try {
    console.log(c("PASS"));
} catch (t) {}
function c(t) {
    try {
        throw "FAIL";
    } catch (c) {
        return t;
    }
}
