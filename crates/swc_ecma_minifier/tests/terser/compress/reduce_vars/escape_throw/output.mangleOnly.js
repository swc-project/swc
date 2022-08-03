function n() {
    var n = t();
    if (n !== (n = t())) console.log("FAIL");
    else console.log("PASS");
}
function t() {
    try {
        throw o;
    } catch (n) {
        return n;
    }
}
function o() {}
n();
