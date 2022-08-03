function n() {
    var n = t();
    if (n !== (n = t())) console.log("PASS");
    else console.log("FAIL");
}
function t() {
    function n() {}
    try {
        throw n;
    } catch (t) {
        return t;
    }
}
n();
