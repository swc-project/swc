"eeeeee";
try {
    console.log(t("PASS"));
} catch (e) {}
function t(e) {
    try {
        throw "FAIL";
    } catch (t) {
        return e;
    }
}
